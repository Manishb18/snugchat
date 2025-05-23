"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { BsFillChatDotsFill } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import {
  FiRefreshCw,
  FiHelpCircle,
  FiDownload,
  FiBell,
  FiMenu,
  FiChevronDown,
} from "react-icons/fi";
import { HiMiniChevronUpDown } from "react-icons/hi2";
export default function Header() {
  const path = usePathname();
  if (path.includes("/login")) {
    return null;
  }
  return (
    <header className="border-b border-gray-400/25 shadow-sm w-full p-2 px-4 text-gray-500 bg-white">
      <div className="flex items-center justify-between w-full">
        {/* Left: Chat Icon and Title */}
        <section className="flex items-center gap-2" aria-label="App title">
          <BsFillChatDotsFill className="text-gray-500" aria-hidden="true" />
          <h1 className="font-semibold text-base">chats</h1>
        </section>
        {/* Right: Navigation/Actions */}
        <nav aria-label="Header actions">
          <ul className="flex items-center gap-2">
            {/* Refresh */}
            <li>
              <button className="flex items-center gap-1 bg-white rounded shadow px-3 py-1">
                <FiRefreshCw className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </li>
            {/* Help */}
            <li>
              <button className="flex items-center gap-1 bg-white rounded shadow px-3 py-1">
                <FiHelpCircle className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">Help</span>
              </button>
            </li>
            {/* Status */}
            <li>
              <button className="flex items-center gap-1 bg-white rounded shadow px-3 py-1">
                <span
                  className="w-3 h-3 rounded-full bg-yellow-400 inline-block"
                  aria-label="Status: 5 of 6 phones online"
                ></span>
                <span className="text-sm font-medium text-gray-700">
                  5 / 6 phones
                </span>
                <HiMiniChevronUpDown className="w-4 h-4" aria-hidden="true" />
              </button>
            </li>
            {/* Download */}
            <li>
              <button className="flex items-center justify-center bg-white rounded shadow px-3 py-1">
                <FiDownload className="w-4 h-4" aria-label="Download" />
              </button>
            </li>
            {/* Bell */}
            <li>
              <button className="flex items-center justify-center bg-white rounded shadow px-3 py-1">
                <FiBell className="w-4 h-4" aria-label="Mute notifications" />
              </button>
            </li>
            {/* Menu */}
            <li>
              <button className="flex items-center justify-center bg-white rounded shadow p-1 gap-1">
                <HiSparkles className="w-1 text-yellow-400" aria-label="Menu" />
                <FiMenu className="w-4 h-4 text-gray-400" aria-label="Menu" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
