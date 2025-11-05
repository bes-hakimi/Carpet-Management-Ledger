import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FileText,
  PlusCircle,
  List,
  UserPlus,
  Bell,
  FilePlus,
  ReceiptText,
  Wallet,
  Building,
  Building2,
  MapPinPlus,
} from "lucide-react";

export const sidebarMenuSuperAdmin = [
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
      { title: "ثبت مصرف", icon: FilePlus, link: "/consumption/create" },
      { title: "لیست مصارف", icon: ReceiptText, link: "/consumption/list" },
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
    title: "شرکت‌ها",
    icon: Building,
    submenu: [
      { title: "افزودن شرکت", icon: UserPlus, link: "/company/create" },
      { title: "لیست شرکت‌ها", icon: List, link: "/company/list" },
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
