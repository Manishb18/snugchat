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
import EmojiPicker from "emoji-picker-react";

const ICON_SIZE = 16;

export default function InputSection() {
  const [message, setMessage] = useState("");
  const { selectedUser, chatId } = useChat();
  const { user: currentUser } = useUser();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
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
    <div className="border-t border-gray-400/25 shadow-lg px-4 pb-6 relative">
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
          <div className="file-upload cursor-pointer hover:bg-gray-100  rounded-md relative group">
            <ImAttachment
              size={ICON_SIZE}
              onClick={() => document.getElementById("file-input")?.click()}
            />
            <Label text="file upload" />
            <input
              id="file-input"
              type="file"
              accept="*/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="cursor-pointer hover:bg-gray-100  rounded-md relative group">
            <FaRegFaceSmile
              size={ICON_SIZE}
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="cursor-pointer"
            />
            <Label text="emojis" />
            {showEmojiPicker && (
              <EmojiPicker
                onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject)}
                className="!absolute bottom-[100%] left-[12%] z-10"
              />
            )}
          </div>

          <div className="relative group">
            <FaRegClock size={ICON_SIZE} />
            <Label text="coming soon" />
          </div>
          <div className="relative group">
            <AiOutlineHistory size={ICON_SIZE} />
            <Label text="coming soon" />
          </div>
          <div className="relative group">
            <HiOutlineSparkles size={ICON_SIZE} />
            <Label text="coming soon" />
          </div>

          <div className="relative group">
            <PiNoteFill size={ICON_SIZE} />
            <Label text="coming soon" />
          </div>

          <div className="relative group">
            <FaMicrophone size={ICON_SIZE} />
            <Label text="coming soon" />
          </div>
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

const Label = ({ text }: { text: string }) => {
  return (
    <div className="hidden group-hover:inline-block absolute top-[-210%] right-[-100]  whitespace-nowrap text-[10px] text-gray-400 font-medium border border-gray-100 bg-gray-200 rounded-lg p-2 ">
      {text}
    </div>
  );
};
