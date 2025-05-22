import { createClient } from "../client";
const supabase = createClient();

export const sendMessage = async ({
  chatId,
  senderId,
  content = "", // allow empty for file/image
  type = "text",
  media_url,
}: {
  chatId: string;
  senderId: string;
  content?: string;
  type: "text" | "image" | "file";
  media_url?: string;
}) => {
  if (!chatId || !senderId || (type === "text" && !content.trim())) {
    throw new Error("Missing required fields");
  }

  const messageToInsert = {
    chat_id: chatId,
    sender_id: senderId,
    content: content || "", // fallback to empty string
    type,
    media_url: media_url || null,
  };

  const { data, error: insertError } = await supabase
    .from("messages")
    .insert(messageToInsert)
    .select();

  if (insertError) {
    console.error("Insert error:", insertError);
    throw insertError;
  }

  // Update chat's last_message
  const lastMessageText =
    type === "text" ? content : type === "image" ? "📷 Photo" : "📎 File";

  const { error: updateError } = await supabase
    .from("chats")
    .update({
      last_message: lastMessageText,
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId);

  if (updateError) {
    console.error("Chat update error:", updateError);
    throw updateError;
  }

  return true;
};
