"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client"; // Your browser client

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient(); // Create client instance inside provider or ensure it's stable

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (e) {
        console.error("Error fetching initial session:", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event, session);
        setUser(session?.user ?? null);
        setLoading(false); // Set loading to false after auth state change too
        // If session is null, you might want to redirect or handle accordingly
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]); // Add supabase as a dependency if its instance can change, though typically it doesn't for a client-side singleton.

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
