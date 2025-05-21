import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import Chats from "./components/Chats";
import MainChat from "./components/MainChat";
import MainChatSidebar from "./components/MainChatSidebar";
import { ChatProvider } from "@/context/ChatContext";

export default async function ChatPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <ChatProvider>
      <div className="flex h-full">
        <Chats />
        <MainChat />
        <MainChatSidebar />
      </div>
    </ChatProvider>
  );
}
