import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import parseWidgetsFromJSX from "@/components/utils/parseWidgets";

export type Widget = {
  y: number;
  x: number;
  id: string;
  type: string;
  props: {
    style?: Record<string, any>;
    src?: string;
    alt?: string;
    images?: string[];
    [key: string]: any;
  };
  content: string;
};

export interface HistoryEntry {
  widgets: Widget[];
  code: string;
}

type EditorContextType = {
  showChat: boolean;
  setShowChat: (val: boolean) => void;
  tab: string;
  code: string;
  setCode: (code: string) => void;
  widgets: Widget[];
  setWidgets: (widgets: any) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedWidgetId: string | null;
  setSelectedWidgetId: (id: string | null) => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  setTab: (val: string) => void;
  isEditMode: boolean;
  setIsEditMode: (val: any) => void;
  isVisualEditMode: any;
  setIsVisualEditMode: (val: any) => void;
  reset: () => void;
};

const EditorContext = createContext<EditorContextType | null>(null);
const STORAGE_KEY = "editor-full-state";

const defaultCode = `import React from 'react';
import { Button } from 'antd';

const GeneratedComponent = () => {
  return (
    <div style={{ padding: '20px' }}>
      
    </div>
  );
};

export default GeneratedComponent;`;

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [showChat, setShowChat] = useState(true);
  const [tab, setTab] = useState("code");
  const [history, setHistory] = useState<any[]>([]);
  const [pointer, setPointer] = useState<number>(-1);
  const [codeRaw, setCodeRaw] = useState<string>(defaultCode);
  const [widgetsRaw, setWidgetsRaw] = useState<any[]>(() =>
    parseWidgetsFromJSX(defaultCode)
  );
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  console.log("🚀 ~ EditorProvider ~ theme:", theme);
  const [zoom, setZoom] = useState<number>(1);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isVisualEditMode, setIsVisualEditMode] = useState<boolean>(false);

  const record = useCallback(
    (newWidgets: Widget[], newCode: string) => {
      const next = history.slice(0, pointer + 1);
      next.push({ widgets: newWidgets, code: newCode });
      setHistory(next);
      setPointer(next.length - 1);
    },
    [history, pointer]
  );

  const setWidgets = (newWidgets: Widget[]) => {
    setWidgetsRaw(newWidgets);
    record(newWidgets, codeRaw);
  };

  const setCode = (newCode: string) => {
    setCodeRaw(newCode);
    record(widgetsRaw, newCode);
  };

  const undo = () => {
    if (pointer <= 0) return;
    const prev = history[pointer - 1];
    setPointer(pointer - 1);
    setWidgetsRaw(prev.widgets);
    setCodeRaw(prev.code);
  };
  const redo = () => {
    if (pointer >= history.length - 1) return;
    const nextEntry = history[pointer + 1];
    setPointer(pointer + 1);
    setWidgetsRaw(nextEntry.widgets);
    setCodeRaw(nextEntry.code);
  };

  const canUndo = pointer > 0;
  const canRedo = pointer < history.length - 1;

  const reset = () => {
    setCodeRaw(defaultCode);
    setWidgetsRaw(parseWidgetsFromJSX(defaultCode));
    setSelectedWidgetId(null);
    setTheme("dark");
    setZoom(1);
    setIsEditMode(false);
    setIsVisualEditMode(false);

    setHistory([
      { widgets: parseWidgetsFromJSX(defaultCode), code: defaultCode },
    ]);
    setPointer(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        setCodeRaw(parsed.code ?? defaultCode);
        setWidgetsRaw(parsed.widgets ?? parseWidgetsFromJSX(defaultCode));
        setSelectedWidgetId(parsed.selectedWidgetId ?? null);
        setTheme(parsed.theme ?? "dark");
        setZoom(parsed.zoom ?? 1);
        setIsEditMode(parsed.isEditMode ?? false);
        setIsVisualEditMode(parsed.isVisualEditMode ?? false);

        if (parsed.history && Array.isArray(parsed.history)) {
          setHistory(parsed.history);
          setPointer(
            typeof parsed.pointer === "number"
              ? parsed.pointer
              : parsed.history.length - 1
          );
        } else {
          const initial = {
            widgets: parsed.widgets ?? parseWidgetsFromJSX(defaultCode),
            code: parsed.code ?? defaultCode,
          };
          setHistory([initial]);
          setPointer(0);
        }
      } catch {
        console.error("Failed to restore editor state");
      }
    } else {
      const initial = {
        widgets: parseWidgetsFromJSX(defaultCode),
        code: defaultCode,
      };
      setHistory([initial]);
      setPointer(0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        code: codeRaw,
        widgets: widgetsRaw,
        selectedWidgetId,
        theme,
        zoom,
        isEditMode,
        isVisualEditMode,
        history,
        pointer,
      })
    );
  }, [
    codeRaw,
    widgetsRaw,
    selectedWidgetId,
    theme,
    zoom,
    isEditMode,
    isVisualEditMode,
    history,
    pointer,
  ]);

  return (
    <EditorContext.Provider
      value={{
        code: codeRaw,
        setCode,
        widgets: widgetsRaw,
        setWidgets,
        undo,
        redo,
        canUndo,
        canRedo,
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
        reset,
        tab,
        setTab,
        showChat,
        setShowChat,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
};
