import { Button } from "@/components/ui/button";
import { useEditor } from "@/context/EditorContext";
import { Tooltip } from "antd";
import { CodeIcon, History, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectDropdown from "./lovable/ProjextDropdown";

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
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [projectDropdown, setProjectDropdown] = useState<boolean>(false);
  console.log("🚀 ~ Toolbar ~ projectDropdown:", projectDropdown);

  const { tab, setTab, showChat, setShowChat } = useEditor();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProjectDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between w-full px-4 py-2 border-b border-border  text-foreground shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div ref={dropdownRef} className="flex items-center ">
            {/* Logo */}
            <div
              className=" mr-2 mt-1 w-10 rounded-md cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src="https://img.freepik.com/premium-vector/luxury-letter-no-logo-designroyal-premium-letter-no-logo-design-vector-template_831218-3426.jpg"
                alt=""
              />
            </div>
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => setProjectDropdown(!projectDropdown)}
            >
              <span className="text-sm font-medium">cycle-hub-site</span>
              <span className="ml-2 text-xs opacity-75">🌐</span>
              <div className=" text-xs opacity-70">
                Previewing last saved version
              </div>
            </div>
            {projectDropdown && (
              <div>
                <ProjectDropdown />
              </div>
            )}
          </div>
        </div>

        <Tooltip title="History">
          <Button
            size="icon"
            variant="ghost"
            className="ml-8 text-foreground hover:bg-muted rounded-md"
          >
            <History />
          </Button>
        </Tooltip>

        <Tooltip title={showChat ? " Hide Chat" : " Show Chat"}>
          <Button
            size="icon"
            variant="ghost"
            className="text-foreground hover:bg-muted rounded-md"
            onClick={() => {
              setShowChat(!showChat);
            }}
          >
            {!showChat ? (
              <PanelLeftClose className="h-4 w-4 rotate-180" />
            ) : (
              <PanelLeftOpen className="h-4 w-4 rotate-180" />
            )}
          </Button>
        </Tooltip>

        <Tooltip title={tab == "code" ? " Preview" : "Code"}>
          <Button
            size="icon"
            variant="ghost"
            className="text-foreground hover:bg-muted rounded-md"
            onClick={() => {
              if (tab == "code") {
                setTab("preview");
              } else {
                setTab("code");
              }
            }}
          >
            <CodeIcon className="h-4 w-4 rotate-180" />
          </Button>
        </Tooltip>
      </div>

      {tab == "code" && (
        <div
          style={{
            backgroundColor: "black",

            fontSize: "15px",
            padding: "5px",
            borderRadius: "15px",
          }}
        >
          Read Only. To use the code editor,
          <span style={{ color: "blue", height: "100%" }}>
            upgrade to a paid plan
          </span>
        </div>
      )}

      {/* Right: Toggles & Deploy */}
      <div className="flex items-center gap-3">
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="109"
            height="113"
            fill="none"
            className="h-6 w-auto mr-2"
            viewBox="0 0 109 113"
          >
            <path
              fill="url(#supabase_logo_svg__a)"
              d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874z"
            ></path>
            <path
              fill="url(#supabase_logo_svg__b)"
              fill-opacity="0.2"
              d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874z"
            ></path>
            <path
              fill="#3ECF8E"
              d="M45.317 2.071c2.86-3.601 8.657-1.628 8.726 2.97l.442 67.251H9.83c-8.19 0-12.759-9.46-7.665-15.875z"
            ></path>
            <defs>
              <linearGradient
                id="supabase_logo_svg__a"
                x1="53.974"
                x2="94.163"
                y1="54.974"
                y2="71.829"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#249361"></stop>
                <stop offset="1" stop-color="#3ECF8E"></stop>
              </linearGradient>
              <linearGradient
                id="supabase_logo_svg__b"
                x1="36.156"
                x2="54.484"
                y1="30.578"
                y2="65.081"
                gradientUnits="userSpaceOnUse"
              >
                <stop></stop>
                <stop offset="1" stop-opacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
        </button>
        {/* <Zap className="w-5 h-5 cursor-pointer" /> */}
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 98 96"
            // fill="currentColor"
            className="size-6 mr-2"
          >
            <path
              fill="currentcolor"
              fill-rule="evenodd"
              d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a47 47 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <button className="px-2 py-1 rounded-sm bg-purple-700 text-sm font-medium">
          Upgrade
        </button>
        <button className="px-3 py-1 rounded-sm  bg-blue-600 text-sm font-medium">
          Publish
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
