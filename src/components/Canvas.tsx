
import React from 'react';
import { useDrop } from 'react-dnd';
import { Button, Typography } from 'antd';

const { Text } = Typography;

const Canvas = ({ onDrop, droppedWidgets, isMobileView }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'widget',
    drop: (item) => {
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const renderWidget = (widget) => {
    const mobileStyles = isMobileView ? { maxWidth: '100%', fontSize: '14px' } : {};
    
    switch (widget.type) {
      case 'Button':
        return (
          <Button 
            type="primary" 
            key={widget.id}
            size={isMobileView ? 'small' : 'middle'}
            style={mobileStyles}
          >
            {widget.content}
          </Button>
        );
      case 'Image':
        return (
          <img
            key={widget.id}
            src="/placeholder.svg"
            alt={widget.content}
            style={{ 
              width: isMobileView ? '100%' : '200px', 
              height: isMobileView ? 'auto' : '150px', 
              maxWidth: isMobileView ? '280px' : '200px',
              objectFit: 'cover', 
              borderRadius: '8px' 
            }}
          />
        );
      case 'Text':
        return (
          <Text 
            key={widget.id} 
            style={{ 
              display: 'block', 
              fontSize: isMobileView ? '14px' : '16px',
              lineHeight: isMobileView ? '1.4' : '1.6',
              ...mobileStyles
            }}
          >
            {widget.content}
          </Text>
        );
      case 'Table':
        return (
          <div key={widget.id} style={{ 
            ...mobileStyles,
            overflow: 'auto',
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            padding: '12px'
          }}>
            <Text style={{ fontSize: isMobileView ? '12px' : '14px' }}>Sample Table Component</Text>
          </div>
        );
      case 'Form':
        return (
          <div key={widget.id} style={{ 
            ...mobileStyles,
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            padding: '16px'
          }}>
            <Text style={{ fontSize: isMobileView ? '12px' : '14px' }}>Sample Form Component</Text>
          </div>
        );
      case 'Calendar':
        return (
          <div key={widget.id} style={{ 
            ...mobileStyles,
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            padding: '12px'
          }}>
            <Text style={{ fontSize: isMobileView ? '12px' : '14px' }}>Sample Calendar Component</Text>
          </div>
        );
      default:
        return (
          <div key={widget.id} style={{ 
            padding: '8px', 
            background: '#f5f5f5', 
            borderRadius: '4px',
            ...mobileStyles
          }}>
            {widget.content}
          </div>
        );
    }
  };

  return (
    <div className={`canvas-area ${isMobileView ? 'mobile-canvas' : ''}`}>
      <div
        ref={drop}
        className={`drop-zone ${isOver ? 'drag-over' : ''}`}
        style={{
          minHeight: isMobileView ? '500px' : '400px',
          margin: isMobileView ? '10px' : '20px',
          padding: isMobileView ? '12px' : '20px'
        }}
      >
        {droppedWidgets.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: isMobileView ? '30px 20px' : '40px', 
            color: '#8c8c8c' 
          }}>
            <Text style={{ fontSize: isMobileView ? '14px' : '16px' }}>
              Drag widgets here to start building your website
            </Text>
          </div>
        ) : (
          droppedWidgets.map((widget) => (
            <div 
              key={widget.id} 
              className="dropped-widget"
              style={{
                margin: isMobileView ? '8px 0' : '10px 0',
                padding: isMobileView ? '8px' : '12px'
              }}
            >
              {renderWidget(widget)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Canvas;
