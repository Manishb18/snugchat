"use client";

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-red-500 mb-4">Oops!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Sorry, something went wrong. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
