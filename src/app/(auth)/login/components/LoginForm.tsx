"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PhoneInput from "./PhoneInput";
import PasswordInput from "./PasswordInput";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface LoginFormProps {
    onSubmit: (phoneNumber: string, password: string) => void;
    isLoading: boolean;
}

export default function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        phoneNumber: "",
        password: ""
    });

    const validateForm = () => {
        const newErrors = {
            phoneNumber: "",
            password: ""
        };

        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = "شماره تماس الزامی است";
        } else if (!/^07\d{8}$/.test(phoneNumber)) {
            newErrors.phoneNumber = "شماره تماس معتبر نیست";
        }

        if (!password.trim()) {
            newErrors.password = "رمز عبور الزامی است";
        } else if (password.length < 6) {
            newErrors.password = "رمز عبور باید حداقل 6 کاراکتر باشد";
        }

        setErrors(newErrors);
        return !newErrors.phoneNumber && !newErrors.password;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        onSubmit(phoneNumber, password);
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-3 md:space-y-6"
        >
            <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                error={errors.phoneNumber}
            />

            <PasswordInput
                value={password}
                onChange={setPassword}
                error={errors.password}
            />

            <div className="flex justify-end">
                <Link
                    href="/forgot-password"
                    className="text-sm text-teal-600 hover:text-teal-800 transition-colors font-medium hover:underline underline-offset-2"
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