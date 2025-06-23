// src/WidgetLibrary.tsx
import React, { useState, useMemo } from "react";
import { Input, Typography } from "antd";
import { useDrag } from "react-dnd";
import {
  SearchOutlined,
  BorderOutlined,
  FileImageOutlined,
  FontSizeOutlined,
  TableOutlined,
  FormOutlined,
  CalendarOutlined,
  SlidersOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { Text } = Typography;

interface WidgetDef {
  type: string;
  icon: React.ReactNode;
  label: string;
  category: string;
}

const DraggableWidget: React.FC<WidgetDef> = ({ type, icon, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "widget",
    item: { type, content: `Sample ${type}` },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="mb-2 rounded border border-border p-2 cursor-grab hover:bg-muted transition"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex items-center gap-2 text-foreground">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
};

const WidgetLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const allWidgets: WidgetDef[] = [
    {
      type: "Button",
      icon: <BorderOutlined />,
      label: "Button",
      category: "Basic",
    },
    {
      type: "Image",
      icon: <FileImageOutlined />,
      label: "Image",
      category: "Media",
    },
    {
      type: "Text",
      icon: <FontSizeOutlined />,
      label: "Text",
      category: "Basic",
    },
    {
      type: "Table",
      icon: <TableOutlined />,
      label: "Table",
      category: "Data",
    },
    { type: "Form", icon: <FormOutlined />, label: "Form", category: "Input" },
    {
      type: "Calendar",
      icon: <CalendarOutlined />,
      label: "Calendar",
      category: "Data",
    },
    {
      type: "SearchBar",
      icon: <SearchOutlined />,
      label: "Search Bar",
      category: "Input",
    },
    {
      type: "ImageSlider",
      icon: <SlidersOutlined />,
      label: "Image Slider",
      category: "Media",
    },
  ];

  const filteredWidgets = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();

    // Hide SearchBar & ImageSlider when search is empty
    const base = lower
      ? allWidgets
      : allWidgets.filter(
          (w) => w.type !== "SearchBar" && w.type !== "ImageSlider"
        );

    // If there's a search term, further filter by label or category
    return lower
      ? base.filter(
          (w) =>
            w.label.toLowerCase().includes(lower) ||
            w.category.toLowerCase().includes(lower)
        )
      : base;
  }, [searchTerm]);

  const groupedWidgets = useMemo(() => {
    return filteredWidgets.reduce<Record<string, WidgetDef[]>>((acc, w) => {
      (acc[w.category] = acc[w.category] || []).push(w);
      return acc;
    }, {});
  }, [filteredWidgets]);

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Search Input */}
      <div className="border-b border-border px-4 py-3">
        <Search
          placeholder="Search widgets..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </div>

      {/* Widget List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {Object.keys(groupedWidgets).length === 0 ? (
          <div className="text-muted-foreground text-sm text-center p-5">
            No widgets found matching "{searchTerm}"
          </div>
        ) : (
          Object.entries(groupedWidgets).map(([category, widgets]) => (
            <div key={category} className="mb-6">
              <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                {category}
              </div>
              <div className="space-y-2">
                {widgets.map((widget) => (
                  <DraggableWidget
                    key={widget.type}
                    type={widget.type}
                    icon={widget.icon}
                    label={widget.label}
                    category={widget.category}
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
