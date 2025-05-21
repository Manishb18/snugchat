import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AuthForm } from "./components/AuthForm";

export default function LoginPage() {

  async function login(formData: FormData) {
    "use server"
    const supabase = await createClient();
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
  
    const { error } = await supabase.auth.signInWithPassword(data)
  
    if (error) {
      redirect('/error')
    }
  
    revalidatePath('/', 'layout')
    redirect('/')
  } 
  async function signup(formData: FormData) {
    "use server"
    const supabase = await createClient()
  
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
  
    
      // 1. Sign up the user with all required profile data in the metadata
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            full_name: name 
          }
        }
      })
  
      if (signUpError) {
        console.error("Sign up error:", signUpError)
        return { error: "Failed to create account. Please try again." }
      }
  
      revalidatePath('/', 'layout')
      redirect('/')
  }
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm login={login} signup={signup} />
    </div>
  );
}
