import React, { useEffect, useRef } from "react";
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
import { useEditor } from "@/context/EditorContext";

const { Text } = Typography;
const { TextArea, Search } = Input;

export interface Widget {
  id: any;
  type: any;
  content: any;
  props: any;
}

export interface CanvasProps {
  onDrop: (widget: any) => void;

  isMobileView: boolean;
  onMoveWidget: (fromIndex: number, toIndex: number) => void;

  onSelectWidget: (id: any) => void;
  setIsVisualEditMode: () => void;
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

  const [{ isDragging }, drag] = useDrag({
    type: "CANVAS_WIDGET",
    item: { index, widgetType: widget.type },
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
  isMobileView,
  onMoveWidget,
  onSelectWidget,
  setIsVisualEditMode,
}) => {
  const { widgets, setWidgets, selectedWidgetId, setSelectedWidgetId } =
    useEditor();

  const [{ isOver }, dropRef] = useDrop({
    accept: "WIDGET",
    drop: (item: any) => {
      // If item has no index, it's from the library palette
      if (item.index === undefined && item.widgetType) {
        onDrop(item.widgetType);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const isDeleteKey = e.key === "Backspace" || e.key === "Delete";

      if (isCmdOrCtrl && isDeleteKey && selectedWidgetId) {
        e.preventDefault();
        const updated = widgets.filter((w) => w.id !== selectedWidgetId);
        setWidgets(updated);
        setSelectedWidgetId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [widgets, selectedWidgetId]);

  const renderWidget = (widget: Widget) => {
    const mobileStyles = isMobileView
      ? { maxWidth: "100%", fontSize: "14px" }
      : {};
    const styleProps = widget.props.style || {};

    switch (widget.type) {
      case "Button2":
        return (
          <Button
            type="dashed"
            style={{
              ...styleProps,
              backgroundColor: "#f9f0ff",
              borderColor: "#9254de",
              color: "#722ed1",
            }}
          >
            {widget.content || "Dashed Button"}
          </Button>
        );

      case "Button3":
        return (
          <Button
            type="link"
            style={{
              ...styleProps,
              fontWeight: "bold",
              fontSize: "16px",
              color: "#1677ff",
            }}
          >
            {widget.content || "Link Button"}
          </Button>
        );

      case "SearchBar2":
        return (
          <div style={styleProps}>
            <Space direction="vertical" style={mobileStyles}>
              <Search
                placeholder={widget.content || "Type and hit Enter..."}
                allowClear
                enterButton="Go"
                style={{
                  width: isMobileView ? "100%" : 300,
                  backgroundColor: "#e6f7ff",
                  borderRadius: 4,
                }}
              />
            </Space>
          </div>
        );

      case "Button":
        return (
          <Button type="primary" style={styleProps}>
            {widget.content || "Button"}
          </Button>
        );

      case "Image": {
        const imgSrc =
          "https://yt3.googleusercontent.com/2eI1TjX447QZFDe6R32K0V2mjbVMKT5mIfQR-wK5bAsxttS_7qzUDS1ojoSKeSP0NuWd6sl7qQ=s900-c-k-c0x00ffffff-no-rj";
        return (
          <img
            src={widget.props.src || imgSrc}
            alt={widget.props.alt || ""}
            className="rounded-lg object-cover"
            style={styleProps}
          />
        );
      }

      case "Text":
        return (
          <Text style={styleProps}>
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
          <div style={styleProps}>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              size="small"
            />
          </div>
        );
      }

      case "Form": {
        const [form] = Form.useForm();
        return (
          <div style={styleProps}>
            {" "}
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
          </div>
        );
      }

      case "Calendar":
        return (
          <div style={styleProps}>
            <Calendar fullscreen={false} />;
          </div>
        );

      case "SearchBar":
        return (
          <div style={styleProps}>
            <Space direction="vertical" style={mobileStyles}>
              <Search
                placeholder={widget.content || "Search..."}
                allowClear
                enterButton
                style={{ width: isMobileView ? "100%" : 300 }}
              />
            </Space>
          </div>
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
          <div style={styleProps}>
            {" "}
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
          </div>
        );
      }

      default:
        const { style, ...restProps } = widget.props || {};

        const Tag = widget.type as keyof JSX.IntrinsicElements;

        return React.createElement(
          Tag,
          { style: styleProps, ...restProps },
          widget.content
        );
    }
  };

  return (
    <div
      ref={dropRef}
      onClick={() => {
        onSelectWidget(null), setIsVisualEditMode;
      }}
      className={`canvas-area ${isMobileView ? "mobile-canvas" : ""}`}
      style={{
        border: "2px dashed #ccc",
        background: isOver ? "#fafafa" : "transparent",
        padding: isMobileView ? 12 : 20,
        minHeight: isMobileView ? 500 : 600,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {widgets.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", padding: 20 }}>
          Drag widgets here to start building your site
        </div>
      ) : (
        widgets?.map((widget, idx) => (
          <SortableWidget
            key={widget?.id}
            widget={widget}
            index={idx}
            moveWidget={onMoveWidget}
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
