import {
  LayoutDashboard,
  ShoppingBag,
  Bell,
  FilePlus,
  ReceiptText,
  Wallet,
  PlusCircle,
  List,
} from "lucide-react";

export const sidebarMenuStaff = [
  {
    title: "داشبورد",
    icon: LayoutDashboard,
    link: "/dashboard",
  },
  {
    title: "فروشات",
    icon: ShoppingBag,
    submenu: [
      { title: "فروش مورد جدید", icon: PlusCircle, link: "/sales/create" },
      { title: "لیست فروشات", icon: List, link: "/sales/list" },
    ],
  },
  {
    title: "مصارف",
    icon: Wallet,
    submenu: [
      { title: "ثبت مصرف", icon: FilePlus, link: "/consumption/create" },
      { title: "لیست مصارف", icon: ReceiptText, link: "/consumption/list" },
    ],
  },
  {
    title: "اعلانات",
    icon: Bell,
    link: "/notifications",
  },
];
