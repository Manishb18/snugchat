"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; // supabase client instance
import { getUserDetailsClient } from "@/utils/supabase/actions/userActions";
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
export default function Sidebar() {
  const path = usePathname();
  const [showUserBox, setShowUserBox] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const supabase = createClient();

  
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const data = await getUserDetailsClient();
        setUser(data);
      }
    }
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const data = await getUserDetailsClient();
          setUser(data);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
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

  if(path.includes("/login")){
    return null;
  }

  return (
    <div className="min-h-screen border-r border-gray-400/25 shadow-lg p-4 px-5 flex flex-col items-center ">
      <div className="relative cursor-pointer" onClick={toggleUserBox}>
        <BsFillPersonFill size={22} className="text-gray-500" />
        {showUserBox && user && (
          <div className="fixed left-16 top-2 bg-white shadow-md p-4 rounded-lg text-sm w-48 border border-gray-400/25  z-10">
            <p className="font-semibold">{user.name}</p>
            <p className="text-gray-500">{user.email}</p>
            <button
              onClick={handleLogout}
              className="mt-3 w-full bg-green-base text-white py-1 rounded hover:bg-red-600 transition"
            >
              Logout
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
