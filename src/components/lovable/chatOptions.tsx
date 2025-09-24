import {
  Github,
  Clock,
  Box,
  Settings,
  Database,
  Paperclip,
} from "lucide-react";

export default function ChatOptions() {
  return (
    <div className="absolute bottom-10  w-60 rounded-xl bg-[#1E1E1E] text-white shadow-lg border border-[#222] overflow-hidden">
      <div className="flex flex-col">
        <MenuItem icon={<Github size={18} />} label="GitHub" />
        <MenuItem icon={<Clock size={18} />} label="History" />
        <MenuItem icon={<Box size={18} />} label="Knowledge" />
        <MenuItem
          icon={<Settings size={18} />}
          label="Project Settings"
          shortcut="⌘."
        />
        <MenuItem
          icon={<Database size={18} className="text-green-500" />}
          label="Supabase"
        />
        <div className="h-px bg-[#222] my-1" />
        <MenuItem icon={<Paperclip size={18} />} label="Attach" />
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  shortcut,
}: {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2 hover:bg-[#1a1a1a] cursor-pointer">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      {shortcut && <span className="text-xs text-gray-400">{shortcut}</span>}
    </div>
  );
}
