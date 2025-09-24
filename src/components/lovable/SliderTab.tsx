import { useMemo } from "react";
import { Slider } from "@/components/ui/slider";

type Option<T> = { value: T; label: string };

const dark = {
  panelAlt: "#111214",
  border: "#2a2a2a",
  text: "#e6e6e6",
  accentBg: "rgba(37,99,235,.16)",
  accentText: "#c7d2fe",
};

type SegmentedTabsProps<T> = {
  options: Option<T>[];
  selected: T;
  onChange: (v: T) => void;
};

export function SegmentedTabsSlider<T>({
  options,
  selected,
  onChange,
}: SegmentedTabsProps<T>) {
  const idx = useMemo(
    () =>
      Math.max(
        0,
        options.findIndex((o) => o.value === selected)
      ),
    [options, selected]
  );

  const max = options.length - 1;

  return (
    <div
      style={{
        width: "100%",
        userSelect: "none",
        padding: "3px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${options.length}, 1fr)`,
          gap: 6,
        }}
      >
        {options?.map((o, i) => {
          const active = i === idx;
          return (
            <button
              key={String(o.value)}
              onClick={() => onChange(o.value)}
              style={{
                cursor: "pointer",
                border: `1px solid ${dark.border}`,
                borderRadius: 6,
                padding: "6px 10px",
                background: active ? dark.accentBg : dark.panelAlt,
                color: active ? dark.accentText : dark.text,
                fontSize: 14,
              }}
            >
              {o?.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
