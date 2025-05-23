"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/utils/types";

type ChatContextType = {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  chatId: string | null;
  setChatId: (id: string | null) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  useEffect(() => {
    console.log("inside chat provider", selectedUser, chatId);
  }, [selectedUser, chatId]);

  return (
    <ChatContext.Provider
      value={{ selectedUser, setSelectedUser, chatId, setChatId }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used inside ChatProvider");
  return context;
};
