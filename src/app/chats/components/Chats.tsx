"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsFilter, BsThreeDotsVertical } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { TbMessageCirclePlus } from "react-icons/tb";
import { fetchProfileById } from "@/utils/supabase/actions/userActions";
import { User, UserWithChatInfo } from "@/utils/types";
import SingleChatTile from "./_allChats/SingleChatTile";
import { useChat } from "@/context/ChatContext";
import {
  fetchChatsForUser,
  getChatOrCreate,
} from "@/utils/supabase/actions/chatActions";
import { useUser } from "@/context/UserContext";
import SidePanel from "./_allChats/SidePanel";
export default function Chats() {
  const [showSidePanel, setShowSidePanel] = useState(false);

  const [chatUsers, setChatUsers] = useState<UserWithChatInfo[]>([]);
  const { selectedUser, setSelectedUser, setChatId } = useChat();
  const { user: currentUser } = useUser();

  useEffect(() => {
    if (!currentUser) return;
    const fetchProfiles = async () => {
      const chats = await fetchChatsForUser(currentUser.id);
      if (!chats) return;

      console.log("chats data :", chats);

      const userDataPromises = chats.map(async (chat) => {
        const otherUserId =
          chat.user1 === currentUser.id ? chat.user2 : chat.user1;
        const otherUser = await fetchProfileById(otherUserId);

        return {
          user: otherUser,
          last_message: chat.last_message,
          updated_at: chat.updated_at,
        };
      });

      const usersWithChatInfo = await Promise.all(userDataPromises);
      setChatUsers(usersWithChatInfo);
    };
    fetchProfiles();
  }, [currentUser, selectedUser]);

  const handleSelectChat = async (user: User) => {
    setSelectedUser(user);
    if (!currentUser) {
      return;
    }
    const chatData = await getChatOrCreate({ currentUser, selectedUser: user });
    if (!chatData) return;
    setChatId(chatData.id);
  };
  return (
    <div className="w-[25%] flex flex-col h-full shadow-md relative bg-gray-50">
      <AnimatePresence>
        {showSidePanel && <SidePanel close={() => setShowSidePanel(false)} />}
      </AnimatePresence>

      {/* Header Section */}
      <HeaderSection />
      {/* Chat List */}
      <div className="flex-1 flex overflow-y-auto flex-col gap-4">
        {chatUsers?.map((entry, index) => (
          <SingleChatTile
            key={index}
            user={entry.user}
            lastMessage={entry.last_message}
            updatedAt={entry.updated_at}
            onClick={() => handleSelectChat(entry.user)}
          />
        ))}
      </div>

      {/* Floating Action Button */}
      <div
        className="absolute bottom-6 right-6 hover:scale-105 transition-all duration-300 cursor-pointer"
        onClick={() => setShowSidePanel(true)}
      >
        <button className="w-12 h-12 rounded-full bg-green-base text-white flex items-center justify-center shadow-lg cursor-pointer">
          <TbMessageCirclePlus size={24} />
        </button>
      </div>
    </div>
  );
}

const HeaderSection = () => {
  return (
    <div className="p-2 py-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Left buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 bg-green-base text-white px-2.5 py-1.5 rounded text-xs font-medium">
            <BsFilter size={14} />
            <span>Custom filter</span>
          </button>
          <button className="text-gray-600 px-2.5 py-1.5 text-xs font-medium border border-gray-300 rounded">
            Save
          </button>
        </div>

        {/* Search input */}
        <div className="flex items-center bg-white border border-gray-300 rounded px-2.5 py-1.5 flex-1 max-w-sm">
          <FiSearch className="text-gray-500 mr-2" size={14} />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none w-full text-xs"
          />
        </div>

        {/* Filtered indicator */}
        <div className="flex items-center gap-1.5 text-green-base border border-gray-300 rounded px-2.5 py-1.5">
          <span className="text-xs font-medium">Filtered</span>
          <div className="flex flex-col">
            <div className="h-0.5 w-4 bg-green-base"></div>
            <div className="h-0.5 w-3 bg-green-base mt-0.5"></div>
            <div className="h-0.5 w-2 bg-green-base mt-0.5"></div>
          </div>
        </div>

        {/* Placeholder (invisible) button */}
        <button className="text-green-600 invisible">
          <BsThreeDotsVertical size={14} />
        </button>
      </div>
    </div>
  );
};
