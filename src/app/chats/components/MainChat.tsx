"use client";
import React, { useEffect, useState } from "react";
import Header from "./_mainChat/Header";
import MessagesSection from "./_mainChat/MessagesSection";
import InputSection from "./_mainChat/InputSection";
import { useChat } from "@/context/ChatContext";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { getUserDetails } from "@/utils/supabase/actions/userActions";
import { User as UserType } from "@supabase/supabase-js";
import { User } from "@/utils/types";
import { HiMiniChevronUpDown } from "react-icons/hi2";
import Lottie from "lottie-react";
import animationData from "../../../../public/chatRoomAnimation.json";

export default function MainChat() {
  const { selectedUser } = useChat();
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<User | null>();

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getUserDetails({ currentUser: user as UserType });
      if (profile) {
        setUserProfile(profile);
      }
    };
    fetchProfile();
  }, [user]);
  if (!selectedUser) {
    return (
      <div
        className={` bg-[url("/doodles.jpg")] flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500 relative`}
      >
        <div className="absolute inset-0 w-full h-full bg-white/50" />
        <Lottie
          animationData={animationData}
          loop={true}
          className="w-[40rem] z-[1]"
        />
        <h2 className="text-xl font-bold mb-2 z-[1]">No chat selected</h2>
        <p className="text-sm max-w-sm mb-4 z-[1]">
          Select a chat to see your messages. Start a new conversation or pick
          up where you left off.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative">
      <Header selectedUser={selectedUser} />
      <MessagesSection />
      <InputSection />
      <div className="flex items-center border-2 border-gray-300/25 rounded-md w-48 p-1 px-2 absolute bottom-4 right-4">
        <Image
          src={"/avatar.png"}
          alt="avatar"
          width={20}
          height={20}
          className="w-6 h-6 rounded-full"
        />
        <h1 className="text-sm ml-2">{userProfile?.name}</h1>
        <HiMiniChevronUpDown
          size={18}
          className="text-gray-500 self-end ml-auto"
        />
      </div>
    </div>
  );
}
