export type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
};

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content?: string;
  type?: "text" | "image" | "file";
  media_url?: string;
  created_at: string;
  sender_name: string;
  sender_avatar: string;
}

export type UserWithChatInfo = {
  user: User;
  last_message: string | null;
  updated_at: string | null;
};
