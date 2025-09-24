import { useEditor } from "@/context/EditorContext";
import { auth } from "@/firebase";
import {
  Sandpack,
  SandpackConsole,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import Editor, { Monaco } from "@monaco-editor/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Toolbar from "../Toolbar";
import FileTree from "./FileTree";
import { SegmentedTabsSlider } from "./SliderTab";
import ChatComposer from "./chatPanel";
import SearchPanel from "./fileSearch";
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const dark = {
  bg: "#0f0f10",
  panel: "#151517",
  panelAlt: "#111214",
  border: "#2a2a2a",
  text: "#e6e6e6",
};

// --- shimmer system ---
const shimmerCSS = `
@keyframes shimmer {
  0% { background-position: -450px 0; }
  100% { background-position: 450px 0; }
}
.shimmer {
  position: relative;
  overflow: hidden;
  background: #2a2a2a; /* base dark grey */
  background-image: linear-gradient(
    90deg,
    #2a2a2a 0px,
    #3a3a3a 40px,
    #2a2a2a 80px
  );
  background-size: 450px 100%;
  animation: shimmer 1.2s infinite linear;
  border-radius: 8px;
}
`;

function Shimmer({
  h = 16,
  w = "100%",
  br = 8,
  style = {} as React.CSSProperties,
}: {
  h?: number | string;
  w?: number | string;
  br?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="shimmer"
      style={{ height: h, width: w, borderRadius: br, ...style }}
    />
  );
}

function RightPanelSkeleton({
  tab,
  showChat,
}: {
  tab: string;
  showChat: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: 20,
        margin: 10,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: showChat ? "68%" : "100%",
        borderLeft: "1px solid grey",
      }}
    >
      {tab === "code" ? (
        <div
          style={{
            display: "flex",
            height: "100%",
            border: "1px solid grey",
            borderRadius: 12,
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {/* Left file tree skeleton */}
          <div
            style={{
              borderRight: "1px solid grey",
              overflow: "auto",
              width: "30%",
              minHeight: 0,
            }}
          >
            <div
              style={{
                borderRadius: 10,

                padding: 8,
                margin: 8,
              }}
            >
              <Shimmer h={28} />
            </div>
            <div style={{ padding: 8, display: "grid", gap: 8 }}>
              <Shimmer h={18} w="80%" />
              <Shimmer h={18} w="60%" />
              <Shimmer h={18} w="70%" />
              <Shimmer h={18} w="50%" />
              <Shimmer h={18} w="65%" />
              <Shimmer h={18} w="55%" />
            </div>
          </div>

          {/* Editor skeleton */}
          <div
            style={{
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              width: "70%",
              minHeight: 0,
            }}
          >
            <div style={{ padding: 8, borderBottom: "1px solid #eee" }}>
              <Shimmer h={18} w="35%" />
            </div>
            <div style={{ flex: 1, minHeight: 0, padding: 8 }}>
              <div
                style={{
                  height: "100%",
                  border: "1px solid #eee",
                  borderRadius: 8,
                  padding: 8,
                }}
              >
                <Shimmer h="100%" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Preview skeleton
        <div style={{ minWidth: 0, height: "100%" }}>
          <div
            style={{
              height: "100%",
              border: "1px solid #eee",
              borderRadius: 12,
              overflow: "hidden",
              display: "flex",
              minHeight: 0,
            }}
          >
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  padding: 8,
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  gap: 8,
                }}
              >
                <Shimmer h={24} w={120} />
                <Shimmer h={24} w={80} />
              </div>
              <div style={{ flex: 1, padding: 8 }}>
                <div
                  style={{
                    height: "100%",
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 8,
                  }}
                >
                  <Shimmer h="100%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SYSTEM_SPEC = `
Return ONLY a single JSON object with this exact shape (no markdown, no fences):
{
  "files": { "<path>": "<full file content as string>", ... },
  "entry": "index.html",
  "dirents": { "<path>": "file" | "folder", ... }
}
Rules:
- Produce a minimal multi-file React + Vite project (case-sensitive). Use ONLY relative project paths.
- Always include these files (exact names/locations):
  - "index.html" (root) — must include: <div id="root"></div> and <script type="module" src="/src/main.jsx"></script>
  - "package.json" (with "type":"module", scripts for vite, and ALL runtime deps in "dependencies" — Sandpack ignores devDependencies):
      {
        "name": "<kebab-case-app-name>",
        "version": "0.0.0",
        "private": true,
        "type": "module",
        "scripts": { "dev":"vite", "build":"vite build", "preview":"vite preview" },
        "dependencies": {
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "react-router-dom": "^6.26.2"     // include only if routes are used
        }
      }
  - "vite.config.js" using @vitejs/plugin-react:
      import { defineConfig } from 'vite'
      import react from '@vitejs/plugin-react'
      export default defineConfig({ plugins: [react()] })
  - "src/main.jsx" using React 18 createRoot (NO ReactDOM.render):
      import React from 'react'
      import { createRoot } from 'react-dom/client'
      import App from './App.jsx'
      import './index.css'
      createRoot(document.getElementById('root')).render(
        <React.StrictMode><App /></React.StrictMode>
      )
    *If using React Router, wrap <App /> with <BrowserRouter> from 'react-router-dom'.
  - "src/App.jsx" — default export React component
  - "src/index.css" — minimal global styles
  - Optionally: "src/App.css" and any "src/pages/*.jsx" when routes are used

Project constraints:
- No external fetches, no servers, no environment variables required.
- Script tag in index.html MUST be exactly: <script type="module" src="/src/main.jsx"></script> (leading slash required).
- Use ESM imports everywhere (package.json has "type":"module").
- If you include routes, also include the corresponding files under "src/pages/" and wire them in App.jsx.

"dirents" MUST include EVERY file AND EVERY folder:
- For each file in "files", add "path": "file".
- For each parent folder that contains files/subfolders, add "path": "folder".
  Examples you MUST include when present:
    "src": "folder",
    "src/pages": "folder",
    "index.html": "file",
    "package.json": "file",
    "vite.config.js": "file",
    "src/main.jsx": "file",
    "src/App.jsx": "file",
    "src/index.css": "file",
    "src/App.css": "file",
    "src/pages/Home.jsx": "file"   // if created

Output requirements:
- Return ONLY the single JSON object with "files", "entry", and "dirents".
- Set "entry" to exactly "index.html".
- Keep contents minimal but runnable in Vite + React 18.
`;

type TreeFileEntry =
  | { type: "file"; content: string | Uint8Array }
  | { type: "folder" };
export type TreeFileMap = Record<string, TreeFileEntry>;

function addAncestorFolders(set: Set<string>, p: string) {
  const parts = p?.split("/")?.filter(Boolean);
  let acc = "";
  for (let i = 0; i < parts.length - 1; i++) {
    acc = acc ? `${acc}/${parts[i]}` : parts[i];
    set.add(`/${acc}`);
  }
}

/** Build FileTree-friendly map (folder/file) from LLM output. */
function toFileMap(
  files: Record<string, string>,
  dirents?: Record<string, "file" | "folder">
): TreeFileMap {
  const map: TreeFileMap = {};
  const folders = new Set<string>();

  if (dirents) {
    for (const [p, t] of Object.entries(dirents)) {
      const full = p.startsWith("/") ? p : `/${p}`;
      if (t === "folder") folders.add(full);
      if (t === "file" && !files[p] && !files[full]) {
        map[full] = { type: "file", content: "" };
      }
    }
  }

  for (const [p0, content] of Object.entries(files)) {
    const p = p0.startsWith("/") ? p0 : `/${p0}`;
    addAncestorFolders(folders, p.replace(/^\//, ""));
    map[p] = { type: "file", content };
  }

  for (const f of folders) if (!map[f]) map[f] = { type: "folder" };
  if (!map["/"]) map["/"] = { type: "folder" };
  return map;
}

export default function LovableUi() {
  console.log("🚀 ~ LovableUi ~ apiKey:", apiKey);
  const [currentTab, setCurrentTab] = useState("files");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filesWithoutPkg, setFilesWithoutPkg] = useState<any>();
  console.log("🚀 ~ LovableUi ~ filesWithoutPkg:", filesWithoutPkg);
  const [isMobileView, setIsMobileView] = useState(false);
  const [prompt, setPrompt] = useState(params.get("prompt") || "");

  const [project, setProject] = useState<{
    files: Record<string, string>;
    entry: string;
  }>({
    files: {},
    entry: "index.html",
  });
  console.log("🚀 ~ LovableUi ~ project:", project);
  console.log("🚀 ~ LovableUi ~ project:", project?.files);

  const [treeFiles, setTreeFiles] = useState<TreeFileMap>({});
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const paths = useMemo(
    () => Object.keys(project.files).sort(),
    [project.files]
  );
  const currentCode = selectedPath ? project.files[selectedPath] : "";

  const {
    isEditMode,
    setIsEditMode,
    isVisualEditMode,
    setIsVisualEditMode,
    tab,
    showChat,
  } = useEditor();

  function detectTemplate(files: Record<string, string>) {
    const hasTS = Object.keys(files).some(
      (p) => p.endsWith(".ts") || p.endsWith(".tsx")
    );
    console.log("🚀 ~ detectTemplate ~ hasTS:", hasTS);
    const hasReact = Object.keys(files).some(
      (p) => p.startsWith("src/") || p.endsWith("package.json")
    );
    console.log("🚀 ~ detectTemplate ~ hasReact:", hasReact);
    if (hasReact) return hasTS ? "react-ts" : "react";
    return "static";
  }

  function normalizeProject(parsed: {
    files?: Record<string, string>;
    entry?: string;
  }) {
    const files = { ...(parsed.files || {}) };
    const entry = parsed.entry || "index.html";

    if (!files["index.html"]) {
      files["index.html"] = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
    <title>AI Site</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
    } else {
      if (!/<div[^>]*id=["']root["']/.test(files["index.html"])) {
        files["index.html"] = files["index.html"].replace(
          /<body[^>]*>/i,
          (m) => `${m}\n    <div id="root"></div>`
        );
      }
      if (!/src\/main\.(t|j)sx?/.test(files["index.html"])) {
        files["index.html"] = files["index.html"].replace(
          /<\/body>/i,
          `<script type="module" src="/src/main.jsx"></script></body>`
        );
      }
    }

    const looksReact = Object.keys(files).some((p) => p.startsWith("src/"));
    if (looksReact && !files["src/main.jsx"]) {
      files["src/main.jsx"] = `import { createRoot } from "react-dom/client";
import App from "./App.jsx";
createRoot(document.getElementById("root")).render(<App />);`;
    }
    if (looksReact && !files["src/App.jsx"]) {
      files[
        "src/App.jsx"
      ] = `export default function App(){ return <div style={{padding:24}}>Hello</div>; }`;
    }
    return { files, entry };
  }

  async function generate() {
    if (!prompt) return;
    if (!apiKey) {
      // You can uncomment inputs below to capture apiKey on-screen.
      // alert("Please enter your OpenAI API key");
      // return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_SPEC },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        }),
      });
      console.log("🚀 ~ generate ~ res:", res);

      const data = await res.json();
      console.log("🚀 ~ generate ~ data:", data);
      let text = data?.choices?.[0]?.message?.content ?? "";
      console.log("🚀 ~ generate ~ text:", text);
      // strip accidental fences
      text = text.replace(/^```json\s*|```$/gim, "").trim();

      const parsed = JSON.parse(text); // { files, entry, dirents }
      console.log("🚀 ~ generate ~ parsed:", parsed);
      const normalized = normalizeProject(parsed);
      console.log("🚀 ~ generate ~ normalized:", normalized);
      setProject(normalized);

      const treeMap = toFileMap(normalized.files, parsed.dirents);
      setTreeFiles(treeMap);

      const first = Object.keys(normalized.files)[0] || null;
      setSelectedPath(first);
    } catch (e) {
      console.error(e);
      alert("Failed to parse model output. Check console.");
    } finally {
      setLoading(false);
    }
  }

  function onMount(editor: any, monaco: Monaco) {
    Object.entries(project.files).forEach(([p, content]) => {
      const uri = monaco.Uri.parse(`file:///${p}`);
      let model = monaco.editor.getModel(uri);
      if (!model) {
        monaco.editor.createModel(content, languageFromPath(p), uri);
      } else if (model.getValue() !== content) {
        model.setValue(content);
      }
    });
  }

  function onChangeEditor(val?: string) {
    if (!selectedPath) return;
    setProject((prev) => ({
      ...prev,
      files: { ...prev.files, [selectedPath]: val ?? "" },
    }));
  }

  const spKey = useMemo(() => {
    return JSON.stringify(
      Object.entries(project.files).map(([p, c]) => [
        p,
        typeof c === "string" ? c.length : 0,
      ])
    );
  }, [project.files]);

  useEffect(() => {
    if (params.get("prompt")) setPrompt(params.get("prompt") || "");
  }, [params]);

  useEffect(() => {
    if (prompt) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);

  const logout = () => {
    auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    if (project.files) {
      const allFiles = project.files || {};
      const filesWithoutPkg = { ...allFiles };
      delete filesWithoutPkg["package.json"];
      setFilesWithoutPkg(filesWithoutPkg);
    }
  }, [project.files]);

  return (
    <>
      <style>{shimmerCSS}</style>
      <div
        style={{
          height: "100vh",
          display: "grid",
          gridTemplateRows: "56px 1fr",
        }}
      >
        <Toolbar
          isEditMode={isEditMode}
          isVisualEditMode={isVisualEditMode}
          onToggleVisualEditMode={() => setIsVisualEditMode((v: boolean) => !v)}
          onToggleMode={() => setIsEditMode((m: boolean) => !m)}
          isMobileView={isMobileView}
          onToggleMobileView={() => setIsMobileView((v: boolean) => !v)}
          logout={logout}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {showChat && (
            <div
              style={{
                width: "30%",
                // border: "1px solid grey ",
                borderRadius: 10,
                margin: 10,
                display: "flex",
                justifyContent: "flex-end",

                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                Chat window coming soon...
              </div>
              <div style={{ margin: 10 }}>
                <ChatComposer />
              </div>
            </div>
          )}

          {loading ? (
            <RightPanelSkeleton tab={tab} showChat={showChat} />
          ) : (
            <div
              style={{
                borderRadius: 20,
                margin: 10,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: showChat ? "68%" : "100%",
                borderLeft: `1px solid ${dark.border}`,
                backgroundColor: dark.bg,
                color: dark.text,
              }}
            >
              {tab == "code" ? (
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    border: `1px solid ${dark.border}`,
                    borderRadius: 12,
                    overflow: "hidden",
                    minHeight: 0,
                    backgroundColor: dark.panel,
                  }}
                >
                  <div
                    style={{
                      borderRight: "1px solid grey",
                      overflow: "auto",
                      width: "30%",
                      minHeight: 0,
                    }}
                  >
                    <div
                      style={{
                        borderRadius: 10,
                        backgroundColor: "#2a2b2e",

                        padding: 2,
                      }}
                    >
                      <SegmentedTabsSlider
                        options={[
                          { value: "files", label: "files" },
                          { value: "search", label: "search" },
                        ]}
                        selected={currentTab}
                        onChange={setCurrentTab}
                      />
                    </div>
                    {/* <div style={{ padding: 8, fontWeight: 600 }}>Files</div> */}
                    {Object.keys(treeFiles).length <= 1 ? (
                      <div
                        style={{
                          borderRight: `1px solid ${dark.border}`,
                          overflow: "auto",
                          width: "100%",
                          minHeight: 0,
                          backgroundColor: dark.panelAlt,
                          color: dark.text,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        No files yet
                      </div>
                    ) : currentTab == "files" ? (
                      <FileTree
                        files={treeFiles}
                        selectedFile={
                          selectedPath
                            ? `/${selectedPath.replace(/^\//, "")}`
                            : "/"
                        }
                        onFileSelect={(fp) => {
                          const clean = fp.replace(/^\//, "");
                          setSelectedPath(clean);
                        }}
                        rootFolder="/"
                        hideRoot={false}
                      />
                    ) : (
                      <SearchPanel
                        files={project.files}
                        onSelect={(path, line) => {
                          setSelectedPath(path.replace(/^\//, ""));
                          console.log("Go to", path, line);
                        }}
                      />
                    )}
                  </div>

                  <div
                    style={{
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      width: "70%",
                      minHeight: 0,
                    }}
                  >
                    <div
                      style={{
                        padding: 8,
                        borderBottom: `1px solid ${dark.border}`,
                        fontWeight: 600,
                        backgroundColor: dark.panelAlt,
                        color: dark.text,
                      }}
                    >
                      {selectedPath || "Select a file"}
                    </div>
                    <div style={{ flex: 1, minHeight: 0 }}>
                      <Editor
                        height="100%"
                        theme="vs-dark"
                        language={languageFromPath(selectedPath)}
                        path={selectedPath || "untitled.txt"}
                        value={currentCode}
                        onMount={onMount}
                        onChange={onChangeEditor}
                        options={{ fontSize: 14, minimap: { enabled: false } }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ minWidth: 0, height: "100%" }}>
                  {/* Bordered container that clips the preview */}
                  <div
                    style={{
                      border: `1px solid ${dark.border}`,
                      borderRadius: 12,
                      overflow: "hidden",
                      display: "flex",
                      minHeight: 0,
                      backgroundColor: dark.panel,
                      height: "100%",
                    }}
                  >
                    <SandpackProvider
                      key={spKey}
                      template="vite-react"
                      files={filesWithoutPkg}
                      options={{
                        activeFile: project.entry || "index.html",
                      }}
                      style={{ flex: 1, display: "flex", minHeight: 0 }}
                    >
                      <SandpackPreview
                        showNavigator
                        showRefreshButton
                        style={{ flex: 1, height: "100%", minHeight: 0 }}
                      />
                    </SandpackProvider>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function languageFromPath(path?: string | null) {
  if (!path) return "plaintext";
  if (path.endsWith(".js") || path.endsWith(".jsx")) return "javascript";
  if (path.endsWith(".ts") || path.endsWith(".tsx")) return "typescript";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".html")) return "html";
  return "plaintext";
}

function extractDependencies(files: Record<string, string>) {
  try {
    if (files["package.json"]) {
      const pkg = JSON.parse(files["package.json"]);
      return {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        ...(pkg.dependencies || {}),
      };
    }
  } catch {}
  return {
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.26.2",
  };
}
