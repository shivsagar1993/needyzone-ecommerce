import { useCallback, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useNotificationStore } from '@/app/_zustand/notificationStore';
import { notificationApi } from '@/lib/notification-api';
import apiClient from '@/lib/api';
import { NotificationFilters } from '@/types/notification';
import toast from 'react-hot-toast';

// In-memory cache for user email -> user ID to avoid repeating DB lookups on every notification poll
const userIdCache = new Map<string, string>();

/**
 * Custom hook for managing notifications
 */
export const useNotifications = () => {
  const { data: session } = useSession();
  const {
    notifications,
    unreadCount,
    total,
    page,
    totalPages,
    loading,
    error,
    filters,
    selectedIds,
    setNotifications,
    setLoading,
    setError,
    setFilters,
    markAsRead,
    deleteNotification,
    clearSelection,
    setUnreadCount
  } = useNotificationStore();

  // Get current user ID with caching
  const getCurrentUserId = useCallback(async () => {
    const email = session?.user?.email;
    if (!email) return null;
    
    if (userIdCache.has(email)) {
      return userIdCache.get(email) || null;
    }

    try {
      const response = await apiClient.get(`/api/users/email/${encodeURIComponent(email)}`);
      if (!response.ok) return null;
      const userData = await response.json();
      if (userData?.id) {
        userIdCache.set(email, userData.id);
        return userData.id;
      }
      return null;
    } catch (error) {
      console.warn('Unable to reach user lookup for notifications:', error);
      return null;
    }
  }, [session?.user?.email]);

  // Fetch notifications
  const fetchNotifications = useCallback(async (customFilters?: NotificationFilters) => {
    const userId = await getCurrentUserId();
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const filtersToUse = customFilters || filters;
      const response = await notificationApi.getUserNotifications(userId, filtersToUse);
      setNotifications(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters, getCurrentUserId, setNotifications, setLoading, setError]);

  // Fetch unread count only
  const fetchUnreadCount = useCallback(async () => {
    const userId = await getCurrentUserId();
    if (!userId) return;

    try {
      const { unreadCount } = await notificationApi.getUnreadCount(userId);
      setUnreadCount(unreadCount || 0);
    } catch (error) {
      // Silently defer - do not crash UI
    }
  }, [getCurrentUserId, setUnreadCount]);

  // Mark single notification as read
  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationApi.updateNotification(notificationId, true);
      markAsRead(notificationId);
      toast.success('Notification marked as read');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as read';
      toast.error(errorMessage);
    }
  }, [markAsRead]);

  // Mark multiple notifications as read
  const markSelectedAsRead = useCallback(async () => {
    const userId = await getCurrentUserId();
    const idsToMarkRead = [...selectedIds];
    
    if (!userId || idsToMarkRead.length === 0) return;

    try {
      await notificationApi.bulkMarkAsRead({
        notificationIds: idsToMarkRead,
        userId
      });
      
      idsToMarkRead.forEach(id => markAsRead(id));
      clearSelection();
      
      await fetchUnreadCount();
      toast.success(`${idsToMarkRead.length} notifications marked as read`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark notifications as read';
      toast.error(errorMessage);
    }
  }, [selectedIds, getCurrentUserId, markAsRead, clearSelection, fetchUnreadCount]);

  // Delete single notification
  const deleteNotificationById = useCallback(async (notificationId: string) => {
    const userId = await getCurrentUserId();
    if (!userId) return;

    try {
      await notificationApi.deleteNotification(notificationId, userId);
      deleteNotification(notificationId);
      toast.success('Notification deleted');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete notification';
      toast.error(errorMessage);
    }
  }, [getCurrentUserId, deleteNotification]);

  // Delete selected notifications
  const deleteSelectedNotifications = useCallback(async () => {
    const userId = await getCurrentUserId();
    const idsToDelete = [...selectedIds];
    
    if (!userId || idsToDelete.length === 0) {
      return;
    }

    try {
      await notificationApi.bulkDeleteNotifications({
        notificationIds: idsToDelete,
        userId
      });
      
      idsToDelete.forEach(id => deleteNotification(id));
      clearSelection();
      await fetchNotifications();
      toast.success(`${idsToDelete.length} notifications deleted`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete notifications';
      toast.error(errorMessage);
    }
  }, [selectedIds, getCurrentUserId, deleteNotification, clearSelection, fetchNotifications]);

  // Update filters and refetch
  const updateFilters = useCallback((newFilters: Partial<NotificationFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchNotifications(updatedFilters);
  }, [filters, setFilters, fetchNotifications]);

  // Load more notifications (pagination)
  const loadMore = useCallback(() => {
    if (page < totalPages) {
      updateFilters({ page: page + 1 });
    }
  }, [page, totalPages, updateFilters]);

  return {
    notifications,
    unreadCount,
    total,
    page,
    totalPages,
    loading,
    error,
    filters,
    selectedIds,
    hasMore: page < totalPages,
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    markSelectedAsRead,
    deleteNotificationById,
    deleteSelectedNotifications,
    updateFilters,
    loadMore,
    setFilters,
    clearSelection
  };
};

/**
 * Hook for real-time unread count (for header badge)
 */
export const useUnreadCount = () => {
  const { unreadCount, setUnreadCount } = useNotificationStore();
  const { data: session } = useSession();

  const fetchUnreadCount = useCallback(async () => {
    const email = session?.user?.email;
    if (!email) return;

    try {
      let userId = userIdCache.get(email);
      if (!userId) {
        const userResponse = await apiClient.get(`/api/users/email/${encodeURIComponent(email)}`);
        if (!userResponse.ok) return;
        const userData = await userResponse.json();
        if (userData?.id) {
          userId = userData.id;
          userIdCache.set(email, userData.id);
        }
      }
      
      if (userId) {
        const { unreadCount } = await notificationApi.getUnreadCount(userId);
        setUnreadCount(unreadCount || 0);
      }
    } catch (error) {
      // Gracefully suppress network polling error
      console.warn('Unread count polling deferred');
    }
  }, [session?.user?.email, setUnreadCount]);

  useEffect(() => {
    if (!session?.user?.email) return;

    // Initial delayed fetch to let initial page render complete first
    const timer = setTimeout(fetchUnreadCount, 1500);
    const interval = setInterval(fetchUnreadCount, 45000); // 45 seconds
    
    const handleOrderCompleted = () => {
      setTimeout(fetchUnreadCount, 1500);
    };
    
    window.addEventListener('orderCompleted', handleOrderCompleted);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener('orderCompleted', handleOrderCompleted);
    };
  }, [session?.user?.email, fetchUnreadCount]);

  return {
    unreadCount,
    refreshUnreadCount: fetchUnreadCount
  };
};