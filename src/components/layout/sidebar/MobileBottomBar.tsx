'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/hooks/useAuth";

// منوها بر اساس نقش
import { sidebarMenuSuperAdmin } from "./sidebar-menu/SuperAdmin";
import { sidebarMenuAdmin } from "./sidebar-menu/Admin";
import { sidebarMenuStaff } from "./sidebar-menu/Staff";
import { sidebarMenuBranch } from "./sidebar-menu/Branch";
import { ComponentType, SVGProps } from "react";

interface SidebarMenuItem {
    title: string;
    link?: string;
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    submenu?: SidebarMenuItem[];
}


interface SidebarMenuItem {
    title: string;
    link?: string;
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    submenu?: SidebarMenuItem[];
}

export default function MobileBottomBar() {
    const { userData } = useAuth();
    const role: string = userData?.user?.role || 'superadmin';

    const sidebarMenu: SidebarMenuItem[] =
        role === 'superadmin'
            ? sidebarMenuSuperAdmin
            : role === 'admin'
                ? sidebarMenuAdmin
                : role === 'staff'
                    ? sidebarMenuStaff
                    : sidebarMenuBranch;

    const pathname = usePathname();
    const [showMore, setShowMore] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    // بسته شدن منوها هنگام کلیک بیرون
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpenSubmenu(null);
                setShowMore(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const visibleItems = sidebarMenu.slice(0, 4);
    const hiddenItems = sidebarMenu.slice(4);

    const toggleSubmenu = (title: string) =>
        setOpenSubmenu(openSubmenu === title ? null : title);

    const isActive = (link?: string) => {
        if (!link) return false;
        return pathname === link || pathname.startsWith(link + "/");
    };

    return (
        <div ref={containerRef}>
            {/* 🔹 نوار پایین */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-xl border border-primary-100 shadow-lg rounded-2xl flex justify-around items-center py-2 w-[95%] max-w-md z-50 sm:hidden">
                {visibleItems.map(({ title, link, icon: Icon, submenu }) => {
                    const activeLink = link && pathname === link;
                    const activeSubmenu = !!submenu && submenu.some(sub => pathname === sub.link);
                    const active = activeLink || activeSubmenu;
                    const hasSubmenu = !!submenu;

                    return (
                        <button
                            key={title}
                            onClick={() => {
                                if (hasSubmenu) toggleSubmenu(title);
                                else window.location.href = link || "#";
                                setShowMore(false);
                            }}
                            className="relative flex flex-col items-center text-[11px] font-medium group"
                        >
                            <div
                                className={clsx(
                                    "flex flex-col items-center justify-center transition-all duration-300",
                                    active ? "text-primary-600" : "text-gray-500"
                                )}
                            >
                                <div
                                    className={clsx(
                                        "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                                        active
                                            ? "bg-primary-100 text-primary-600 shadow-inner"
                                            : "group-hover:bg-gray-100"
                                    )}
                                >
                                    {Icon && <Icon className="w-5 h-5" />}
                                </div>
                                <span className="mt-1">{title}</span>
                            </div>

                            {hasSubmenu && (
                                <span className="absolute -top-1 right-1">
                                    {openSubmenu === title ? (
                                        <ChevronUp className="w-3 h-3 text-primary-500" />
                                    ) : (
                                        <ChevronDown className="w-3 h-3 text-gray-400" />
                                    )}
                                </span>
                            )}
                        </button>
                    );
                })}

                {/* دکمه بیشتر */}
                {hiddenItems.length > 0 && (
                    <button
                        onClick={() => {
                            setShowMore(!showMore);
                            setOpenSubmenu(null);
                        }}
                        className="flex flex-col items-center text-[11px] text-gray-600 hover:text-primary-600 transition-all"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
                            <MoreHorizontal className="w-5 h-5" />
                        </div>
                        بیشتر
                    </button>
                )}
            </div>

            {/* 🔹 زیرمنو */}
            {openSubmenu && (
                <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-2xl w-[90%] max-w-md py-3 animate-slide-up z-40 sm:hidden">
                    {sidebarMenu
                        .find((item) => item.title === openSubmenu)
                        ?.submenu?.map((sub) => {
                            const active = isActive(sub.link);
                            return (
                                <Link
                                    key={sub.title}
                                    href={sub.link || "#"}
                                    onClick={() => setOpenSubmenu(null)}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-2 rounded-xl transition-colors",
                                        active
                                            ? "bg-primary-50 text-primary-600"
                                            : "text-gray-700 hover:bg-primary-50"
                                    )}
                                >
                                    {sub.icon && (
                                        <sub.icon
                                            className={clsx(
                                                "w-5 h-5",
                                                active ? "text-primary-600" : "text-primary-500"
                                            )}
                                        />
                                    )}
                                    <span>{sub.title}</span>
                                </Link>
                            );
                        })}
                </div>
            )}

            {/* 🔹 منوی بیشتر */}
            {showMore && (
                <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-2xl w-[90%] max-w-md py-3 animate-slide-up z-40 sm:hidden">
                    {hiddenItems.map(({ title, icon: Icon, link, submenu }) => {
                        const hasSubmenu = !!submenu;
                        return (
                            <div key={title}>
                                <button
                                    onClick={() => {
                                        if (hasSubmenu) toggleSubmenu(title);
                                        else window.location.href = link || "#";
                                    }}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-2 rounded-xl w-full transition-colors",
                                        openSubmenu === title
                                            ? "bg-primary-50 text-primary-600"
                                            : "text-gray-700 hover:bg-primary-50"
                                    )}
                                >
                                    {Icon && <Icon className="w-5 h-5 text-primary-500" />}
                                    {title}
                                    {hasSubmenu && (
                                        <span className="ml-auto">
                                            {openSubmenu === title ? (
                                                <ChevronUp className="w-4 h-4 text-primary-500" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            )}
                                        </span>
                                    )}
                                </button>

                                {/* زیرمنوهای آیتم‌های “بیشتر” */}
                                {openSubmenu === title &&
                                    submenu?.map((sub) => {
                                        const active = isActive(sub.link);
                                        return (
                                            <Link
                                                key={sub.title}
                                                href={sub.link || "#"}
                                                onClick={() => setShowMore(false)}
                                                className={clsx(
                                                    "flex items-center gap-3 pl-10 pr-4 py-2 rounded-lg text-sm transition-colors",
                                                    active
                                                        ? "bg-primary-50 text-primary-600"
                                                        : "text-gray-600 hover:bg-gray-50"
                                                )}
                                            >
                                                {sub.icon && (
                                                    <sub.icon
                                                        className={clsx(
                                                            "w-4 h-4",
                                                            active ? "text-primary-600" : "text-primary-400"
                                                        )}
                                                    />
                                                )}
                                                {sub.title}
                                            </Link>
                                        );
                                    })}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
