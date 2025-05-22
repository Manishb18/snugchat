import { User } from "@supabase/supabase-js";
import { User as UserType } from "../../types";
import { createClient } from "../client";

const supabase = createClient();

export const fetchChatsForUser = async (currentUserId: string) => {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .or(`user1.eq.${currentUserId},user2.eq.${currentUserId}`)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching chats:", error);
    return null;
  }

  return data;
};

export async function getChatOrCreate({
  currentUser,
  selectedUser,
}: {
  currentUser: User;
  selectedUser: UserType;
}) {
  // Always sort user IDs to respect the unique index
  console.log("creating new chat");
  const [user1, user2] = [currentUser.id, selectedUser.id].sort();

  console.log("before fetching...")

  // 1. Try to fetch existing chat
  const { data: chatData, error: chatError } = await supabase
    .from("chats")
    .select("id")
    .eq("user1", user1)
    .eq("user2", user2)
    .single();

    console.log("aftet fetching");

  // 2. If found, return it
  if (chatData && !chatError) {
    return chatData;
  }

  console.log("no chat found");

  // 3. If not found, create a new chat
  const { data: newChat, error: createError } = await supabase
    .from("chats")
    .insert({ user1, user2 })
    .select("id")
    .single();

  if (createError) {
    console.error("Failed to create chat:", createError);
    return null;
  }

  return newChat;
}

export async function getMessages({ chatId }: { chatId: string }) {
  const { data : messagesData, error : messagesError } = await supabase
  .from("messages_with_profiles")
  .select("*")
  .eq("chat_id", chatId)
  .order("created_at", { ascending: true });

  if (messagesError) {
    console.error("Error fetching messages:", messagesError);
    return null;
  }

  return messagesData;
}

