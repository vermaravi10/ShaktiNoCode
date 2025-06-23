// src/Canvas.tsx
import React, { useRef } from "react";
import {
  useDrop,
  useDrag,
  DragSourceMonitor,
  DropTargetMonitor,
} from "react-dnd";
import {
  Button,
  Typography,
  Table,
  Form,
  Input,
  Calendar,
  Carousel,
  Space,
} from "antd";

const { Text } = Typography;
const { TextArea, Search } = Input;

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

      const { top, bottom } = ref.current.getBoundingClientRect();
      const hoverMiddleY = (bottom - top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - top;

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
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        resize: "both",
        overflow: "auto",
        minWidth: 100,
        minHeight: 50,
        margin: "8px 0",
        border: selected ? "2px solid #1890ff" : "1px solid #ddd",
        borderRadius: 4,
        padding: 8,
        background: selected ? "#e6f7ff" : "#fff",
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
            {widget.content || "Button"}
          </Button>
        );

      case "Image": {
        const imgSrc = widget.content.startsWith("http")
          ? widget.content
          : "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_hybrid&w=740";
        return (
          <img
            src={imgSrc}
            alt={widget.content}
            className="rounded-lg object-cover"
            style={{
              ...mobileStyles,
              width: isMobileView ? "100%" : 200,
              height: isMobileView ? "auto" : 150,
            }}
          />
        );
      }

      case "Text":
        return (
          <Text style={mobileStyles}>
            {widget.content || "Sample text content"}
          </Text>
        );

      case "Table": {
        const columns = [
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Age", dataIndex: "age", key: "age" },
          { title: "Country", dataIndex: "country", key: "country" },
        ];
        const dataSource = [
          { key: 1, name: "Alice", age: 28, country: "UK" },
          { key: 2, name: "Bob", age: 34, country: "USA" },
          { key: 3, name: "Charlie", age: 22, country: "Australia" },
        ];
        return (
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            size="small"
          />
        );
      }

      case "Form": {
        const [form] = Form.useForm();
        return (
          <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: 400 }}
            onFinish={(vals) => console.log("Form submitted:", vals)}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: "email", message: "Invalid email" }]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item label="Comments" name="comments">
              <TextArea rows={3} placeholder="Enter comments" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        );
      }

      case "Calendar":
        return <Calendar fullscreen={false} />;

      case "SearchBar":
        return (
          <Space direction="vertical" style={mobileStyles}>
            <Search
              placeholder={widget.content || "Search..."}
              allowClear
              enterButton
              style={{ width: isMobileView ? "100%" : 300 }}
            />
          </Space>
        );

      case "ImageSlider": {
        const urls = widget.content
          .split(",")
          .map((u) => u.trim())
          .filter((u) => u.startsWith("http"));
        const slides =
          urls.length > 0
            ? urls
            : [
                "https://media.istockphoto.com/id/1481862788/photo/stack-of-books-with-blurred-bookshelf-background-reading-learning-education-or-home-office.jpg?s=612x612&w=0&k=20&c=HA0Xbmj0D6Gs08NFJAmo_L84qMODnQgD1xOi9vrdBqo=",
                "https://www.shutterstock.com/image-photo/book-open-pages-close-up-600nw-2562942291.jpg",
                "https://dq5pwpg1q8ru0.cloudfront.net/2024/06/11/23/32/19/f436ae76-3659-4edc-a434-ba10bd875d97/99302-1.jfif",
              ];

        return (
          <Carousel autoplay dotPosition="bottom" style={{ maxWidth: 300 }}>
            {slides.map((src, idx) => (
              <div
                key={idx}
                className="h-40 flex justify-center items-center bg-gray-100"
              >
                <img
                  src={src}
                  alt={`slide-${idx}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </Carousel>
        );
      }

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
      {droppedWidgets.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", padding: 20 }}>
          Drag widgets here to start building your site
        </div>
      ) : (
        droppedWidgets.map((widget, idx) => (
          <SortableWidget
            key={widget.id}
            widget={widget}
            index={idx}
            moveWidget={moveWidget}
            renderWidget={renderWidget}
            selected={widget.id === selectedWidgetId}
            onSelect={() => onSelectWidget(widget.id)}
          />
        ))
      )}
    </div>
  );
};

export default Canvas;
