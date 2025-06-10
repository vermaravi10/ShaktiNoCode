
import React from 'react';
import { Input, Card, Typography } from 'antd';
import { useDrag } from 'react-dnd';
import { SearchOutlined, BorderOutlined, FileImageOutlined, FontSizeOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Text } = Typography;

const DraggableWidget = ({ type, icon, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'widget',
    item: { type, content: `Sample ${type}` },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Card
      ref={drag}
      className="widget-card"
      size="small"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon}
        <Text>{label}</Text>
      </div>
    </Card>
  );
};

const WidgetLibrary = () => {
  const widgets = [
    { type: 'Button', icon: <BorderOutlined />, label: 'Button' },
    { type: 'Image', icon: <FileImageOutlined />, label: 'Image' },
    { type: 'Text', icon: <FontSizeOutlined />, label: 'Text' },
  ];

  return (
    <div className="widget-library">
      <Search
        placeholder="Search widgets..."
        prefix={<SearchOutlined />}
        style={{ marginBottom: '16px' }}
      />
      
      <div>
        {widgets.map((widget) => (
          <DraggableWidget
            key={widget.type}
            type={widget.type}
            icon={widget.icon}
            label={widget.label}
          />
        ))}
      </div>
    </div>
  );
};

export default WidgetLibrary;
