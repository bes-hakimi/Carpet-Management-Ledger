"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import EmailInput from "./EmailInput";
import PasswordInput from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface LoginFormProps {
    onSubmit: (email: string, password: string) => void;
    isLoading: boolean;
}

export default function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const validateForm = () => {
        const newErrors = { email: "", password: "" };

        if (!email.trim()) {
            newErrors.email = "ایمیل الزامی است";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "ایمیل معتبر نیست";
        }

        if (!password.trim()) {
            newErrors.password = "رمز عبور الزامی است";
        } else if (password.length < 6) {
            newErrors.password = "رمز عبور باید حداقل 6 کاراکتر باشد";
        }

        setErrors(newErrors);
        return !newErrors.email && !newErrors.password;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSubmit(email, password);
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-3 md:space-y-6"
        >
            <EmailInput
                value={email}
                onChange={setEmail}
                error={errors.email}
            />

            <PasswordInput
                value={password}
                onChange={setPassword}
                error={errors.password}
            />

            <div className="flex justify-end">
                <Link
                    href="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-800 transition-colors font-medium hover:underline underline-offset-2"
                >
                    رمز عبور خود را فراموش کرده‌اید؟
                </Link>
            </div>

            <Button
                type="submit"
                loading={isLoading}
                loadingText="در حال ورود..."
                fullWidth
                className="mt-2"
            >
                ورود به حساب
            </Button>
        </motion.form>
    );
}
