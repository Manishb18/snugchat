"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  BsFillHouseDoorFill,
  BsFillChatDotsFill,
  BsListUl,
  BsFillImageFill,
  BsFillGearFill,
  BsGraphUp,
} from "react-icons/bs";
import { ImAddressBook } from "react-icons/im";
import { PiListChecks } from "react-icons/pi";
import { TiFlowMerge } from "react-icons/ti";
import { TbStarsFilled, TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { HiMegaphone } from "react-icons/hi2";
import { IoTicket } from "react-icons/io5";
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
    toast.success("You are logged out");
    setLoading(false);
    toggleUserBox();
    window.location.reload();
  };

  const toggleUserBox = () => setShowUserBox((prev) => !prev);

  const icons = [
    BsFillHouseDoorFill,
    BsFillChatDotsFill,
    IoTicket,
    BsGraphUp,
    BsListUl,
    HiMegaphone,
    TiFlowMerge,
    ImAddressBook,
    BsFillImageFill,
    PiListChecks,
    BsFillGearFill,
  ];

  if (path.includes("/login")) {
    return null;
  }

  return (
    <aside className="min-h-screen border-r border-gray-400/25 shadow-lg p-4 px-5 flex flex-col items-center bg-white">
      {/* User Profile Section */}
      <header className="relative cursor-pointer">
        <Image
          src={"/avatar.png"}
          alt="User avatar"
          width={20}
          height={20}
          className="w-6 h-6 rounded-full"
          onClick={toggleUserBox}
        />
        {showUserBox && user && (
          <section className="fixed left-16 top-2 bg-white shadow-md p-4 rounded-lg text-sm w-48 border border-gray-400/25 z-10">
            <h2 className="font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <button
              onClick={handleLogout}
              className="mt-3 w-full bg-green-base text-white py-1 rounded hover:bg-red-600 transition"
            >
              {!loading ? "Logout" : "Logging out..."}
            </button>
          </section>
        )}
      </header>

      {/* Navigation Icons */}
      <nav
        className="flex-1 flex flex-col gap-6 mt-6"
        aria-label="Sidebar navigation"
      >
        {icons.map((Icon, idx) => (
          <button
            key={idx}
            className="relative focus:outline-none"
            aria-label={`Sidebar icon ${idx + 1}`}
          >
            <Icon
              size={18}
              className={
                idx === 1
                  ? "text-green-base cursor-pointer"
                  : "text-gray-500 cursor-pointer"
              }
            />
          </button>
        ))}
      </nav>

      {/* Footer Controls */}
      <footer className="flex flex-col gap-6 items-center justify-center">
        <TbStarsFilled className="text-gray-500" />
        <TbLayoutSidebarLeftExpandFilled className="text-gray-500" />
      </footer>
    </aside>
  );
}
