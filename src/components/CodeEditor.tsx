
import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = forwardRef((props, ref) => {
  const editorRef = useRef(null);

  useImperativeHandle(ref, () => ({
    setValue: (value) => {
      if (editorRef.current) {
        editorRef.current.setValue(value);
      }
    },
    getValue: () => {
      if (editorRef.current) {
        return editorRef.current.getValue();
      }
      return '';
    }
  }));

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const initialCode = `import React from 'react';
import { Button } from 'antd';

const GeneratedComponent = () => {
  return (
    <div style={{ padding: '20px' }}>
      {/* Your generated components will appear here */}
    </div>
  );
};

export default GeneratedComponent;`;

  return (
    <div style={{ height: '100%', background: '#1e293b' }}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={initialCode}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
        }}
      />
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;
