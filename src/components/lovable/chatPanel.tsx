"use client";

import { Plus, Maximize2, Lightbulb, AudioLines, ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatOptions from "./chatOptions";

const palette = {
  shell: "#151517",
  inner: "#1a1b1d",
  border: "#3a3a3a",
  text: "#e7e7e7",
  dim: "#b6b6b6",
  chipBg: "#202123",
  chipBorder: "#3a3a3a",
  chipHover: "#2a2b2e",
};

export default function ChatComposer({
  placeholder = "Ask n0...",
  onSend,
}: {
  placeholder?: string;
  onSend?: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  console.log("🚀 ~ ChatComposer ~ showOptions:", showOptions);
  const containerRef = useRef<HTMLDivElement>(null);

  const send = () => {
    if (!value.trim()) return;
    onSend?.(value);
    setValue("");
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        // outer rounded shell
        background: palette.inner,
        border: `1px solid ${palette.border}`,
        borderRadius: 18,
        padding: 10,
        color: palette.text,
      }}
    >
      {/* textarea */}
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{
          width: "100%",
          resize: "none",
          background: "transparent",
          border: "none",
          outline: "none",
          color: palette.text,
          fontSize: 16,
          lineHeight: "22px",
          padding: 4,
          marginBottom: 10,
        }}
      />

      {/* bottom bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        {/* left chips */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{ position: "relative" }}
            ref={containerRef}
            onClick={() => {
              setShowOptions(!showOptions);
            }}
          >
            <Chip icon={<Plus size={16} />} />
            {showOptions && <ChatOptions />}
          </div>
          <Chip
            icon={
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <Maximize2 size={14} style={{ marginRight: 6 }} />
                Edit
              </span>
            }
          />
        </div>

        {/* right chips + send */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Chip
            icon={
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <Lightbulb size={16} style={{ marginRight: 6 }} />
                Chat
              </span>
            }
          />
          <RoundIcon>
            <AudioLines size={16} />
          </RoundIcon>
          <RoundIcon
            onClick={send}
            style={{
              background: "#2a2b2e",
              borderColor: palette.chipBorder,
            }}
          >
            <ArrowUp size={16} />
          </RoundIcon>
        </div>
      </div>
    </div>
  );
}

/* --- small helpers --- */
function Chip({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        fontSize: 13,
        color: "#e7e7e7",
        background: palette.chipBg,
        border: `1px solid ${palette.chipBorder}`,
        borderRadius: 14,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = palette.chipHover)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = palette.chipBg)
      }
    >
      {icon}
    </button>
  );
}

function RoundIcon({
  children,
  onClick,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        background: palette.chipBg,
        border: `1px solid ${palette.chipBorder}`,
        color: "#e7e7e7",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
