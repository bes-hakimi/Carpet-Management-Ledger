// src/components/ui/UploadProgressBar.tsx
"use client";

interface UploadProgressBarProps {
    progress: number; // 0 تا 100
}

export function UploadProgressBar({ progress }: UploadProgressBarProps) {
    return (
        <div className="w-full flex gap-2 items-center">
            <div className="w-full h-1 md:h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary-500 transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-xs text-primary-500 mt-1 text-right font-medium">
                {progress}%
            </p>
        </div>
    );
}
