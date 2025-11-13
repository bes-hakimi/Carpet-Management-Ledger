import {
  LayoutDashboard,
  ShoppingBag,
  Bell,
  FilePlus,
  ReceiptText,
  Wallet,
  PlusCircle,
  List,
  Package,
} from "lucide-react";

export const sidebarMenuStaff = [
  {
    title: "داشبورد",
    icon: LayoutDashboard,
    link: "/dashboard",
  },
  {
    title: "محصولات",
    icon: Package,
    submenu: [
      { title: "اضافه نمودن محصول", icon: PlusCircle, link: "/products/add" },
      { title: "لیست محصول", icon: List, link: "/products/list" },
    ],
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
      { title: "ثبت مصرف", icon: FilePlus, link: "/expense/create" },
      { title: "لیست مصارف", icon: ReceiptText, link: "/expense/list" },
    ],
  },
  {
    title: "اعلانات",
    icon: Bell,
    link: "/notifications",
  },
];
