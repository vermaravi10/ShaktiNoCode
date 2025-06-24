import React, { useState, useRef, useEffect } from "react";
import { Layout } from "antd";
import WidgetLibrary from "./WidgetLibrary";
import Canvas, { Widget } from "./Canvas";
import ChatPanel from "./ChatPanel";
import Toolbar from "./Toolbar";
import EditorFooter from "./EditorFooter";
import CodeEditor from "./CodeEditor";
import parseWidgetsFromJSX from "./utils/parseWidgets";
import { useEditor } from "@/context/EditorContext";
import VisualEditor from "./VisualEditor";

const { Sider, Content } = Layout;
const MIN_SIDER = 150;
const MAX_SIDER = 500;

let idCounter = 1;
const generateUniqueId = () => idCounter++;

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
import { Button, Image, Calendar, Table } from 'antd';

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
  const [isMobileView, setIsMobileView] = useState(false);

  const [splitRatio, setSplitRatio] = useState(0.5);
  const [leftWidth, setLeftWidth] = useState(300);
  const [rightWidth, setRightWidth] = useState(300);

  const monacoRef = useRef<any>(null);
  const dragging = useRef<null | "left" | "right" | "split">(null);

  const selectedWidgetIdRef = useRef<any | null>(null);

  const {
    code,
    setCode,
    widgets,
    setWidgets,
    selectedWidgetId,
    setSelectedWidgetId,
    theme,
    setTheme,
    zoom,
    setZoom,
    isEditMode,
    setIsEditMode,
    isVisualEditMode,
    setIsVisualEditMode,
  } = useEditor();

  const handleSelectWidget = (widgetId: string) => {
    setSelectedWidgetId(widgetId);
    selectedWidgetIdRef.current = widgetId;
  };
  const handleEditMode = () => {
    setIsVisualEditMode(false);
  };

  // Handle code editor changes: parse new code to update widget list
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    try {
      const newWidgets = parseWidgetsFromJSX(newCode);
      setWidgets(newWidgets);
      // Reset selection if the previously selected widget is gone after code edit
      if (
        selectedWidgetId &&
        !newWidgets.find((w) => w.id === selectedWidgetId)
      ) {
        setSelectedWidgetId(null);
        selectedWidgetIdRef.current = null;
      }
    } catch (err) {
      console.error("Error parsing code:", err);
      // In case of parse error, we can choose to keep last known good state
    }
  };

  // Generate JSX code string from the widget list state (includes imports and component wrapper)
  const generateCodeFromWidgets = (widgetList: typeof widgets): string => {
    // Determine which Ant Design components need to be imported
    const importSet = new Set<string>();
    widgetList.forEach((w) => {
      if (["Button", "Image", "Table", "Calendar"].includes(w.type)) {
        importSet.add(w.type);
      }
    });
    // Build import statements
    let importLines = `import React from 'react';\n`;
    if (importSet.size > 0) {
      importLines += `import { ${Array.from(importSet).join(
        ", "
      )} } from 'antd';\n`;
    }
    importLines += "\n";

    // Start component code
    let componentCode = `const GeneratedComponent = () => {\n  return (\n    <div style={{ padding: '20px' }}>\n`;
    // Add JSX for each widget
    for (const widget of widgetList) {
      const { type, props, content } = widget;
      // Build attributes string for JSX
      let attrStr = "";
      if (props.style && Object.keys(props.style).length > 0) {
        // Convert style object to inline style JSX
        const stylePairs: string[] = [];
        for (const [key, val] of Object.entries(props.style)) {
          if (typeof val === "string") {
            stylePairs.push(`${key}: '${val}'`);
          } else {
            stylePairs.push(`${key}: ${val}`);
          }
        }
        attrStr += ` style={{ ${stylePairs.join(", ")} }}`;
      }
      if (props.src) {
        attrStr += ` src="${props.src}"`;
      }
      if (props.alt) {
        attrStr += ` alt="${props.alt}"`;
      }

      if (type === "Image" || type === "img") {
        componentCode += `      <${type}${attrStr} />\n`;
      } else {
        const innerText = content || "";
        componentCode += `      <${type}${attrStr}>${innerText}</${type}>\n`;
      }
    }
    componentCode += `    </div>\n  );\n};\n\nexport default GeneratedComponent;\n`;

    return importLines + componentCode;
  };

  const handleAddWidget = (widgetType: string) => {
    const newWidgets = [...widgets];

    const newWidget: any = {
      id: generateUniqueId(),
      type: widgetType,
      props: { style: {} } as any,
      content: "",
    };
    switch (widgetType) {
      case "ImageSlider":
        newWidget.props.images = ["", "", ""];
        break;

      case "Button":
        newWidget.content = "Sample Button";
        break;
      case "Text":
        newWidget.content = "Sample Text";
        break;
      case "Image":
        newWidget.props.src =
          "data:image/png;base64,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";
        newWidget.props.alt = "Sample Image";
        newWidget.content = "";
        break;
      case "Table":
        newWidget.content = "Sample Table";
        break;
      case "Calendar":
        newWidget.content = "Sample Calendar";
        break;
    }
    newWidgets.push(newWidget);
    setWidgets(newWidgets);

    const newCode = generateCodeFromWidgets(newWidgets);
    setCode(newCode);
  };

  const handleMoveWidget = (fromIndex: number, toIndex: number) => {
    const updatedList = [...widgets];
    const [moved] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, moved);
    setWidgets(updatedList);

    const newCode = generateCodeFromWidgets(updatedList);
    setCode(newCode);
  };

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

  useEffect(() => {
    if (!selectedWidgetId) {
      setIsVisualEditMode(false);
    }
  }, [selectedWidgetId]);

  return (
    <Layout className="editor-layout bg-white dark:bg-neutral-800 h-screen">
      <Toolbar
        isEditMode={isEditMode}
        isVisualEditMode={isVisualEditMode}
        onToggleVisualEditMode={() => setIsVisualEditMode((v) => !v)}
        onToggleMode={() => setIsEditMode((m) => !m)}
        isMobileView={isMobileView}
        onToggleMobileView={() => setIsMobileView((v) => !v)}
      />

      <Layout className="flex flex-row flex-1 overflow-hidden ">
        <Sider
          width={isEditMode ? 0 : leftWidth}
          className="h-full transition-all duration-200 overflow-hidden border-r border-border "
        >
          <WidgetLibrary onAddWidget={handleAddWidget} />
        </Sider>
        {!isEditMode && (
          <div
            onMouseDown={() => (dragging.current = "left")}
            className="w-1 cursor-col-resize bg-border"
          />
        )}

        <Content className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-neutral-800">
          {isEditMode ? (
            <div className="flex flex-col flex-1 p-4">
              {/* Canvas */}
              <div
                className="overflow-auto"
                style={{ height: `${splitRatio * 100}vh` }}
              >
                <Canvas
                  onDrop={handleAddWidget}
                  isMobileView={isMobileView}
                  onMoveWidget={handleMoveWidget}
                  onSelectWidget={handleSelectWidget}
                  setIsVisualEditMode={handleEditMode}
                />
              </div>

              <div
                onMouseDown={() => (dragging.current = "split")}
                className="h-1 bg-border cursor-row-resize"
              />

              <div
                className="overflow-auto"
                style={{ height: `${(1 - splitRatio) * 100}vh` }}
              >
                <CodeEditor
                  ref={monacoRef}
                  code={code}
                  // onCodeChange={(newVal) => {
                  //   setCode(newVal);
                  //   setWidgets(parseWidgetsFromJSX(newVal));
                  // }}
                  onCodeChange={handleCodeChange}
                />
              </div>
            </div>
          ) : (
            <div className="relative flex justify-center items-start overflow-hidden h-full bg-white dark:bg-neutral-800 text-foreground">
              <div
                className={`w-full h-full ${
                  isMobileView
                    ? "max-w-sm border-x border-border shadow-lg bg-background"
                    : ""
                }`}
              >
                <Canvas
                  onDrop={handleAddWidget}
                  isMobileView={isMobileView}
                  onMoveWidget={handleMoveWidget}
                  onSelectWidget={handleSelectWidget}
                  setIsVisualEditMode={handleEditMode}
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
          className="h-full transition-all duration-200 overflow-hidden border-l border-border bg-white dark:bg-neutral-800 "
        >
          {selectedWidgetId && isVisualEditMode ? (
            <VisualEditor />
          ) : (
            <ChatPanel />
          )}
        </Sider>
      </Layout>

      {!isEditMode && <EditorFooter />}
    </Layout>
  );
};

export default EditorPage;
