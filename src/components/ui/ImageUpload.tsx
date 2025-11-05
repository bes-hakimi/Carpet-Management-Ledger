// src/components/ui/ImageUpload.tsx
"use client";
import { useState, useRef } from "react";
import { Upload, Image, X, Eye } from "lucide-react";
import { Modal } from "./Modal";
import toast from "react-hot-toast";

import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/route";
import { UploadProgressBar } from "./UploadProgressBar";

interface ImageUploadProps {
    onImageSelect: (url: string | null) => void;
    label?: string;
    maxSize?: number;
}

export function ImageUpload({
    onImageSelect,
    label = "انتخاب عکس",
    maxSize = 5
}: ImageUploadProps) {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [isDragOver, setIsDragOver] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { useUploadThing } = generateReactHelpers<OurFileRouter>();

    const [uploadProgress, setUploadProgress] = useState(0);

    const { startUpload, isUploading } = useUploadThing("anyFile", {
        onUploadProgress: (progress) => {
            setUploadProgress(progress);
        },
    });

    const handleImageChange = async (selectedImage: File | null) => {
        if (!selectedImage) return;

        if (!selectedImage.type.startsWith("image/")) {
            toast.error("لطفاً فقط فایل تصویر انتخاب کنید");
            return;
        }

        if (selectedImage.size > maxSize * 1024 * 1024) {
            toast.error(`حجم عکس باید کمتر از ${maxSize} مگابایت باشد`);
            return;
        }

        setImage(selectedImage);

        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(selectedImage);

        setUploadedUrl("");
        setUploadProgress(0);

        try {
            const res = await startUpload([selectedImage]);

            if (res?.length) {
                const fileUrl = res[0].ufsUrl;
                setUploadedUrl(fileUrl);
                onImageSelect(fileUrl);
                toast.success("عکس با موفقیت آپلود شد!");
            }
        } catch (err) {
            console.error(err);
            toast.error("آپلود عکس با مشکل مواجه شد");
            onImageSelect(null);
            setUploadedUrl("");
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        handleImageChange(droppedFile);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview("");
        setUploadedUrl("");
        onImageSelect(null); 
    };


    const formatImageSize = (bytes?: number) => {
        if (!bytes) return "0 Bytes";
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
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                className="hidden"
            />

            <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
          border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-all duration-200 h-40
          ${isDragOver
                        ? "border-teal-500 bg-teal-50"
                        : image
                            ? "border-teal-500 bg-teal-50"
                            : "border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50"
                    }
        `}
            >
                {uploadedUrl && imagePreview ? (
                    <div className="flex flex-col items-center space-y-2">
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPreview(true);
                                }}
                                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <Eye size={16} />
                            </button>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{image?.name}</p>
                        <p className="text-xs text-gray-500">
                            {formatImageSize(image?.size)}
                        </p>

                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <Image size={48} className="text-gray-400" />
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-900">{label}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                عکس را اینجا رها کنید یا برای انتخاب کلیک کنید
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                حداکثر حجم: {maxSize}MB
                            </p>
                            {isUploading && <UploadProgressBar progress={uploadProgress} />}
                        </div>
                    </div>
                )}
            </div>

            {image && uploadedUrl && (
                <div className="mt-2 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={removeImage}
                        className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 hover:cursor-pointer transition-colors "
                    >
                        <X size={16} />
                        حذف عکس
                    </button>
                </div>
            )}

            {/* ✅ استفاده از Modal سفارشی برای پیش‌نمایش عکس */}
            <Modal open={showPreview} onClose={() => setShowPreview(false)} size="lg">
                <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto max-h-[80vh] object-cover rounded-lg"
                />
            </Modal>

        </div>
    );
}