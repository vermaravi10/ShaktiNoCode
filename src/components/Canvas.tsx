
import React from 'react';
import { useDrop } from 'react-dnd';
import { Button, Typography } from 'antd';

const { Text } = Typography;

const Canvas = ({ onDrop, droppedWidgets }) => {
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
    switch (widget.type) {
      case 'Button':
        return (
          <Button type="primary" key={widget.id}>
            {widget.content}
          </Button>
        );
      case 'Image':
        return (
          <img
            key={widget.id}
            src="/placeholder.svg"
            alt={widget.content}
            style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
          />
        );
      case 'Text':
        return (
          <Text key={widget.id} style={{ display: 'block', fontSize: '16px' }}>
            {widget.content}
          </Text>
        );
      default:
        return (
          <div key={widget.id} style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
            {widget.content}
          </div>
        );
    }
  };

  return (
    <div className="canvas-area">
      <div
        ref={drop}
        className={`drop-zone ${isOver ? 'drag-over' : ''}`}
      >
        {droppedWidgets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>
            <Text>Drag widgets here to start building your website</Text>
          </div>
        ) : (
          droppedWidgets.map((widget) => (
            <div key={widget.id} className="dropped-widget">
              {renderWidget(widget)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Canvas;
