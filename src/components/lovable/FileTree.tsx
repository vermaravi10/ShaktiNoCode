import { memo, useMemo, useState, ReactNode } from "react";
import { TreeFileMap } from "./editor";

const dark = {
  text: "#e6e6e6",
  border: "#2a2a2a",
  sel: "rgba(37,99,235,.14)",
};

type FileNode =
  | {
      type: "folder";
      name: string;
      path: string;
      children: FileNode[];
      open?: boolean;
      depth: number;
    }
  | { type: "file"; name: string; path: string; depth: number };

function buildTree(files: TreeFileMap): FileNode[] {
  // Collect folders & files from FileMap keys (which are absolute like "/src/App.jsx")
  const folders: Record<string, { children: Set<string> }> = {};
  const filePaths: string[] = [];

  const keys = Object.keys(files);
  for (const k of keys) {
    const entry = files[k];
    if (entry?.type === "folder") {
      if (!folders[k]) folders[k] = { children: new Set() };
      // ensure parent-child links
      const parent = k.slice(0, k.lastIndexOf("/")) || "/";
      if (!folders[parent]) folders[parent] = { children: new Set() };
      if (k !== "/") folders[parent].children.add(k);
    } else if (entry?.type === "file") {
      filePaths.push(k);
      const parent = k.slice(0, k.lastIndexOf("/")) || "/";
      if (!folders[parent]) folders[parent] = { children: new Set() };
      folders[parent].children.add(k);
    }
  }
  if (!folders["/"]) folders["/"] = { children: new Set() };

  const toNode = (p: string, depth: number): FileNode => {
    const name = p === "/" ? "/" : p.split("/").filter(Boolean).slice(-1)[0];
    const isFolder = !!files[p] && (files[p] as any).type === "folder";
    if (isFolder || p === "/") {
      const children = Array.from(folders[p]?.children || []).sort((a, b) => {
        const AisFile = files[a]?.type === "file";
        const BisFile = files[b]?.type === "file";
        if (AisFile !== BisFile) return AisFile ? 1 : -1; // folders first
        return a.localeCompare(b);
      });
      return {
        type: "folder",
        name,
        path: p,
        depth,
        open: true,
        children: children.map((c) => toNode(c, depth + 1)),
      };
    }
    return { type: "file", name, path: p, depth };
  };

  // Root-first, then its children
  const root = toNode("/", 0) as Extract<FileNode, { type: "folder" }>;
  return root.children;
}

function Row({
  node,
  selectedPath,
  onSelect,
  onToggle,
}: {
  node: FileNode;
  selectedPath: string | null;
  onSelect: (p: string) => void;
  onToggle: (p: string) => void;
}) {
  const pad = 6 + node.depth * 14;
  const isSel = node.type === "file" && node.path === selectedPath;

  if (node.type === "folder") {
    return (
      <>
        <div
          onClick={() => onToggle(node.path)}
          style={{
            padding: "6px 8px",
            paddingLeft: pad,
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 600,
            color: dark.text,
          }}
          title={node.path}
        >
          <span
            style={{ transform: node.open ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            ▶
          </span>
          <span>📁 {node.name}</span>
        </div>
        {node.open &&
          node.children.map((c) => (
            <Row
              key={c.path}
              node={c}
              selectedPath={selectedPath}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
      </>
    );
  }

  return (
    <div
      onClick={() => onSelect(node.path)}
      style={{
        padding: "6px 8px",
        paddingLeft: pad,
        cursor: "pointer",
        userSelect: "none",
        background: isSel ? dark.sel : "transparent",
        borderBottom: `1px dashed ${dark.border}`,
        color: dark.text,
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      }}
      title={node.path}
    >
      📄 {node.name}
    </div>
  );
}

export default memo(function FileTree({
  files,
  selectedFile,
  onFileSelect,
  rootFolder = "/",
  hideRoot = false,
}: {
  files: TreeFileMap;
  selectedFile?: string | null;
  onFileSelect?: (p: string) => void;
  rootFolder?: string;
  hideRoot?: boolean;
}) {
  const tree = useMemo(() => buildTree(files), [files]);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const attachOpen = (n: FileNode): FileNode =>
    n.type === "folder"
      ? {
          ...n,
          open: openMap[n.path] ?? n.open ?? true,
          children: n.children.map(attachOpen),
        }
      : n;

  const handleToggle = (p: string) => setOpenMap((m) => ({ ...m, [p]: !m[p] }));

  // Optionally hide root: here we’re already returning children of root, so nothing to change.
  const nodes = tree.map(attachOpen);

  return (
    <div style={{ padding: 4, color: dark.text }}>
      {nodes.map((n) => (
        <Row
          key={n.path}
          node={n}
          selectedPath={selectedFile || null}
          onSelect={(p) => onFileSelect?.(p)}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
});
