import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import { ImAttachment } from "react-icons/im";
import { FaRegFaceSmile } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa6";
import { AiOutlineHistory } from "react-icons/ai";
import { HiOutlineSparkles } from "react-icons/hi";
import { PiNoteFill } from "react-icons/pi";
import { FaMicrophone } from "react-icons/fa";
import { useChat } from "@/context/ChatContext";
import { useUser } from "@/context/UserContext";
import { getChatOrCreate } from "@/utils/supabase/chatActions";
import { createClient } from "@/utils/supabase/client";
import { sendMessage } from "@/utils/supabase/messageActions";

const ICON_SIZE = 14;
export default function InputSection() {
  const [message, setMessage] = useState("");
  const { selectedUser, chatId } = useChat();
  const { user: currentUser } = useUser();

  const handleSend = async () => {
    if (!message.trim() || !selectedUser || !currentUser || !chatId) return;
    console.log("sending message")
    try {
      await sendMessage({
        chatId,
        senderId: currentUser.id,
        content: message,
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  return (
    <div className="border-t border-gray-400/25 shadow-lg px-4 pb-6">
      <div className="w-full relative py-3">
        <input
          type="text"
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="w-full outline-none text-gray-700"
          placeholder="Message..."
        />
        <IoSend
          size={20}
          onClick={handleSend}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-green-base"
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-4 ">
          <ImAttachment size={ICON_SIZE} />
          <FaRegFaceSmile size={ICON_SIZE} />
          <FaRegClock size={ICON_SIZE} />
          <AiOutlineHistory size={ICON_SIZE} />
          <HiOutlineSparkles size={ICON_SIZE} />
          <PiNoteFill size={ICON_SIZE} />
          <FaMicrophone size={ICON_SIZE} />
        </div>
      </div>
    </div>
  );
}
