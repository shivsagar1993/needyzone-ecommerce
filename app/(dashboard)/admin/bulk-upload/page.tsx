"use client";
import { DashboardSidebar } from "@/components";
import BulkUploadHistory from "@/components/BulkUploadHistory";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  FaUpload,
  FaDownload,
  FaCircleCheck,
  FaCircleXmark,
  FaCircleInfo,
} from "react-icons/fa6";

interface UploadResult {
  success: boolean;
  message: string;
  details?: {
    processed: number;
    successful: number;
    failed: number;
    errors?: string[];
  };
}

const BulkUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "text/csv" ||
        droppedFile.name.endsWith(".csv")
      ) {
        setFile(droppedFile);
        setUploadResult(null);
      } else {
        toast.error("Please upload a CSV file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (
        selectedFile.type === "text/csv" ||
        selectedFile.name.endsWith(".csv")
      ) {
        setFile(selectedFile);
        setUploadResult(null);
      } else {
        toast.error("Please upload a CSV file");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first");
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3001/api/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadResult({
          success: true,
          message: data.message || "Products uploaded successfully!",
          details: data.details,
        });
        toast.success("Bulk upload completed!");
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setUploadResult({
          success: false,
          message: data.error || "Upload failed",
          details: data.details,
        });
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadResult({
        success: false,
        message: "Network error occurred during upload",
      });
      toast.error("Network error occurred");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `title,price,manufacturer,inStock,mainImage,description,slug,categoryId
Sample Product,99.99,Sample Manufacturer,10,https://example.com/image.jpg,Sample description,sample-product,category-uuid
Another Product,149.99,Another Manufacturer,5,https://example.com/image2.jpg,Another description,another-product,category-uuid`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Template downloaded!");
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col xl:flex-row">
      <DashboardSidebar />
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Bulk Upload Products
              </h1>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                CSV Importer
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Batch import products into the catalog with CSV files.
            </p>
          </div>

          <div>
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm transition-all active:scale-95 shrink-0"
            >
              <FaDownload className="text-xs text-slate-500" />
              <span>Download CSV Template</span>
            </button>
          </div>
        </div>

        {/* Instructions Box */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 mb-8 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <FaCircleInfo className="text-base" />
          </div>
          <div className="flex-1 text-xs sm:text-sm text-slate-600">
            <h2 className="font-bold text-slate-900 mb-1">
              Upload Guidelines & Requirements
            </h2>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Download the CSV template using the button above for sample formatting.</li>
              <li>Required columns: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200/60 text-blue-700">title</code>, <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200/60 text-blue-700">price</code>, <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200/60 text-blue-700">manufacturer</code>, <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200/60 text-blue-700">description</code>, <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200/60 text-blue-700">slug</code>, <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200/60 text-blue-700">categoryId</code>.</li>
              <li>Maximum supported file size is 5MB per upload.</li>
            </ul>
          </div>
        </div>

        {/* File Upload Drag & Drop Area */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 mb-8">
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
              dragActive
                ? "border-blue-600 bg-blue-50/50"
                : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <FaUpload className="text-2xl" />
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-800 mb-1">
              {file ? (
                <span className="text-blue-600">
                  Ready to upload: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </span>
              ) : (
                "Drag & drop your CSV file here, or click to browse"
              )}
            </p>
            <p className="text-xs text-slate-400">
              Only standard comma-delimited .csv files are supported
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Upload Button */}
          {file && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white shadow-sm transition-all active:scale-95 ${
                  uploading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {uploading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Importing Products...</span>
                  </>
                ) : (
                  <>
                    <FaUpload className="text-xs" />
                    <span>Upload Products</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Upload Result Alert */}
        {uploadResult && (
          <div
            className={`border rounded-2xl p-6 mb-8 ${
              uploadResult.success
                ? "bg-emerald-50/70 border-emerald-200"
                : "bg-rose-50/70 border-rose-200"
            }`}
          >
            <div className="flex items-start gap-4">
              {uploadResult.success ? (
                <FaCircleCheck className="text-2xl text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <FaCircleXmark className="text-2xl text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3
                  className={`text-base font-bold mb-1 ${
                    uploadResult.success ? "text-emerald-900" : "text-rose-900"
                  }`}
                >
                  {uploadResult.success
                    ? "Upload Completed Successfully!"
                    : "Upload Encountered Errors"}
                </h3>
                <p
                  className={`text-xs sm:text-sm mb-4 ${
                    uploadResult.success ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {uploadResult.message}
                </p>

                {uploadResult.details && (
                  <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Upload Statistics
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-xl bg-slate-50">
                        <p className="text-2xl font-black text-slate-900">
                          {uploadResult.details.processed}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">Total Processed</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-emerald-50">
                        <p className="text-2xl font-black text-emerald-600">
                          {uploadResult.details.successful}
                        </p>
                        <p className="text-xs text-emerald-700 font-medium">Imported</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-rose-50">
                        <p className="text-2xl font-black text-rose-600">
                          {uploadResult.details.failed}
                        </p>
                        <p className="text-xs text-rose-700 font-medium">Failed</p>
                      </div>
                    </div>

                    {uploadResult.details.errors &&
                      uploadResult.details.errors.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <p className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
                            Error Log:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-xs text-rose-600 max-h-40 overflow-y-auto">
                            {uploadResult.details.errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CSV Format Specification Guide */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 mb-8">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            CSV Field Specifications
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Column</th>
                  <th className="py-3 px-4">Required</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">title</td>
                  <td className="py-3 px-4"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Yes</span></td>
                  <td className="py-3 px-4 text-slate-500">String</td>
                  <td className="py-3 px-4">Product name displayed in catalog</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">price</td>
                  <td className="py-3 px-4"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Yes</span></td>
                  <td className="py-3 px-4 text-slate-500">Number</td>
                  <td className="py-3 px-4">Standard selling price (e.g. 99.99)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">manufacturer</td>
                  <td className="py-3 px-4"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Yes</span></td>
                  <td className="py-3 px-4 text-slate-500">String</td>
                  <td className="py-3 px-4">Brand or vendor name</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">inStock</td>
                  <td className="py-3 px-4"><span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span></td>
                  <td className="py-3 px-4 text-slate-500">Number</td>
                  <td className="py-3 px-4">Inventory count (defaults to 0)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">mainImage</td>
                  <td className="py-3 px-4"><span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span></td>
                  <td className="py-3 px-4 text-slate-500">URL</td>
                  <td className="py-3 px-4">Public URL or local file path</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">description</td>
                  <td className="py-3 px-4"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Yes</span></td>
                  <td className="py-3 px-4 text-slate-500">String</td>
                  <td className="py-3 px-4">Full product description text</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">slug</td>
                  <td className="py-3 px-4"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Yes</span></td>
                  <td className="py-3 px-4 text-slate-500">String</td>
                  <td className="py-3 px-4">Unique URL slug (e.g. smart-watch-v2)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">categoryId</td>
                  <td className="py-3 px-4"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Yes</span></td>
                  <td className="py-3 px-4 text-slate-500">UUID</td>
                  <td className="py-3 px-4">Corresponding Category ID from store</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload History Component */}
        <div>
          <BulkUploadHistory />
        </div>
      </main>
    </div>
  );
};

export default BulkUploadPage;
