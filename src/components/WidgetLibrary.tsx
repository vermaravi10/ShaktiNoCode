
import React, { useState, useMemo } from 'react';
import { Input, Card, Typography } from 'antd';
import { useDrag } from 'react-dnd';
import { SearchOutlined, BorderOutlined, FileImageOutlined, FontSizeOutlined, TableOutlined, FormOutlined, CalendarOutlined } from '@ant-design/icons';

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
        cursor: 'grab',
        marginBottom: '8px'
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
  const [searchTerm, setSearchTerm] = useState('');

  const allWidgets = [
    { type: 'Button', icon: <BorderOutlined />, label: 'Button', category: 'Basic' },
    { type: 'Image', icon: <FileImageOutlined />, label: 'Image', category: 'Media' },
    { type: 'Text', icon: <FontSizeOutlined />, label: 'Text', category: 'Basic' },
    { type: 'Table', icon: <TableOutlined />, label: 'Table', category: 'Data' },
    { type: 'Form', icon: <FormOutlined />, label: 'Form', category: 'Input' },
    { type: 'Calendar', icon: <CalendarOutlined />, label: 'Calendar', category: 'Data' },
  ];

  const filteredWidgets = useMemo(() => {
    if (!searchTerm.trim()) {
      return allWidgets;
    }
    return allWidgets.filter(widget =>
      widget.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      widget.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const groupedWidgets = useMemo(() => {
    const grouped = filteredWidgets.reduce((acc, widget) => {
      if (!acc[widget.category]) {
        acc[widget.category] = [];
      }
      acc[widget.category].push(widget);
      return acc;
    }, {});
    return grouped;
  }, [filteredWidgets]);

  return (
    <div className="widget-library" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
        <Search
          placeholder="Search widgets..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {Object.keys(groupedWidgets).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            <Text type="secondary">No widgets found matching "{searchTerm}"</Text>
          </div>
        ) : (
          Object.entries(groupedWidgets).map(([category, widgets]) => (
            <div key={category} style={{ marginBottom: '20px' }}>
              <Text strong style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {category}
              </Text>
              <div style={{ marginTop: '8px' }}>
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
          ))
        )}
      </div>
    </div>
  );
};

export default WidgetLibrary;
