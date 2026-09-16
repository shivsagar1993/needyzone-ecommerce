"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCircleCheck,
  FaCircleXmark,
  FaClock,
  FaFileLines,
  FaTrashCan,
  FaTriangleExclamation,
} from "react-icons/fa6";

interface BatchHistory {
  id: string;
  fileName: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: string;
  uploadedBy: string;
  uploadedAt: string;
  errors?: string[];
}

const BulkUploadHistory = () => {
  const [batches, setBatches] = useState<BatchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingBatchId, setDeletingBatchId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<{
    id: string;
    fileName: string;
  } | null>(null);
  const [deleteProducts, setDeleteProducts] = useState(false);

  useEffect(() => {
    fetchBatchHistory();
  }, []);

  const fetchBatchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/bulk-upload");

      if (response.ok) {
        const data = await response.json();
        setBatches(data.batches || []);
      } else {
        setError("Failed to load batch history");
      }
    } catch (err) {
      console.error("Error fetching batch history:", err);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (batchId: string, fileName: string) => {
    setBatchToDelete({ id: batchId, fileName });
    setDeleteProducts(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!batchToDelete) return;

    setDeletingBatchId(batchToDelete.id);
    setShowDeleteModal(false);

    try {
      const response = await fetch(
        `http://localhost:3001/api/bulk-upload/${batchToDelete.id}?deleteProducts=${deleteProducts}`,
        {
          method: "DELETE",
        }
      );

      let data = null;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const text = await response.text();
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (e) {
            console.error("Failed to parse JSON:", text);
          }
        }
      }

      if (response.ok) {
        toast.success(
          deleteProducts
            ? "Batch and products deleted successfully!"
            : "Batch deleted successfully (products kept)"
        );
        await fetchBatchHistory();
      } else {
        toast.error(
          data?.error || `Failed to delete batch (${response.status})`
        );
      }
    } catch (err) {
      console.error("Error deleting batch:", err);
      toast.error("Network error occurred");
    } finally {
      setDeletingBatchId(null);
      setBatchToDelete(null);
      setDeleteProducts(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setBatchToDelete(null);
    setDeleteProducts(false);
  };

  const getStatusBadge = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FaCircleCheck className="text-xs" />
            <span>Completed</span>
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <FaCircleXmark className="text-xs" />
            <span>Failed</span>
          </span>
        );
      case "PARTIAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <FaTriangleExclamation className="text-xs" />
            <span>Partial</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <FaClock className="text-xs" />
            <span>{status}</span>
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-xs text-slate-400 mt-3 font-medium">Loading upload history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 text-rose-700 text-xs">
        {error}
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <FaFileLines className="text-2xl" />
        </div>
        <h3 className="font-bold text-slate-800 text-sm mb-1">No Upload Batches Yet</h3>
        <p className="text-xs text-slate-400">
          Upload a CSV file using the form above to view your import history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">
          Recent Import Batches
        </h2>
        <span className="text-xs font-bold text-slate-500">
          {batches.length} {batches.length === 1 ? "Batch" : "Batches"} Recorded
        </span>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && batchToDelete && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <FaTriangleExclamation className="text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Batch Record</h3>
                <p className="text-xs text-slate-500">This action removes the upload record.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Are you sure you want to delete batch record for{" "}
              <strong className="text-slate-900 font-semibold">{batchToDelete.fileName}</strong>?
            </p>

            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 mb-5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deleteProducts}
                  onChange={(e) => setDeleteProducts(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-amber-900">
                    Also delete all products imported from this batch
                  </span>
                  <p className="text-amber-700 text-[11px] mt-0.5 leading-relaxed">
                    Warning: Permanently removes associated products from the database. Products currently attached to active orders will be preserved.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-all shadow-sm active:scale-95"
              >
                {deleteProducts ? "Delete Batch & Products" : "Delete Batch Record"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Cards */}
      <div className="grid grid-cols-1 gap-4">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <FaFileLines className="text-base" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{batch.fileName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Uploaded by <span className="font-medium text-slate-600">{batch.uploadedBy}</span> •{" "}
                    {formatDate(batch.uploadedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(batch.status)}
                <button
                  onClick={() => handleDeleteClick(batch.id, batch.fileName)}
                  disabled={deletingBatchId === batch.id}
                  className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors disabled:opacity-50"
                  title="Delete batch"
                >
                  {deletingBatchId === batch.id ? (
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-rose-600"></div>
                  ) : (
                    <FaTrashCan className="text-xs" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-2">
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <p className="text-lg font-black text-slate-800">{batch.totalRecords}</p>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100/60">
                <p className="text-lg font-black text-emerald-600">{batch.successfulRecords}</p>
                <p className="text-[11px] font-semibold text-emerald-600/80 uppercase tracking-wider">Success</p>
              </div>
              <div className="bg-rose-50 rounded-xl p-3 text-center border border-rose-100/60">
                <p className="text-lg font-black text-rose-600">{batch.failedRecords}</p>
                <p className="text-[11px] font-semibold text-rose-600/80 uppercase tracking-wider">Failed</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100/60">
                <p className="text-lg font-black text-blue-600">
                  {batch.totalRecords > 0
                    ? Math.round(
                        (batch.successfulRecords / batch.totalRecords) * 100
                      )
                    : 0}
                  %
                </p>
                <p className="text-[11px] font-semibold text-blue-600/80 uppercase tracking-wider">Rate</p>
              </div>
            </div>

            {batch.errors && batch.errors.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600 mb-1.5">
                  Error Details ({batch.errors.length}):
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-xs text-rose-600 max-h-24 overflow-y-auto">
                  {batch.errors.slice(0, 4).map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                  {batch.errors.length > 4 && (
                    <li className="font-semibold">
                      ...and {batch.errors.length - 4} additional errors
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BulkUploadHistory;
