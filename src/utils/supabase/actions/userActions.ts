// utils/supabase/client.ts
import { User } from "../../types";
import { createClient } from "../client";
const supabase = createClient();
export async function getUserDetailsClient() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("user ::", user);

  if (userError || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("name, email, avatar_url")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return null;

  return profile;
}

export async function fetchAllProfiles(searchQuery = "") {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return null;
  }

  let query = supabase.from("profiles").select("*").neq("id", user?.id); // Exclude current user

  // Apply search filter if searchQuery is provided
  if (searchQuery.trim() !== "") {
    query = query.or(
      `name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }

  return data;
}

export const fetchProfileById = async (id: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
};
