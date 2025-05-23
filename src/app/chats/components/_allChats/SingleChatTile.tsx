"use client";
import { useChat } from "@/context/ChatContext";
import { User } from "@/utils/types";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import { HiUserCircle } from "react-icons/hi";
interface Props {
  user: User;
  lastMessage?: string | null;
  updatedAt?: string | null;
  onClick: () => void;
}

export default function SingleChatTile({
  user,
  lastMessage,
  updatedAt,
  onClick,
}: Props) {
  const { selectedUser } = useChat();
  function formatUpdatedAt(dateStr: string | null | undefined): string {
    if (!dateStr) return "";

    const date = new Date(dateStr);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      const hours = date.getHours() % 12 || 12;
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = date.getHours() >= 12 ? "PM" : "AM";
      return `${hours}:${minutes} ${ampm}`;
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      const day = String(date.getDate()).padStart(2, "0");
      const month = date.toLocaleString("default", { month: "short" });
      const year = String(date.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    }
  }

  return (
    <div
      className={`flex gap-4 p-1 px-4 border shadow-sm border-gray-400/10   hover:bg-gray-100 cursor-pointer ${
        selectedUser?.id === user.id ? "bg-gray-100" : "bg-white"
      }`}
      onClick={onClick}
    >
      <Image
        src={"/avatar.png"}
        alt="avatar"
        width={100}
        height={100}
        className="w-12 h-12 rounded-full  mt-1"
      />
      <div className="flex flex-col justify-center w-full">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">{user?.name || "User"}</h1>
          <span className="border-2 border-gray-400/20 rounded-sm px-4 p-1 text-xs">
            Tag
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <h2 className="text-gray-500">{lastMessage}</h2>
          <HiUserCircle size={20} className="text-gray-400" />
        </div>

        <div className="flex justify-between items-center mt-1">
          <p className="bg-gray-200 rounded-md px-2 p-1 text-xs w-fit">
            {user?.email || "user@example.com"}
          </p>

          <span className="font-semibold text-gray-400 text-[10px]">
            {formatUpdatedAt(updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
