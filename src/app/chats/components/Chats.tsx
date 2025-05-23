"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
import { ChatsHeader } from "./_allChats/ChatsHeader";
export default function Chats() {
  const [showSidePanel, setShowSidePanel] = useState(false);

  const [chatUsers, setChatUsers] = useState<UserWithChatInfo[]>([]);
  const { selectedUser, setSelectedUser, setChatId } = useChat();
  const { user: currentUser } = useUser();
  const [filters, setFilters] = useState<{
    search: string;
    date: string;
  } | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    const fetchProfiles = async () => {
      const chats = await fetchChatsForUser(currentUser.id);
      if (!chats) return;

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

      let usersWithChatInfo = await Promise.all(userDataPromises);

      if (filters) {
        if (filters.search) {
          usersWithChatInfo = usersWithChatInfo.filter((entry) => {
            return (
              entry.user.name
                ?.toLowerCase()
                .includes(filters.search.toLowerCase()) ||
              entry.user.email
                ?.toLowerCase()
                .includes(filters.search.toLowerCase())
            );
          });
        }
        if (filters.date) {
          usersWithChatInfo = usersWithChatInfo.filter((entry) => {
            return entry.updated_at.startsWith(filters.date);
          });
        }
      }

      setChatUsers(usersWithChatInfo);
    };
    fetchProfiles();
  }, [currentUser, selectedUser, filters]);

  const handleSelectChat = async (user: User) => {
    setSelectedUser(user);
    if (!currentUser) {
      return;
    }
    const chatData = await getChatOrCreate({ currentUser, selectedUser: user });
    console.log("chat data", chatData);
    if (!chatData) return;
    setChatId(chatData.id);
  };

  return (
    <div className="w-[25%] flex flex-col h-full shadow-md relative bg-gray-50">
      <AnimatePresence>
        {showSidePanel && <SidePanel close={() => setShowSidePanel(false)} />}
      </AnimatePresence>

      {/* Header Section */}
      <ChatsHeader
        filters={filters || { search: "", date: "" }}
        onFilterChange={(newFilters) => setFilters(newFilters)}
      />

      {!chatUsers ||
        (chatUsers.length === 0 && (
          <div className="p-2 border-t border-gray-400/20">
            No users in your chat
          </div>
        ))}
      <div className="flex-1 flex overflow-y-auto gap-0.5 flex-col hide-scrollbar pb-24">
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
