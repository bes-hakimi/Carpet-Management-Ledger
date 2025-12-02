"use client";
import { useState, useRef, useEffect } from "react";
import { Upload, File, Image, X, AlertCircle, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/route";
import { UploadProgressBar } from "./UploadProgressBar";

interface FileUploadProps {
  accept?: string;
  onFileSelect: (fileUrl: string | null) => void;
  label?: string;
  maxSize?: number;
  error?: string | null;
  initialFileUrl?: string; // ✅ پراپ جدید برای نمایش فایل موجود از API
}

export function FileUpload({
  accept = "*/*",
  onFileSelect,
  label = "انتخاب فایل",
  maxSize = 10,
  error = null,
  initialFileUrl, // ✅
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const { useUploadThing } = generateReactHelpers<OurFileRouter>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const { startUpload, isUploading } = useUploadThing("anyFile", {
    onUploadProgress: (progress) => setUploadProgress(progress),
  });

  // ✅ اگر فایل از API آمده، در ابتدا آن را تنظیم کن
  useEffect(() => {
    if (initialFileUrl) {
      setUploadedUrl(initialFileUrl);
    }
  }, [initialFileUrl]);

  const handleFileChange = async (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (selectedFile.size > maxSize * 1024 * 1024) {
      toast.error(`حجم فایل باید کمتر از ${maxSize} مگابایت باشد`);
      return;
    }

    setFile(selectedFile);
    setUploadedUrl("");
    setUploadProgress(0);

    try {
      const res = await startUpload([selectedFile]);

      if (res?.length) {
        const fileUrl = res[0].ufsUrl;
        setUploadedUrl(fileUrl);
        toast.success("فایل با موفقیت آپلود شد!");
        onFileSelect(fileUrl);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("آپلود فایل با مشکل مواجه شد");
      onFileSelect(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = () => {
    setFile(null);
    setUploadedUrl("");
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getFileIcon = () => {
    if (uploadedUrl && uploadedUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      return <Image size={48} className="text-primary-500" />;
    if (file?.type.startsWith("image/"))
      return <Image size={48} className="text-primary-500" />;
    if (file || uploadedUrl)
      return <File size={48} className="text-primary-500" />;
    return <Upload size={48} className="text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-all duration-200 h-40
          ${isDragOver
            ? "border-primary-500 bg-primary-50"
            : uploadedUrl || file
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50"}
          ${error ? "border-red-400 bg-red-50" : ""}
        `}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          {getFileIcon()}

          {(uploadedUrl) ? (
            <div className="text-center">
              {/* ✅ نمایش نام فایل یا لینک فایل موجود */}
              {uploadedUrl && !file ? (
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 text-sm flex items-center justify-center gap-1 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  مشاهده فایل <ExternalLink size={14} />
                </a>
              ) : (
                <p className="text-sm font-medium text-gray-900">{file?.name}</p>
              )}

              {file && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(file.size)}
                </p>
              )}
              {isUploading && <UploadProgressBar progress={uploadProgress} />}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-gray-500 mt-1">
                فایل را اینجا رها کنید یا برای انتخاب کلیک کنید
              </p>
              <p className="text-xs text-gray-400 mt-1">
                حداکثر حجم: {maxSize}MB
              </p>
              {isUploading && <UploadProgressBar progress={uploadProgress} />}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {(initialFileUrl || uploadedUrl) && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeFile();
          }}
          className="mt-2 flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          <X size={16} />
          حذف فایل
        </button>
      )}
    </div>
  );
}
