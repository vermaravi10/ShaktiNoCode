import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Undo,
  Redo,
  Smartphone,
  Monitor,
  Save,
  Rocket,
  Sparkles,
  Sun,
  Moon,
  Palette,
  Home,
} from "lucide-react";
import { Tooltip } from "antd";
import { useEditor } from "@/context/EditorContext";
import { CloseSquareOutlined } from "@ant-design/icons";

interface ToolbarProps {
  isEditMode: boolean;
  onToggleMode: (checked: boolean) => void;
  isMobileView: boolean;
  onToggleMobileView: () => void;
  isVisualEditMode: boolean;
  onToggleVisualEditMode: () => void;
  logout: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  isEditMode,
  onToggleMode,
  isMobileView,
  onToggleMobileView,
  isVisualEditMode,
  onToggleVisualEditMode,
  logout,
}) => {
  const [showProfileDropdown, setShowProfileDropdown] =
    useState<boolean>(false);
  const { undo, redo, canUndo, canRedo, reset } = useEditor();

  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="flex items-center justify-between w-full px-4 py-2 border-b border-border  text-foreground shadow-sm">
      {/* Left: Action Buttons */}
      <div className="flex items-center gap-2">
        <Tooltip title="Home">
          <Button
            size="icon"
            variant="ghost"
            className="text-foreground hover:bg-muted rounded-md"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip title="Save">
          <Button
            size="icon"
            variant="ghost"
            className="text-foreground hover:bg-muted rounded-md"
          >
            <Save className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip title="AI Auto-correct">
          <Button
            size="icon"
            variant="ghost"
            className="text-foreground bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 rounded-md"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip title="Undo">
          <Button
            size="icon"
            variant="ghost"
            className="text-foreground hover:bg-muted rounded-md"
            onClick={undo}
            disabled={!canUndo}
          >
            <Undo className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip title="Redo">
          <Button
            size="icon"
            variant="ghost"
            className="text-foreground hover:bg-muted rounded-md"
            onClick={redo}
            disabled={!canRedo}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip title="Reset">
          <Button
            size="icon"
            variant="ghost"
            className="text-foreground hover:bg-muted rounded-md"
            onClick={reset}
          >
            <CloseSquareOutlined className="h-4 w-4 rotate-180" />
          </Button>
        </Tooltip>
      </div>

      {/* Right: Toggles & Deploy */}
      <div className="flex items-center gap-3">
        {/* Edit Mode */}
        <Tooltip title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}>
          <div className="flex items-center gap-1">
            <Switch
              checked={isEditMode}
              onCheckedChange={onToggleMode}
              className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-300"
            />
          </div>
        </Tooltip>
        <Tooltip title="Visual Edit">
          <Button
            onClick={onToggleVisualEditMode}
            size="icon"
            variant="ghost"
            className={`rounded-md text-foreground transition-colors ${
              isVisualEditMode
                ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 ring-2 ring-red-400"
                : "bg-gradient-to-r from-gray-500/10 to-gray-700/10 hover:from-gray-500/20 hover:to-gray-700/20"
            }`}
          >
            <Palette
              className={`h-4 w-4 ${
                isVisualEditMode ? "text-red-400" : "text-gray-400"
              }`}
            />
          </Button>
        </Tooltip>

        {/* View Toggle */}
        <Tooltip
          title={
            isMobileView ? "Switch to Desktop View" : "Switch to Mobile View"
          }
        >
          <Button
            size="icon"
            variant="ghost"
            className={`text-foreground hover:bg-muted rounded-md transition ${
              isMobileView ? "bg-accent/10" : ""
            }`}
            onClick={onToggleMobileView}
          >
            {!isMobileView ? (
              <Smartphone className="h-4 w-4" />
            ) : (
              <Monitor className="h-4 w-4" />
            )}
          </Button>
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip
          title={
            theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
        >
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            className="text-foreground hover:bg-muted rounded-md"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </Tooltip>

        {/* Deploy */}
        <Tooltip title="Deploy Site">
          <Button
            size="icon"
            variant="ghost"
            className="text-foreground bg-gradient-to-r from-blue-500/10 to-green-500/10 hover:from-blue-500/20 hover:to-green-500/20 rounded-md"
          >
            <Rocket className="h-4 w-4" />
          </Button>
        </Tooltip>

        {/* User Profile Dropdown */}
        <div className="relative">
          <Tooltip title="User Profile">
            <Button
              size="icon"
              variant="ghost"
              className="text-foreground hover:bg-muted rounded-md"
              onClick={() => setShowProfileDropdown((prev) => !prev)}
            >
              <span className="sr-only">User Profile</span>
              {/* Use a generic user icon from lucide-react */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </Button>
          </Tooltip>
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                // onClick={handleViewProfile}
              >
                View Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
