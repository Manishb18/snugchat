import { createClient } from "./client"; // Or your correct supabase client path
const supabase = createClient();
export const sendMessage = async ({
  chatId,
  senderId,
  content,
}: {
  chatId: string;
  senderId: string;
  content: string;
}) => {
  if (!chatId || !senderId || !content.trim()) {
    throw new Error("Missing required fields");
  }

  console.log("inserting ::");

  // Insert the message
  const { data, error: insertError } = await supabase
  .from("messages")
  .insert({
    chat_id: chatId,
    sender_id: senderId,
    content: content,
  })
  .select(); // <- this returns the inserted row(s)


  console.log("data", data);

  if (insertError) {
    console.error("error", insertError);
    throw insertError;
  }


  
  // Update chat's last_message and updated_at
  const { error: updateError } = await supabase
    .from("chats")
    .update({
      last_message: content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId);

  if (updateError) {
    throw updateError;
  }
  return true;
};
