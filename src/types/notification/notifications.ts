// types/notifications.ts

export type NotificationType =
  | "info"
  | "warning"
  | "success"
  | "error"
  | "inventory"
  | "sales"
  | "product";

// UI filter types
export type NotificationFilterType = "all" | NotificationType;
export type ReadFilterType = "all" | "read" | "unread";
export type PriorityFilterType = "all" | "low" | "medium" | "high";

export interface ApiNotification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  url: string | null;
  priority: "low" | "medium" | "high";
  user: number;
}

export interface NotificationListResponse {
  status: boolean;
  count: number;
  un_read: number;
  data: ApiNotification[];
}
