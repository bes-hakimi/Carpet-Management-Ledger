import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileText,
  PlusCircle,
  List,
  Bell,
  FilePlus,
  ReceiptText,
  Wallet,
  Building2,
  MapPinPlus,
  Users,
  UserPlus,
} from "lucide-react";

export const sidebarMenuAdmin = [
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
    title: "شعبات",
    icon: Building2,
    submenu: [
      { title: "افزودن شعبه", icon: MapPinPlus, link: "/branch/create" },
      { title: "لیست شعبات", icon: List, link: "/branch/list" },
    ],
  },
  {
    title: "کارمندان",
    icon: Users,
    submenu: [
      { title: "افزودن کارمند", icon: UserPlus, link: "/staff/create" },
      { title: "لیست کارمندان", icon: List, link: "/staff/list" },
    ],
  },
  {
    title: "اعلانات",
    icon: Bell,
    link: "/notifications",
  },
  {
    title: "گزارشات",
    icon: FileText,
    link: "/reports",
  },
];
