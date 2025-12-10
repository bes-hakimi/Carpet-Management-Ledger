import { Filter } from "lucide-react";
import { Select } from "@/components/ui/Select";
import {
  NotificationFilterType,
  ReadFilterType,
  PriorityFilterType,
} from "@/types/notification/notifications";

interface Props {
  filter: NotificationFilterType;
  readFilter: ReadFilterType;
  priorityFilter: PriorityFilterType;

  setFilter: (v: NotificationFilterType) => void;
  setReadFilter: (v: ReadFilterType) => void;
  setPriorityFilter: (v: PriorityFilterType) => void;

  filteredCount: number;
  totalCount: number;
}

export default function NotificationFilters({
  filter,
  readFilter,
  priorityFilter,
  setFilter,
  setReadFilter,
  setPriorityFilter,
  filteredCount,
  totalCount,
}: Props) {
  const typeOptions = [
    { value: "all", label: "همه انواع" },
    { value: "product", label: "اجناس" },
    { value: "warning", label: "هشدار" },
    { value: "success", label: "موفقیت" },
    { value: "error", label: "خطا" },
    { value: "inventory", label: "موجودی" },
    { value: "sales", label: "فروش" },
  ] satisfies { value: NotificationFilterType; label: string }[];

  const priorityOptions = [
    { value: "all", label: "همه سطوح" },
    { value: "high", label: "بالا" },
    { value: "medium", label: "متوسط" },
    { value: "low", label: "پایین" },
  ] satisfies { value: PriorityFilterType; label: string }[];

  const readStatusOptions = [
    { value: "all", label: "همه حالت ها" },
    { value: "unread", label: "خوانده نشده" },
    { value: "read", label: "خوانده شده" },
  ] satisfies { value: ReadFilterType; label: string }[];

  return (
    <div className="bg-white rounded-lg shadow-xs border border-gray-200/60 p-4 md:p-6 mb-4 md:mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-800">فیلترها</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 max-w-2xl">

          <Select
            options={readStatusOptions}
            value={readFilter}
            onChange={(v) => setReadFilter(v as ReadFilterType)}
            placeholder="وضعیت"
            size="md"
          />

          <Select
            options={typeOptions}
            value={filter}
            onChange={(v) => setFilter(v as NotificationFilterType)}
            placeholder="نوع اعلان"
            size="md"
          />

          <Select
            options={priorityOptions}
            value={priorityFilter}
            onChange={(v) => setPriorityFilter(v as PriorityFilterType)}
            placeholder="اولویت"
            size="md"
          />
        </div>

        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
          نمایش <span className="font-bold text-gray-800">{filteredCount}</span> از{" "}
          <span className="font-bold text-gray-800">{totalCount}</span> اعلان
        </div>
      </div>
    </div>
  );
}
