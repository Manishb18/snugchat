"use client";

import { useState, useTransition } from "react";

export function AuthForm({
  login,
  signup,
}: {
  login: (formData: FormData) => Promise<any>;
  signup: (formData: FormData) => Promise<any>;
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMode = () => setIsLogin(!isLogin);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      if (isLogin) {
        await login(formData);
      } else {
        await signup(formData);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm space-y-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {isLogin ? "Welcome Back" : "Create an Account"}
      </h2>

      {!isLogin && (
        <>
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-3 pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
          disabled={isLoading}
        >
          {isLoading
            ? (isLogin ? "Logging in..." : "Signing up...")
            : (isLogin ? "Log In" : "Sign Up")}
        </button>

        <p className="text-sm text-center text-gray-600">
          {isLogin ? (
            <>
              New user?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 hover:underline font-medium"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
