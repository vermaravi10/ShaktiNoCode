import React, { useState, useRef, useEffect } from "react";
import { Layout } from "antd";
import WidgetLibrary from "./WidgetLibrary";
import Canvas, { Widget } from "./Canvas";
import ChatPanel from "./ChatPanel";
import Toolbar from "./Toolbar";
import EditorFooter from "./EditorFooter";
import CodeEditor from "./CodeEditor";
import { parseWidgetsFromJSX } from "./utils/parseWidgets";

const { Sider, Content } = Layout;
const MIN_SIDER = 150;
const MAX_SIDER = 500;

// regenerate the code string from a fresh list of widgets
function regenerateCodeFromWidgets(
  widgets: Widget[],
  template: string
): string {
  const [before, after] = template.split(
    "{/* Your generated components will appear here */}"
  );
  const lines = widgets.map((w) => `      <${w.type}>${w.content}</${w.type}>`);
  return (
    before +
    "{/* Your generated components will appear here */}\n" +
    lines.join("\n") +
    "\n" +
    after
  );
}

const initialCode = `import React from 'react';
import { Button } from 'antd';

const GeneratedComponent = () => {
  return (
    <div style={{ padding: '20px' }}>
      {/* Your generated components will appear here */}
    </div>
  );
};

export default GeneratedComponent;
`;

const EditorPage: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [droppedWidgets, setDroppedWidgets] = useState<Widget[]>([]);
  const [code, setCode] = useState<string>(initialCode);
  const [splitRatio, setSplitRatio] = useState(0.5);
  const [leftWidth, setLeftWidth] = useState(300);
  const [rightWidth, setRightWidth] = useState(300);
  const [selectedWidgetId, setSelectedWidgetId] = useState<number | null>(null);
  console.log("🚀 ~ selectedWidgetId:", selectedWidgetId);

  const monacoRef = useRef<any>(null);
  const dragging = useRef<null | "left" | "right" | "split">(null);

  // resize handlers…
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragging.current === "split") {
        const total = window.innerHeight - 48;
        let r = (e.clientY - 48) / total;
        setSplitRatio(Math.max(0.1, Math.min(0.9, r)));
      } else if (dragging.current === "left") {
        let w = Math.max(MIN_SIDER, Math.min(MAX_SIDER, e.clientX));
        setLeftWidth(w);
      } else if (dragging.current === "right") {
        const total = window.innerWidth;
        let w = Math.max(MIN_SIDER, Math.min(MAX_SIDER, total - e.clientX));
        setRightWidth(w);
      }
    };
    const onMouseUp = () => (dragging.current = null);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Delete key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedWidgetId !== null) {
        setDroppedWidgets((ws) => ws.filter((w) => w.id !== selectedWidgetId));
        setSelectedWidgetId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedWidgetId]);

  const handleDrop = (widget: any) => {
    // 1️⃣ update canvas state
    const nw: Widget = {
      id: Date.now(),
      type: widget.type,
      content: widget.content,
    };
    setDroppedWidgets((ws) => [...ws, nw]);

    // 2️⃣ inject JSX into code
    const snippet = `      <${widget.type}>${widget.content}</${widget.type}>\n`;
    const newCode = code.replace(
      "{/* Your generated components will appear here */}",
      `{/* Your generated components will appear here */}\n${snippet}`
    );
    setCode(newCode);
  };

  const moveWidget = (from: number, to: number) => {
    setDroppedWidgets((ws) => {
      const copy = [...ws];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);

      const newCode = regenerateCodeFromWidgets(copy, code);
      setCode(newCode);

      return copy;
    });
  };

  return (
    <Layout className="editor-layout bg-background dark:bg-black h-screen">
      <Toolbar
        isEditMode={isEditMode}
        onToggleMode={() => setIsEditMode((m) => !m)}
        isMobileView={isMobileView}
        onToggleMobileView={() => setIsMobileView((v) => !v)}
      />

      <Layout className="flex flex-row flex-1 overflow-hidden">
        <Sider
          width={isEditMode ? 0 : leftWidth}
          className="h-full transition-all duration-200 overflow-hidden bg-background border-r border-border"
        >
          <WidgetLibrary />
        </Sider>
        {!isEditMode && (
          <div
            onMouseDown={() => (dragging.current = "left")}
            className="w-1 cursor-col-resize bg-border"
          />
        )}

        <Content className="flex flex-col flex-1 overflow-hidden">
          {isEditMode ? (
            <div className="flex flex-col flex-1 p-4">
              {/* Canvas */}
              <div
                className="overflow-auto"
                style={{ height: `${splitRatio * 100}vh` }}
              >
                <Canvas
                  onDrop={handleDrop}
                  droppedWidgets={droppedWidgets}
                  isMobileView={isMobileView}
                  moveWidget={moveWidget}
                  selectedWidgetId={selectedWidgetId}
                  onSelectWidget={setSelectedWidgetId}
                />
              </div>
              {/* Splitter */}
              <div
                onMouseDown={() => (dragging.current = "split")}
                className="h-1 bg-border cursor-row-resize"
              />
              {/* Code Editor */}
              <div
                className="overflow-auto"
                style={{ height: `${(1 - splitRatio) * 100}vh` }}
              >
                <CodeEditor
                  ref={monacoRef}
                  code={code}
                  onCodeChange={(newVal) => {
                    setCode(newVal);
                    setDroppedWidgets(parseWidgetsFromJSX(newVal));
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="relative flex justify-center items-start overflow-hidden h-full bg-background text-foreground">
              <div
                className={`w-full h-full ${
                  isMobileView
                    ? "max-w-sm border-x border-border shadow-lg bg-background"
                    : ""
                }`}
              >
                <Canvas
                  onDrop={handleDrop}
                  droppedWidgets={droppedWidgets}
                  isMobileView={isMobileView}
                  moveWidget={moveWidget}
                  selectedWidgetId={selectedWidgetId}
                  onSelectWidget={setSelectedWidgetId}
                />
              </div>
            </div>
          )}
        </Content>

        {!isEditMode && (
          <div
            onMouseDown={() => (dragging.current = "right")}
            className="w-1 cursor-col-resize bg-border"
          />
        )}
        <Sider
          width={isEditMode ? 0 : rightWidth}
          className="h-full transition-all duration-200 overflow-hidden bg-white dark:bg-neutral-800 border-l border-border"
        >
          <ChatPanel />
        </Sider>
      </Layout>

      {!isEditMode && <EditorFooter />}
    </Layout>
  );
};

export default EditorPage;
