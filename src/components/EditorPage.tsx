
import React, { useState, useRef } from 'react';
import { Layout } from 'antd';
import WidgetLibrary from './WidgetLibrary';
import Canvas from './Canvas';
import ChatPanel from './ChatPanel';
import CodeEditor from './CodeEditor';
import Toolbar from './Toolbar';

const { Sider, Content } = Layout;

const EditorPage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [droppedWidgets, setDroppedWidgets] = useState([]);
  const monacoRef = useRef(null);

  const handleDrop = (widget) => {
    const newWidget = {
      id: Date.now(),
      type: widget.type,
      content: widget.content
    };
    
    const updatedWidgets = [...droppedWidgets, newWidget];
    setDroppedWidgets(updatedWidgets);
    
    // Update Monaco editor if in edit mode
    if (isEditMode && monacoRef.current) {
      const jsxCode = generateJSXFromWidgets(updatedWidgets);
      monacoRef.current.setValue(jsxCode);
    }
  };

  const generateJSXFromWidgets = (widgets) => {
    const widgetComponents = widgets.map(widget => {
      switch (widget.type) {
        case 'Button':
          return `  <Button type="primary">${widget.content}</Button>`;
        case 'Image':
          return `  <img src="placeholder.jpg" alt="${widget.content}" style={{ width: '200px', height: '150px', objectFit: 'cover' }} />`;
        case 'Text':
          return `  <p>${widget.content}</p>`;
        case 'Table':
          return `  <Table dataSource={[]} columns={[]} />`;
        case 'Form':
          return `  <Form layout="vertical">
    <Form.Item label="Sample Field">
      <Input placeholder="Enter value" />
    </Form.Item>
  </Form>`;
        case 'Calendar':
          return `  <Calendar />`;
        default:
          return `  <div>${widget.content}</div>`;
      }
    }).join('\n');

    return `import React from 'react';
import { Button, Table, Form, Input, Calendar } from 'antd';

const GeneratedComponent = () => {
  return (
    <div style={{ padding: '20px' }}>
${widgetComponents}
    </div>
  );
};

export default GeneratedComponent;`;
  };

  const toggleMode = (checked) => {
    setIsEditMode(checked);
    if (checked && monacoRef.current) {
      const jsxCode = generateJSXFromWidgets(droppedWidgets);
      monacoRef.current.setValue(jsxCode);
    }
  };

  const toggleMobileView = () => {
    setIsMobileView(!isMobileView);
  };

  const siderWidth = isEditMode ? 0 : 300;
  const canvasHeight = isEditMode ? '50vh' : 'calc(100vh - 120px)';

  return (
    <Layout className="editor-layout min-h-screen">
      <Toolbar 
        isEditMode={isEditMode}
        onToggleMode={toggleMode}
        isMobileView={isMobileView}
        onToggleMobileView={toggleMobileView}
      />
      
      <Layout className="flex-1">
        <Sider
          width={siderWidth}
          style={{
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            background: '#fafafa'
          }}
          className="border-r border-border"
        >
          <WidgetLibrary />
        </Sider>
        
        <Content 
          style={{ 
            height: canvasHeight,
            transition: 'all 0.3s ease'
          }}
          className="relative"
        >
          <div className={`transition-all duration-300 mx-auto ${
            isMobileView 
              ? 'max-w-sm border-x border-border shadow-lg' 
              : 'w-full'
          }`}>
            <Canvas onDrop={handleDrop} droppedWidgets={droppedWidgets} isMobileView={isMobileView} />
          </div>
        </Content>
        
        <Sider
          width={siderWidth}
          style={{
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            background: '#fafafa'
          }}
          className="border-l border-border"
        >
          <ChatPanel />
        </Sider>
      </Layout>
      
      {isEditMode && (
        <div className="code-editor-container border-t border-border">
          <CodeEditor ref={monacoRef} />
        </div>
      )}
    </Layout>
  );
};

export default EditorPage;
