"use client";
import { useChat } from "@/context/ChatContext";
import { useUser } from "@/context/UserContext";
import { getMessages } from "@/utils/supabase/actions/chatActions";
import { Message } from "@/utils/types";
import { createClient } from "@/utils/supabase/client";
import { db } from "@/utils/indexedDB";
import React, { useEffect, useRef, useState } from "react";
import { BiCheckDouble } from "react-icons/bi";
import Image from "next/image";

const supabase = createClient();

export default function MessagesSection() {
  const { selectedUser, chatId } = useChat();
  const { user: currentUser, loading } = useUser();
  const [messages, setMessages] = useState<Message[] | []>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (!selectedUser || !currentUser || !chatId) return;

    const fetchMessages = async () => {
      // Fetch messages from IndexedDB
      setLoadingMessages(true);
      const messagesData = await db.messages
        .where("chat_id")
        .equals(chatId)
        .sortBy("created_at");

      if (messagesData) setMessages(messagesData);

      setLoadingMessages(false);

      // Fetch messages from server and update IndexedDB
      const serverMessages = await getMessages({ chatId });
      if (serverMessages) {
        await db.messages.bulkPut(serverMessages);
      }
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
        async (payload) => {
          const newMessage = payload.new as Message;

          // Fetch complete message from the view
          const { data: fullMessage, error } = await supabase
            .from("messages_with_profiles")
            .select("*")
            .eq("id", newMessage.id)
            .single();

          if (error) {
            console.error(
              "Error fetching full message with sender details:",
              error
            );
            return;
          }

          if (fullMessage) {
            await db.messages.put(fullMessage);
            setMessages((prev) => [...prev, fullMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 h-full bg-gray-50 flex flex-col justify-end items-center" />
    );
  }

  console.log("messages :", messages);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isCurrentUser = (senderId: string) => {
    return senderId === currentUser?.id;
  };

  if (loading) {
    return (
      <div
        className={`flex-1 h-full  flex flex-col overflow-y-auto  custom-scrollbar bg-[url("/doodles.jpg")] relative`}
      >
        Loading Messages
      </div>
    );
  }

  return (
    <div
      className={`flex-1 h-full  flex flex-col overflow-y-auto  custom-scrollbar bg-[url("/doodles.jpg")] relative`}
    >
      <div className="bg-white/25 absolute inset-0 w-full h-full" />
      {messages.length === 0 ? (
        <div className="text-sm bg-green-light p-2 rounded-lg w-fit mb-4 mx-auto mt-auto z-[1]">
          This is the beginning of your conversation with {selectedUser.name}
        </div>
      ) : (
        <div className="flex flex-col mt-auto z-[1]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${
                isCurrentUser(msg?.sender_id) ? "self-end" : "self-start"
              }`}
            >
              {!isCurrentUser(msg?.sender_id) && (
                <Image
                  src={"/avatar.png"}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full mt-2"
                />
              )}
              <div
                className={`p-2 m-2 flex flex-col rounded-lg min-w-48 w-fit shadow-md ${
                  isCurrentUser(msg?.sender_id) ? "bg-green-light" : "bg-white "
                }`}
              >
                <h1 className="text-green-base font-bold">{msg.sender_name}</h1>

                {/* {msg.type === "text" && <p>{msg.content}</p>} */}

                {msg.type === "image" && msg.media_url && (
                  <Image
                    src={msg.media_url}
                    alt="Sent image"
                    width={200}
                    height={200}
                    className="rounded-lg mt-2 object-cover"
                  />
                )}

                {msg.type === "file" && msg.media_url && (
                  <a
                    href={msg.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mt-2"
                  >
                    📎 Download File
                  </a>
                )}
                <p className="mt-1">{msg.content}</p>

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
        </div>
      )}
    </div>
  );
}
