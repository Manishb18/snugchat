"use client";
import { useChat } from "@/context/ChatContext";
import { useUser } from "@/context/UserContext";
import { getChatOrCreate, getMessages } from "@/utils/supabase/chatActions";
import { Message } from "@/utils/types";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useRef, useState } from "react";
import { BiCheckDouble } from "react-icons/bi";
import Image from "next/image";

const supabase = createClient();

export default function MessagesSection() {
  const { selectedUser, chatId } = useChat();
  const { user: currentUser } = useUser();
  const [messages, setMessages] = useState<Message[] | []>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedUser || !currentUser || !chatId) return;

    const fetchMessages = async () => {
      const messagesData = await getMessages({ chatId});
      console.log("message data ::", messagesData);
      if (messagesData) setMessages(messagesData);
    };

    fetchMessages();
  }, [selectedUser, currentUser, chatId]);

  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`messages-${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!selectedUser) {
    return <div className="flex-1 h-full bg-gray-50 flex flex-col justify-end items-center" />;
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isCurrentUser = (senderId : string)=>{
    return senderId === currentUser?.id;
  }

  return (
    <div className="flex-1 h-full bg-gray-50 flex flex-col overflow-y-scroll p-4">
      {messages.length === 0 ? (
        <div className="text-sm bg-gray-100 p-2 rounded-lg w-fit mb-4">
          This is the beginning of your conversation with {selectedUser.name}
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <div key={msg?.id} className={`flex gap-3 ${
                isCurrentUser(msg?.sender_id)
                  ? "self-end"
                  :  "self-start"
              }`}>
              {!isCurrentUser(msg.sender_id) && <Image src={"/avatar.png"} alt="avatar" width={60} height={60} className="w-9 h-9 rounded-full mt-2" />}
              <div
                className={`p-2 m-2 flex flex-col rounded-lg min-w-48 shadow-md ${
                  isCurrentUser(msg?.sender_id) ? "bg-green-light" : "bg-white"
                }`}
              >
                <h1 className="text-green-base font-bold">{msg.sender_name}</h1>
                {msg.content}
                <div className="text-xs text-gray-500 mt-1 self-end flex gap-2 items-center justify-center">
                  {new Date(msg.created_at).toLocaleTimeString()}
                  {isCurrentUser(msg.sender_id) && (
                    <BiCheckDouble size={20} className="text-[#6da5e5]" />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
  
}
