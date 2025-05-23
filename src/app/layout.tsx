import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Snug Chat | A Chat Site",
  description:
    "Snug Chat is a chatting application which lets you chat with your friends and loved ones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex relative h-screen`}
      >
        <Toaster />
        <UserProvider>
          <Sidebar />
          <main className="flex-1 flex flex-col h-full">
            <Header />
            <div className="flex-1 overflow-hidden">{children}</div>
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
