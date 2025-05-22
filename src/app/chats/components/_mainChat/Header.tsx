import Image from "next/image";
import React, { useEffect, useState } from "react";
import { HiSparkles } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { User } from "@/utils/types";
import { createClient } from "@/utils/supabase/client";
import { format, isToday, isYesterday } from "date-fns";

const supabase = createClient();
export default function Header({ selectedUser }: { selectedUser: User }) {
  const [isOnline, setIsOnline] = useState(false);
  const [lastActive, setLastActive] = useState<Date | null>(null);
  useEffect(() => {
    if (!selectedUser) return;

    // Subscribe to real-time updates for the selected user's online status
    const channel = supabase
      .channel(`online-status-${selectedUser.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${selectedUser.id}`,
        },
        (payload) => {
          setIsOnline(payload.new.online);
          setLastActive(payload.new.last_active);
        }
      )
      .subscribe();

    // Fetch the initial online status
    const fetchOnlineStatus = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("online, last_active")
        .eq("id", selectedUser.id)
        .single();

      if (!error && data) {
        setIsOnline(data.online);
        setLastActive(new Date(data.last_active));
      }
    };

    fetchOnlineStatus();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser]);

  const formatLastSeen = (date: Date | null) => {
    if (!date) return "";
    if (isToday(date)) {
      return `last seen today at ${format(date, "h:mm a")}`;
    } else if (isYesterday(date)) {
      return `last seen yesterday at ${format(date, "h:mm a")}`;
    } else {
      return `last seen ${format(date, "MMM d, yyyy 'at' h:mm a")}`;
    }
  };
  return (
    <header className="w-full py-2 px-6 flex justify-between items-center border-b border-gray-400/25 shadow-xl">
      <section className="flex items-center gap-4">
        <Image src={"/avatar.png"} alt="avatar" width={32} height={32} />
        <div className="flex flex-col justify-between">
          <h1 className="font-bold">{selectedUser.name}</h1>

          <p
            className={`text-xs ${
              isOnline ? "text-green-base" : "text-gray-500"
            }`}
          >
            {isOnline ? "Online" : formatLastSeen(lastActive)}
          </p>
        </div>
      </section>

      <section className="flex items-center gap-4 text-gray-500">
        <HiSparkles size={20} />
        <FiSearch size={20} />
      </section>
    </header>
  );
}
