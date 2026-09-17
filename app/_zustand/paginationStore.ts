import { create } from "zustand";

export type State = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
};

export type Actions = {
  setPage: (page: number) => void;
  setTotalPages: (totalPages: number) => void;
  setTotalItems: (totalItems: number) => void;
  setPagination: (data: {
    page?: number;
    totalPages?: number;
    totalItems?: number;
    pageSize?: number;
  }) => void;
  incrementPage: () => void;
  decrementPage: () => void;
  resetPage: () => void;
};

export const usePaginationStore = create<State & Actions>((set) => ({
  page: 1,
  pageSize: 9,
  totalPages: 1,
  totalItems: 0,
  setPage: (page: number) => set({ page: Math.max(1, page) }),
  setTotalPages: (totalPages: number) => set({ totalPages: Math.max(1, totalPages) }),
  setTotalItems: (totalItems: number) => set({ totalItems: Math.max(0, totalItems) }),
  setPagination: (data) =>
    set((state) => ({
      page: data.page !== undefined ? Math.max(1, data.page) : state.page,
      totalPages: data.totalPages !== undefined ? Math.max(1, data.totalPages) : state.totalPages,
      totalItems: data.totalItems !== undefined ? Math.max(0, data.totalItems) : state.totalItems,
      pageSize: data.pageSize !== undefined ? Math.max(1, data.pageSize) : state.pageSize,
    })),
  incrementPage: () =>
    set((state) => {
      if (state.page < state.totalPages) {
        return { page: state.page + 1 };
      }
      return state;
    }),
  decrementPage: () =>
    set((state) => {
      if (state.page > 1) {
        return { page: state.page - 1 };
      }
      return { page: 1 };
    }),
  resetPage: () => set({ page: 1 }),
}));

