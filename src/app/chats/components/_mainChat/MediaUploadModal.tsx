import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";

interface MediaUploadModalProps {
  file: File;
  onClose: () => void;
  onSend: (caption: string) => Promise<void>;
}

export default function MediaUploadModal({
  file,
  onClose,
  onSend,
}: MediaUploadModalProps) {
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSend = async () => {
    setIsUploading(true);
    await onSend(caption);
    setIsUploading(false);
    onClose();
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md shadow-lg w-96">
        <div className="mb-4">
          {file.type.startsWith("image") ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md"
            />
          ) : (
            <div className="p-4 bg-gray-100 rounded-md">{file.name}</div>
          )}
        </div>
        <input
          type="text"
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
            disabled={isUploading}
          >
            {isUploading ? <ImSpinner2 className="animate-spin" /> : <IoSend />}
            {isUploading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
