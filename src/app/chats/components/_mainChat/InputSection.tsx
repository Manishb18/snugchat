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
import { createClient } from "@/utils/supabase/client";
import { sendMessage } from "@/utils/supabase/actions/messageActions";
import MediaUploadModal from "./MediaUploadModal";

const ICON_SIZE = 14;

export default function InputSection() {
  const [message, setMessage] = useState("");
  const { selectedUser, chatId } = useChat();
  const { user: currentUser } = useUser();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const supabase = createClient();

  const handleSend = async () => {
    if (!message.trim() || !selectedUser || !currentUser || !chatId) return;
    try {
      await sendMessage({
        chatId,
        senderId: currentUser.id,
        type: "text",
        content: message,
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatId || !currentUser || !selectedUser) return;

    setSelectedFile(file);
    setUploadModalOpen(true);
  };

  const handleFileUpload = async (caption: string) => {
    if (!selectedFile || !chatId || !currentUser || !selectedUser) return;

    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}_${selectedFile.name}`;
      const filePath = `messages/${chatId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-media")
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error("Upload failed:", uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("chat-media")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      await sendMessage({
        chatId,
        senderId: currentUser.id,
        type: selectedFile.type.startsWith("image") ? "image" : "file",
        media_url: publicUrl,
        content: caption || selectedFile.name,
      });
    } catch (err) {
      console.error("File upload error:", err);
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
          className="absolute right-2 top-1/2 -translate-y-1/2 text-green-base cursor-pointer"
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-4">
          <div className="file-upload cursor-pointer hover:bg-gray-100 p-1 rounded-md relative">
            <ImAttachment
              size={ICON_SIZE}
              onClick={() => document.getElementById("file-input")?.click()}
            />
            <input
              id="file-input"
              type="file"
              accept="*/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <FaRegFaceSmile size={ICON_SIZE} />
          <FaRegClock size={ICON_SIZE} />
          <AiOutlineHistory size={ICON_SIZE} />
          <HiOutlineSparkles size={ICON_SIZE} />
          <PiNoteFill size={ICON_SIZE} />
          <FaMicrophone size={ICON_SIZE} />
        </div>
      </div>

      {uploadModalOpen && selectedFile && (
        <MediaUploadModal
          file={selectedFile}
          onClose={() => setUploadModalOpen(false)}
          onSend={handleFileUpload}
        />
      )}
    </div>
  );
}
