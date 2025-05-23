"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AuthFormContent({
  login,
  signup,
}: {
  login: (formData: FormData) => Promise<any>;
  signup: (formData: FormData) => Promise<any>;
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null); // Clear error when switching modes
  };

  // Check for error in URL params
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear any existing errors

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
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-gray-600">
          {isLogin
            ? "Sign in to continue your conversations"
            : "Join Snug Chat and start connecting"}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-base focus:border-green-base transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-base focus:border-green-base transition-all duration-200 bg-gray-50 hover:bg-white"
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-base focus:border-green-base transition-all duration-200 bg-gray-50 hover:bg-white"
            placeholder="Enter your password"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-base to-green-base/60 hover:from-green-600 hover:to-emerald-500 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
            </div>
          ) : isLogin ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </button>

        {/* Toggle Mode */}
        <div className="text-center pt-4">
          <p className="text-gray-600">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-green-base hover:text-green-600 font-semibold transition-colors duration-200 hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-green-base hover:text-green-600 font-semibold transition-colors duration-200 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </form>
    </div>
  );
}

export function AuthForm({
  login,
  signup,
}: {
  login: (formData: FormData) => Promise<any>;
  signup: (formData: FormData) => Promise<any>;
}) {
  return (
    <Suspense
      fallback={
        <div className="w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Loading...
            </h2>
            <p className="text-gray-600">Please wait...</p>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-green-base/30 border-t-green-base rounded-full animate-spin"></div>
          </div>
        </div>
      }
    >
      <AuthFormContent login={login} signup={signup} />
    </Suspense>
  );
}
