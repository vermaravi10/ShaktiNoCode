import { useEditor } from "@/context/EditorContext";
import { Tooltip } from "antd";
import {
  ChevronLeft,
  Gift,
  Settings,
  Pencil,
  Circle,
  HelpCircle,
  Sun,
  Moon,
} from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectDropdown() {
  const navigate = useNavigate();
  const { theme, setTheme } = useEditor();
  console.log("🚀 ~ ProjectDropdown ~ theme:", theme);

  const toggleTheme = () => {
    if (theme == "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  console.log("🚀 ~ ProjectDropdown ~ render");
  return (
    <div className="absolute top-12 left-2 mt-2 w-72 bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-700 p-2">
      {/* Header */}
      <div
        onClick={() => {
          navigate("/");
        }}
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#2A2A2A] rounded-md"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">Go to Dashboard</span>
      </div>

      {/* Credits Section */}
      <div className="mt-2 bg-[#2A2A2A] rounded-md p-3">
        <h4 className="text-xs font-semibold mb-2">Ravi&apos;s Lovable</h4>
        <div className="flex justify-between text-sm mb-1">
          <span>Credits</span>
          <span className="text-gray-300">5 left</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden mb-1">
          <div className="w-/5 h-full bg-blue-600" />
        </div>
        <p className="text-xs text-gray-400">
          • Daily credits reset at midnight UTC
        </p>
      </div>

      {/* Menu Items */}
      <div className="mt-2 flex flex-col">
        <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#2A2A2A] rounded-md text-sm">
          <Gift className="w-4 h-4" /> Get free credits
        </button>
        <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#2A2A2A] rounded-md text-sm">
          <Settings className="w-4 h-4" /> Settings
        </button>
        <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#2A2A2A] rounded-md text-sm">
          <Pencil className="w-4 h-4" /> Rename project
        </button>

        <button
          className="flex items-center gap-3 px-3 py-2 hover:bg-[#2A2A2A] rounded-md text-sm"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          Appearance
        </button>

        <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#2A2A2A] rounded-md text-sm">
          <HelpCircle className="w-4 h-4" /> Help
        </button>
      </div>
    </div>
  );
}
