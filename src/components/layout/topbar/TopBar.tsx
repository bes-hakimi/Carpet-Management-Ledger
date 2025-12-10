"use client";
import Fullscreen from "./Fullscreen";
import NotificationBell from "./NotificationBell";
import { IUser } from "@/types/user/user";
import { useApiGet } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import { useAuth } from "@/hooks/useAuth";
import ProfileMenu from "./ProfileMenu";
import DownloadAppButton from "./DownloadAppButton";

interface IUserResponse {
  details: IUser;
  branches: IUser[];
  staffs: IUser[];
}

export default function TopBar() {
  const { userData } = useAuth();
  const userId = userData?.user?.id ?? null;
  const userRoll = userData?.user?.role ?? null;

  const { data } = useApiGet<IUserResponse>(
    `user-profile-${userId}`,
    userId ? USERS.details(userId) : "",
    { enabled: !!userId }
  );

  return (
    <header className="fixed top-0 left-0 w-full bg-white py-3 shadow-sm z-20">
      <div className="w-[95%] mx-auto flex items-center justify-between">

        <div className="flex items-center gap-3 md:gap-6">
          <Fullscreen />
          <NotificationBell />
          <DownloadAppButton />
        </div>
        <div className="flex items-center gap-5">
          <ProfileMenu
            name={
              data
                ? userRoll === "branch"
                  ? data.details.branch_name ?? "نام شرکت یا شعبه"
                  : data.details.company_name ?? "نام شرکت یا شعبه"
                : "نام شرکت یا شعبه"
            }
            avatar={data?.details?.company_logo || "/images/logo/carpet-logo.jpg"}
          />
        </div>
      </div>

    </header>
  );
}
