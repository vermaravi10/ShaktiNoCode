import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Editor, { OnChange, OnMount } from "@monaco-editor/react";

export interface CodeEditorProps {
  code: string;
  onCodeChange: (newValue: string) => void;
}

const CodeEditor = forwardRef<any, CodeEditorProps>(
  ({ code, onCodeChange }, ref) => {
    const editorRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      setValue: (value: string) => editorRef.current?.setValue(value),
      getValue: () => editorRef.current?.getValue() || "",
    }));

    const handleEditorDidMount: OnMount = (editor) => {
      editorRef.current = editor;
    };

    const handleChange: OnChange = (value) => {
      if (value !== undefined) onCodeChange(value);
    };

    return (
      <div style={{ height: "100%", background: "#1e293b" }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={handleChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
          }}
        />
      </div>
    );
  }
);
CodeEditor.displayName = "CodeEditor";
export default CodeEditor;
