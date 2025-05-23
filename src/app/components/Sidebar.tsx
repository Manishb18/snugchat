"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  BsFillPersonFill,
  BsFillHouseDoorFill,
  BsFillChatDotsFill,
  BsFillTicketPerforatedFill,
  BsBarChartFill,
  BsListUl,
  BsFillMegaphoneFill,
  BsJournalRichtext,
  BsFillImageFill,
  BsCheck2Square,
  BsFillGearFill,
} from "react-icons/bs";
import { MdShare } from "react-icons/md";
import { TbStarsFilled, TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";
import Image from "next/image";
export default function Sidebar() {
  const path = usePathname();
  const [showUserBox, setShowUserBox] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const { user: currentUser } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const supabase = createClient();
    const fetchUserDetails = async () => {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name, email, avatar_url")
        .eq("id", currentUser.id)
        .single();

      if (profileError) {
        console.error("profile fetch error ::", profileError);
      }
      if (profile) {
        setUser(profile);
      }
    };
    fetchUserDetails();
  }, [currentUser]);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/logout", { method: "POST" });
    toast.success("you are logged out");
    setLoading(false);
    toggleUserBox();
    window.location.reload();
  };

  const toggleUserBox = () => setShowUserBox((prev) => !prev);

  const icons = [
    BsFillHouseDoorFill, // Home
    BsFillChatDotsFill, // Chat
    BsFillTicketPerforatedFill, // Ticket
    BsBarChartFill, // Chart
    BsListUl, // List (no fill version)
    BsFillMegaphoneFill, // Megaphone
    MdShare, // Network/AI (solid)
    BsJournalRichtext, // Book/Docs (no fill version)
    BsFillImageFill, // Image
    BsCheck2Square, // Checklist (no fill version)
    BsFillGearFill, // Settings
  ];

  if (path.includes("/login")) {
    return null;
  }

  return (
    <div className="min-h-screen border-r border-gray-400/25 shadow-lg p-4 px-5 flex flex-col items-center ">
      <div className="relative cursor-pointer">
        <Image
          src={"/avatar.png"}
          alt="avatar"
          width={20}
          height={20}
          className="w-6 h-6 rounded-full"
          onClick={toggleUserBox}
        />
        {/* <BsFillPersonFill
          size={22}
          className="text-gray-500"
          onClick={toggleUserBox}
        /> */}
        {showUserBox && user && (
          <div className="fixed left-16 top-2 bg-white shadow-md p-4 rounded-lg text-sm w-48 border border-gray-400/25  z-10">
            <p className="font-semibold">{user.name}</p>
            <p className="text-gray-500">{user.email}</p>
            <button
              onClick={handleLogout}
              className="mt-3 w-full bg-green-base text-white py-1 rounded hover:bg-red-600 transition"
            >
              {!loading ? "Logout" : "Logging out..."}
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-6 relative mt-6">
        {icons.map((Icon, idx) => (
          <div key={idx} className="relative">
            <Icon
              size={18}
              className={
                idx === 1
                  ? "text-green-base cursor-pointer"
                  : "text-gray-500 cursor-pointer"
              }
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 items-center justify-center">
        <TbStarsFilled className="text-gray-500" />
        <TbLayoutSidebarLeftExpandFilled className="text-gray-500" />
      </div>
    </div>
  );
}
