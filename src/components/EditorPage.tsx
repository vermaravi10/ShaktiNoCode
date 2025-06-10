
import React, { useState, useRef } from 'react';
import { Layout, Switch, Typography } from 'antd';
import WidgetLibrary from './WidgetLibrary';
import Canvas from './Canvas';
import ChatPanel from './ChatPanel';
import CodeEditor from './CodeEditor';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const EditorPage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
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
        default:
          return `  <div>${widget.content}</div>`;
      }
    }).join('\n');

    return `import React from 'react';
import { Button } from 'antd';

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

  const siderWidth = isEditMode ? 0 : 300;
  const canvasHeight = isEditMode ? '50vh' : 'calc(100vh - 64px)';

  return (
    <Layout className="editor-layout">
      <Header className="editor-header">
        <div className="mode-toggle">
          <Text strong>Edit Mode</Text>
          <Switch checked={isEditMode} onChange={toggleMode} />
        </div>
      </Header>
      
      <Layout>
        <Sider
          width={siderWidth}
          style={{
            transition: 'width 0.3s ease',
            overflow: 'hidden'
          }}
        >
          <WidgetLibrary />
        </Sider>
        
        <Content style={{ height: canvasHeight }}>
          <Canvas onDrop={handleDrop} droppedWidgets={droppedWidgets} />
        </Content>
        
        <Sider
          width={siderWidth}
          style={{
            transition: 'width 0.3s ease',
            overflow: 'hidden'
          }}
        >
          <ChatPanel />
        </Sider>
      </Layout>
      
      {isEditMode && (
        <div className="code-editor-container">
          <CodeEditor ref={monacoRef} />
        </div>
      )}
    </Layout>
  );
};

export default EditorPage;
