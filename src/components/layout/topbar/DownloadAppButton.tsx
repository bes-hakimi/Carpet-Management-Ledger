"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2, Check, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DownloadAppButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // تشخیص نصب
    useEffect(() => {
        window.addEventListener("appinstalled", () => setIsInstalled(true));

        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsInstalled(true);
        }
    }, []);

    // گرفتن رویداد beforeinstallprompt
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    // نصب اپلیکیشن
    const installApp = async () => {
        if (!deferredPrompt) return;
        setLoading(true);

        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        setLoading(false);
        if (choice.outcome === "accepted") {
            setIsInstalled(true);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        }

        setDeferredPrompt(null);
        setModalOpen(false);
    };

    return (
        <>
            <Button
                variant="primary"
                icon={<Download className="w-4 h-4" />}
                onClick={() => setModalOpen(true)}
            >
                دانلود اپ
            </Button>

            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-[fadeIn_0.3s]">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">
                            نصب اپلیکیشن وب
                        </h2>

                        {isInstalled ? (
                            <p className="text-green-600 font-medium mb-6">
                                ✔️ شما قبلاً اپ را نصب کرده‌اید.
                            </p>
                        ) : deferredPrompt ? (
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                                برای دسترسی سریع‌تر و تجربه بهتر، می‌توانید اپلیکیشن وب ما را نصب کنید.
                                نصب بسیار سریع است و در صفحه اصلی موبایل یا دسکتاپ شما قرار می‌گیرد.
                            </p>
                        ) : (
                            <p className="text-red-600 mb-6">
                                مرورگر شما در حال حاضر پیشنهاد نصب را پشتیبانی نمی‌کند.
                            </p>
                        )}

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setModalOpen(false)}>
                                بستن
                            </Button>

                            {!isInstalled && deferredPrompt && (
                                <Button
                                    variant="primary"
                                    icon={<Loader2 className="w-4 h-4 animate-spin" />}
                                    loading={loading}
                                    success={success}
                                    onClick={installApp}
                                >
                                    نصب
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DownloadAppButton;
