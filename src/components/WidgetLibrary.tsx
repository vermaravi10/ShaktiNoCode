import React, { useState, useMemo } from "react";
import { Input } from "antd";
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

interface WidgetDef {
  type: string;
  icon: React.ReactNode;
  label: string;
  category: string;
  visibleByDefault?: boolean;
}

interface DraggableWidgetProps extends WidgetDef {
  onClick?: (type: string) => void;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  type,
  icon,
  label,
  onClick,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "WIDGET",
    item: { widgetType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      onClick={() => onClick?.(type)}
      className="mb-2 rounded border border-border p-2 cursor-pointer hover:bg-muted transition"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex items-center gap-2 text-foreground">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
};

interface WidgetLibraryProps {
  onAddWidget: (type: string) => void;
}

const WidgetLibrary: React.FC<WidgetLibraryProps> = ({ onAddWidget }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const allWidgets: WidgetDef[] = [
    {
      type: "Button",
      icon: <BorderOutlined />,
      label: "Button",
      category: "Basic",
      visibleByDefault: true,
    },
    {
      type: "Button2",
      icon: <BorderOutlined />,
      label: "Button Variant 2",
      category: "Basic",
      visibleByDefault: false,
    },
    {
      type: "Button3",
      icon: <BorderOutlined />,
      label: "Button Variant 3",
      category: "Basic",
      visibleByDefault: false,
    },
    {
      type: "Image",
      icon: <FileImageOutlined />,
      label: "Image",
      category: "Media",
      visibleByDefault: true,
    },
    {
      type: "Text",
      icon: <FontSizeOutlined />,
      label: "Text",
      category: "Basic",
      visibleByDefault: true,
    },
    {
      type: "Table",
      icon: <TableOutlined />,
      label: "Table",
      category: "Data",
      visibleByDefault: true,
    },
    {
      type: "Form",
      icon: <FormOutlined />,
      label: "Form",
      category: "Input",
      visibleByDefault: true,
    },
    {
      type: "Calendar",
      icon: <CalendarOutlined />,
      label: "Calendar",
      category: "Data",
      visibleByDefault: true,
    },
    {
      type: "SearchBar",
      icon: <SearchOutlined />,
      label: "Search Bar",
      category: "Input",
      visibleByDefault: true,
    },
    {
      type: "SearchBar2",
      icon: <SearchOutlined />,
      label: "Search Bar Variant 2",
      category: "Input",
      visibleByDefault: false,
    },
    {
      type: "ImageSlider",
      icon: <SlidersOutlined />,
      label: "Image Slider",
      category: "Media",
      visibleByDefault: true,
    },
  ];

  const filteredWidgets = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();
    return allWidgets.filter(
      (w) =>
        w.label.toLowerCase().includes(lower) ||
        w.category.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  const groupedWidgets = useMemo(() => {
    return filteredWidgets.reduce<Record<string, WidgetDef[]>>((acc, w) => {
      acc[w.category] = acc[w.category] || [];
      acc[w.category].push(w);
      return acc;
    }, {});
  }, [filteredWidgets]);

  const toggleExpanded = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="flex flex-col h-full text-foreground bg-white dark:bg-neutral-800">
      <div className="border-b border-border px-4 py-3">
        <Search
          placeholder="Search widgets..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {Object.keys(groupedWidgets).length === 0 ? (
          <div className="text-muted-foreground text-sm text-center p-5">
            No widgets found matching "{searchTerm}"
          </div>
        ) : (
          Object.entries(groupedWidgets).map(([category, widgets]) => {
            const visible = widgets.filter((w) => w.visibleByDefault);
            const hidden = widgets.filter((w) => !w.visibleByDefault);
            const isExpanded = expandedCategories[category];

            return (
              <div key={category} className="mb-6">
                <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                  {category}
                </div>
                <div className="space-y-2">
                  {visible.map((widget) => (
                    <DraggableWidget
                      key={widget.type}
                      {...widget}
                      onClick={onAddWidget}
                    />
                  ))}

                  {hidden.length > 0 && (
                    <>
                      <div
                        className="text-xs cursor-pointer text-blue-500 hover:underline"
                        onClick={() => toggleExpanded(category)}
                      >
                        {isExpanded ? "Hide variants" : "Show more variants"}
                      </div>
                      {isExpanded &&
                        hidden.map((widget) => (
                          <DraggableWidget
                            key={widget.type}
                            {...widget}
                            onClick={onAddWidget}
                          />
                        ))}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WidgetLibrary;
