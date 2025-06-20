import React, { useRef } from "react";
import {
  useDrop,
  useDrag,
  DragSourceMonitor,
  DropTargetMonitor,
} from "react-dnd";
import { Button, Typography, Table, Form, Input, Calendar } from "antd";

const { Text } = Typography;

export interface Widget {
  id: number;
  type: string;
  content: string;
}

export interface CanvasProps {
  onDrop: (widget: any) => void;
  droppedWidgets: Widget[];
  isMobileView: boolean;
  moveWidget: (fromIndex: number, toIndex: number) => void;
  selectedWidgetId: number | null;
  onSelectWidget: (id: number) => void;
}

const SortableWidget: React.FC<{
  widget: Widget;
  index: number;
  moveWidget: (from: number, to: number) => void;
  renderWidget: (widget: Widget) => React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}> = ({ widget, index, moveWidget, renderWidget, selected, onSelect }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Reordering drop target
  const [, drop] = useDrop({
    accept: "CANVAS_WIDGET",
    hover(item: { index: number }, monitor: DropTargetMonitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverRect.top;

      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      ) {
        return;
      }

      moveWidget(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Drag source
  const [{ isDragging }, drag] = useDrag({
    type: "CANVAS_WIDGET",
    item: { index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className="dropped-widget"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        resize: "both",
        overflow: "auto",
        minWidth: 50,
        minHeight: 30,
        margin: "8px 0",
        border: selected ? "2px solid #1890ff" : "1px solid #ddd",
        borderRadius: 4,
        padding: 8,
        background: selected ? "#e6f7ff" : undefined,
      }}
    >
      {renderWidget(widget)}
    </div>
  );
};

const Canvas: React.FC<CanvasProps> = ({
  onDrop,
  droppedWidgets,
  isMobileView,
  moveWidget,
  selectedWidgetId,
  onSelectWidget,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "widget",
    drop: (item: any) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const renderWidget = (widget: Widget) => {
    const mobileStyles = isMobileView
      ? { maxWidth: "100%", fontSize: "14px" }
      : {};

    switch (widget.type) {
      case "Button":
        return (
          <Button type="primary" style={mobileStyles}>
            {widget.content}
          </Button>
        );
      case "Image":
        return (
          <img
            src="/placeholder.svg"
            alt={widget.content}
            className="rounded-lg object-cover"
            style={{
              ...mobileStyles,
              width: isMobileView ? "100%" : "200px",
              height: isMobileView ? "auto" : "150px",
            }}
          />
        );
      case "Text":
        return <Text style={mobileStyles}>{widget.content}</Text>;
      case "Table":
        return <Table dataSource={[]} columns={[]} pagination={false} />;
      case "Form":
        return (
          <Form layout="vertical">
            <Form.Item label="Field">
              <Input placeholder={widget.content} />
            </Form.Item>
          </Form>
        );
      case "Calendar":
        return <Calendar fullscreen={false} />;
      default:
        return <div style={mobileStyles}>{widget.content}</div>;
    }
  };

  return (
    <div
      ref={drop}
      onClick={() => onSelectWidget(null)}
      className={`canvas-area ${isMobileView ? "mobile-canvas" : ""}`}
      style={{
        border: "2px dashed #ccc",
        background: isOver ? "#fafafa" : "transparent",
        padding: isMobileView ? 12 : 20,
        minHeight: isMobileView ? 500 : 600,
        overflow: "auto",
      }}
    >
      {droppedWidgets?.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", padding: 20 }}>
          Drag widgets here to start building your site
        </div>
      ) : (
        droppedWidgets?.map((widget, idx) => (
          <SortableWidget
            key={widget.id}
            widget={widget}
            index={idx}
            moveWidget={moveWidget}
            renderWidget={renderWidget}
            selected={widget?.id === selectedWidgetId}
            onSelect={() => onSelectWidget(widget?.id)}
          />
        ))
      )}
    </div>
  );
};

export default Canvas;
