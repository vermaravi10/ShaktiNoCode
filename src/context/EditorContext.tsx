import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import parseWidgetsFromJSX from "@/components/utils/parseWidgets";

export type Widget = {
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

type EditorContextType = {
  code: string;
  setCode: (code: string) => void;
  widgets: any;
  setWidgets: (widgets: any) => void;
  selectedWidgetId: string | null;
  setSelectedWidgetId: (id: string | null) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  isEditMode: boolean;
  setIsEditMode: (val: any) => void;
  isVisualEditMode: boolean;
  setIsVisualEditMode: (val: any) => void;
};

const EditorContext = createContext<EditorContextType | null>(null);

const STORAGE_KEY = "editor-full-state";

const defaultCode = `import React from 'react';
import { Button } from 'antd';

const GeneratedComponent = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Button>Click me</Button>
    </div>
  );
};

export default GeneratedComponent;`;

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [code, setCode] = useState<string>(defaultCode);
  const [widgets, setWidgets] = useState<any>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [zoom, setZoom] = useState<number>(1);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isVisualEditMode, setIsVisualEditMode] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCode(parsed.code ?? defaultCode);
        setWidgets(parsed.widgets ?? []);
        setSelectedWidgetId(parsed.selectedWidgetId ?? null);
        setTheme(parsed.theme ?? "light");
        setZoom(parsed.zoom ?? 1);
        setIsEditMode(parsed.isEditMode ?? false);
        setIsVisualEditMode(parsed.isVisualEditMode ?? false);
      } catch (err) {
        console.error("Failed to parse editor state:", err);
      }
    } else {
      setWidgets(parseWidgetsFromJSX(defaultCode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        code,
        widgets,
        selectedWidgetId,
        theme,
        zoom,
        isEditMode,
        isVisualEditMode,
      })
    );
  }, [
    code,
    widgets,
    selectedWidgetId,
    theme,
    zoom,
    isEditMode,
    isVisualEditMode,
  ]);

  return (
    <EditorContext.Provider
      value={{
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
