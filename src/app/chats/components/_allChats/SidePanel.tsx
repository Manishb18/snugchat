import { useChat } from "@/context/ChatContext";
import { useUser } from "@/context/UserContext";
import { getChatOrCreate } from "@/utils/supabase/actions/chatActions";
import { fetchAllProfiles } from "@/utils/supabase/actions/userActions";
import { User } from "@/utils/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdGroupAdd } from "react-icons/md";

export default function SidePanel({ close }: { close: () => void }) {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<User[] | null>(null);
  const { user: currentUser } = useUser();

  useEffect(() => {
    async function fetchProfiles() {
      setLoading(true);
      const data = await fetchAllProfiles();
      console.log("data", data);
      setLoading(false);
      setProfiles(data);
    }

    fetchProfiles();
  }, [currentUser]);

  const handleSearch = async () => {
    setLoading(true);
    const data = await fetchAllProfiles(searchValue);
    setLoading(false);
    setProfiles(data);
  };

  return (
    <motion.div
      key="slide-panel"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="absolute inset-0 bg-white bg-opacity-60 z-50 flex justify-end"
    >
      <div className="h-full bg-white text-black p-4 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New Chat</h2>
          <button className="text-black text-xl cursor-pointer" onClick={close}>
            ✕
          </button>
        </div>
        {/* searching new users */}
        <div className="flex items-center gap-4 border border-gray-300 p-2 px-4 rounded-3xl  focus-within:border-2 focus-within:border-green-base">
          <FiSearch className="text-gray-500" size={20} />
          <input
            type="text"
            name="search"
            id="search"
            value={searchValue}
            placeholder="Search by name or email"
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full outline-none border-none"
          />
        </div>

        <div className="flex items-center gap-2 mt-4 p-3 rounded-xl hover:bg-green-light cursor-pointer">
          <span className="w-10 h-10 rounded-full bg-green-base flex items-center justify-center">
            <MdGroupAdd size={22} className="text-white" />
          </span>
          <h1 className="font-bold">New Group</h1>
        </div>

        <ShowAllProfiles profiles={profiles} close={close} loading={loading} />
      </div>
    </motion.div>
  );
}

const ShowAllProfiles = ({
  profiles,
  close,
  loading,
}: {
  profiles: User[] | null;
  close: () => void;
  loading: boolean;
}) => {
  return (
    <div className="flex flex-col gap-6 p-2 mt-6">
      <h1 className="text-gray-600 font-bold">All User Profiles</h1>
      {loading ? (
        <div>Loading user profiles...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {profiles?.map((profile, index) => (
            <SingleProfileCard key={index} user={profile} close={close} />
          ))}
        </div>
      )}
    </div>
  );
};

const SingleProfileCard = ({
  user,
  close,
}: {
  user: User | null;
  close: () => void;
}) => {
  const { user: currentUser } = useUser();
  const { setSelectedUser, setChatId } = useChat();
  if (!currentUser) {
    return null;
  }
  const handleSelectUser = async () => {
    console.log("selecting user::", currentUser, user);
    const chatData = await getChatOrCreate({
      currentUser,
      selectedUser: user as User,
    });
    if (!chatData) return;
    close();
    setChatId(chatData.id);
    setSelectedUser(user);
  };
  return (
    <div
      className="flex gap-4 hover:bg-gray-200 rounded-xl p-2 py-3 cursor-pointer"
      onClick={handleSelectUser}
    >
      <Image
        src={"/avatar.png"}
        alt="avatar"
        width={40}
        height={40}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex flex-col justify-between">
        <h1 className="font-bold text-gray-800">{user?.name}</h1>
        <h2 className="text-sm text-gray-600">{user?.email}</h2>
      </div>
    </div>
  );
};
