import { useState, useMemo } from "react";

const dark = {
  panelAlt: "#111214",
  border: "#2a2a2a",
  text: "#e6e6e6",
  dim: "#9ca3af",
  mark: "rgba(37,99,235,.25)",
};

type Props = {
  files: Record<string, string>;
  onSelect: (path: string, line?: number) => void;
};

export default function SearchPanel({ files, onSelect }: Props) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    if (!q.trim()) return {};
    const grouped: Record<
      string,
      { line: number; text: string; start: number; end: number }[]
    > = {};
    for (const [path, content] of Object.entries(files)) {
      const lines = content.split("\n");
      lines.forEach((line, i) => {
        const idx = line.toLowerCase().indexOf(q.toLowerCase());
        if (idx >= 0) {
          grouped[path] ||= [];
          grouped[path].push({
            line: i + 1,
            text: line,
            start: idx,
            end: idx + q.length,
          });
        }
      });
    }
    return grouped;
  }, [q, files]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search…"
        style={{
          padding: 6,
          margin: 6,
          border: `1px solid ${dark.border}`,
          borderRadius: 4,
          background: dark.panelAlt,
          color: dark.text,
          outline: "none",
        }}
      />
      <div
        style={{
          flex: 1,
          overflow: "auto",
          fontFamily: "monospace",
          fontSize: 12,
          color: dark.text,
        }}
      >
        {Object.entries(results).map(([path, hits]) => (
          <div key={path} style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600, margin: "4px 0" }}>
              {path} ({hits.length})
            </div>
            {hits.map((h, i) => (
              <div
                key={i}
                onClick={() => onSelect(path, h.line)}
                style={{ cursor: "pointer", padding: "2px 8px" }}
              >
                line {h.line}:{" "}
                <span>
                  {h.text.slice(0, h.start)}
                  <mark style={{ backgroundColor: dark.mark }}>
                    {h.text.slice(h.start, h.end)}
                  </mark>
                  {h.text.slice(h.end)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
