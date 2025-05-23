import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AuthForm } from "./components/AuthForm";

export default function LoginPage() {
  async function login(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      // Handle different types of authentication errors
      let errorMessage = "Invalid email or password. Please try again.";

      if (error.message.includes("Email not confirmed")) {
        errorMessage =
          "Please check your email and confirm your account before signing in.";
      } else if (error.message.includes("Invalid login credentials")) {
        errorMessage =
          "Invalid email or password. Please check your credentials.";
      } else if (error.message.includes("Too many requests")) {
        errorMessage =
          "Too many login attempts. Please wait a moment before trying again.";
      }

      redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
    }

    revalidatePath("/", "layout");
    redirect("/");
  }

  async function signup(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Basic validation
    if (!name || !email || !password) {
      redirect(
        `/login?error=${encodeURIComponent("All fields are required.")}`
      );
    }

    if (password.length < 6) {
      redirect(
        `/login?error=${encodeURIComponent(
          "Password must be at least 6 characters long."
        )}`
      );
    }

    // 1. Sign up the user with all required profile data in the metadata
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: {
            name,
            full_name: name,
          },
        },
      }
    );

    if (signUpError) {
      console.error("Sign up error:", signUpError);

      // Handle different types of signup errors
      let errorMessage = "Failed to create account. Please try again.";

      if (signUpError.message.includes("User already registered")) {
        errorMessage =
          "An account with this email already exists. Please sign in instead.";
      } else if (signUpError.message.includes("Password should be at least")) {
        errorMessage = "Password must be at least 6 characters long.";
      } else if (
        signUpError.message.includes("Unable to validate email address")
      ) {
        errorMessage = "Please enter a valid email address.";
      } else if (signUpError.message.includes("Signup is disabled")) {
        errorMessage =
          "Account registration is currently disabled. Please contact support.";
      }

      redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
    }

    revalidatePath("/", "layout");
    redirect("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Left Section - Brand & Description */}
      <div className="flex items-center mb-10">
        <div className="w-20 h-20 bg-green-500/25 backdrop-blur-xl rounded-3xl flex items-center justify-center mr-6 shadow-2xl border border-green-400/30 hover:bg-green-500/30 transition-all duration-300 hover:scale-105">
          <svg
            className="w-10 h-10 text-white drop-shadow-lg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-6xl font-bold tracking-tight text-green-base drop-shadow-lg">
            Snug Chat
          </h1>
          <div className="w-24 h-1 bg-white rounded-full mt-2 shadow-sm"></div>
        </div>
      </div>

      {/* Right Section - Auth Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Snug Chat</h1>
          </div>

          <AuthForm login={login} signup={signup} />
        </div>
      </div>
    </div>
  );
}
