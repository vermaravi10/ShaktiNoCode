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
  onDrop: (widgetType: string, x?: number, y?: number) => void;
  isMobileView: boolean;
  onSelectWidget: (id: any) => void;
  setIsVisualEditMode: () => void;
}

const SortableWidget: React.FC<{
  widget: Widget;
  index: number;
  renderWidget: (widget: Widget) => React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}> = ({ widget, index, renderWidget, selected, onSelect }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "CANVAS_WIDGET",
    item: () => {
      const rect = ref.current?.getBoundingClientRect();
      return {
        id: widget.id,
        widgetType: widget.type,
        index,
        left: widget.props.style?.left || 0,
        top: widget.props.style?.top || 0,
        width: rect?.width ?? widget.props.style?.width ?? 100,
        height: rect?.height ?? widget.props.style?.height ?? 50,
      };
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(ref);

  const { setWidgets } = useEditor();
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === element) {
          const newWidth = Math.round(entry.contentRect.width);
          const newHeight = Math.round(entry.contentRect.height);
          setWidgets((prevWidgets) =>
            prevWidgets.map((w) =>
              w.id === widget.id
                ? {
                    ...w,
                    props: {
                      ...w.props,
                      style: {
                        ...w.props.style,
                        width: newWidth,
                        height: newHeight,
                      },
                    },
                  }
                : w
            )
          );
        }
      }
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [widget.id]);

  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{
        position: "absolute",
        top: widget.props.style?.top || 0,
        left: widget.props.style?.left || 0,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        resize: "both",
        overflow: "auto",
        minWidth: 150,
        minHeight: 100,
        border: selected ? "2px solid #1890ff" : "1px solid #ddd",
        borderRadius: 4,
        background: selected ? "#e6f7ff" : "#fff",
        boxSizing: "border-box",
        padding: 0,
        margin: 0,
      }}
    >
      {renderWidget(widget)}
    </div>
  );
};

const Canvas: React.FC<CanvasProps> = ({
  onDrop,
  isMobileView,
  onSelectWidget,
  setIsVisualEditMode,
}) => {
  const {
    widgets,
    setWidgets,
    selectedWidgetId,
    setSelectedWidgetId,
    code,
    setCode,
  } = useEditor();
  const canvasRef = useRef<HTMLDivElement>(null);

  const generateCodeFromWidgets = (widgetList: Widget[]): string => {
    const importSet = new Set<string>();
    widgetList.forEach((w) => {
      if (["Button", "Image", "Table", "Calendar"].includes(w.type)) {
        importSet.add(w.type);
      }
    });
    let importLines = `import React from 'react';\n`;
    if (importSet.size > 0) {
      importLines += `import { ${Array.from(importSet).join(
        ", "
      )} } from 'antd';\n`;
    }
    importLines += `\n`;
    let componentCode = `const GeneratedComponent = () => {\n  return (\n    <div style={{ position: 'relative', width: '100%', padding: '20px' }}>\n`;
    widgetList.forEach((widget) => {
      const { type, props, content } = widget;
      let styleStr = "";
      if (props.style && Object.keys(props.style).length > 0) {
        const stylePairs = Object.entries(props.style).map(
          ([key, val]) =>
            `${key}: ${typeof val === "string" ? `'${val}'` : val}`
        );
        styleStr = ` style={{ ${stylePairs.join(", ")} }`;
      }
      if (type === "Image" || type === "img") {
        componentCode += `      <${type}${styleStr} />\n`;
      } else {
        componentCode += `      <${type}${styleStr}>${
          content || ""
        }</${type}>\n`;
      }
    });
    componentCode += `    </div>\n  );\n};\n\nexport default GeneratedComponent;\n`;
    return importLines + componentCode;
  };

  const [, dropRef] = useDrop({
    accept: ["WIDGET", "CANVAS_WIDGET"],
    drop: (item: any, monitor: DropTargetMonitor) => {
      if (!canvasRef.current) return;
      const clientOffset = monitor.getClientOffset();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      if (monitor.getItemType() === "WIDGET" && item.widgetType) {
        const x = clientOffset ? clientOffset.x - canvasRect.left : undefined;
        const y = clientOffset ? clientOffset.y - canvasRect.top : undefined;
        onDrop(item.widgetType, x, y);
      } else if (monitor.getItemType() === "CANVAS_WIDGET") {
        const delta = monitor.getDifferenceFromInitialOffset();
        let newLeft = item.left;
        let newTop = item.top;
        if (delta) {
          newLeft += delta.x;
          newTop += delta.y;
        }
        newLeft = Math.max(0, newLeft);
        newTop = Math.max(0, newTop);
        const updatedWidgets = widgets.map((w) =>
          w.id === item.id
            ? {
                ...w,
                props: {
                  ...w.props,
                  style: { ...w.props.style, top: newTop, left: newLeft },
                },
              }
            : w
        );
        setWidgets(updatedWidgets);
        setCode(generateCodeFromWidgets(updatedWidgets));
      }
    },
  });
  dropRef(canvasRef);

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
              width: "100%",
              height: "100%",

              top: 0,
              left: 0,
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
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
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
                  ...styleProps,
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                }}
              />
            </Space>
          </div>
        );
      case "Button":
        return (
          <Button
            type="primary"
            style={{
              ...styleProps,
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
            }}
          >
            {widget.content || "Button"}
          </Button>
        );
      case "Image": {
        const imgSrc =
          "https://cdn.pixabay.com/photo/2013/07/04/11/04/google-images-143148_1280.png";
        return (
          <img
            src={widget.props.src || imgSrc}
            alt={widget.props.alt || ""}
            style={{
              ...styleProps,
              width: "100%",
              height: "100%",
              display: "block",
              top: 0,
              left: 0,
            }}
          />
        );
      }
      case "Text":
        return (
          <Text
            style={{
              ...styleProps,
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
            }}
          >
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
          <div
            style={{
              ...styleProps,
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
            }}
          >
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              size="small"
            />
          </div>
        );
      }
      case "Calendar":
        return <Calendar fullscreen={false} />;
      case "SearchBar":
        return (
          <Space
            direction="vertical"
            style={{
              ...styleProps,
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
            }}
          >
            <Search
              placeholder={widget.content || "Search..."}
              allowClear
              enterButton
              style={{
                ...styleProps,
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
              }}
            />
          </Space>
        );
      case "ImageSlider": {
        const urls = widget.content
          .split(",")
          .map((u: string) => u.trim())
          .filter((u: string) => u.startsWith("http"));
        const slides = urls.length
          ? urls
          : [
              "https://media.istockphoto.com/id/1481862788/photo/stack-of-books-with-blurred-bookshelf-background-reading-learning-education-or-home-office.jpg?s=612x612&w=0&k=20&c=HA0Xbmj0D6Gs08NFJAmo_L84qMODnQgD1xOi9vrdBqo=",
              "https://www.shutterstock.com/image-photo/book-open-pages-close-up-600nw-2562942291.jpg",
              "https://dq5pwpg1q8ru0.cloudfront.net/2024/06/11/23/32/19/f436ae76-3659-4edc-a434-ba10bd875d97/99302-1.jfif",
            ];
        return (
          <Carousel
            autoplay
            dotPosition="bottom"
            style={{
              ...styleProps,
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
            }}
          >
            {slides.map((src, i) => (
              <div
                key={i}
                className="h-40 flex justify-center items-center bg-gray-100"
              >
                <img
                  src={src}
                  alt={`slide-${i}`}
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
      default: {
        const { style, ...rest } = widget.props || {};
        const Tag = widget.type as keyof JSX.IntrinsicElements;
        return React.createElement(
          Tag,
          { style: styleProps, ...rest, top: 0, left: 0 },
          widget.content
        );
      }
    }
  };

  return (
    <div
      ref={canvasRef}
      onClick={() => {
        setSelectedWidgetId(null);
        setIsVisualEditMode();
      }}
      className={`canvas-area ${isMobileView ? "mobile-canvas" : ""}`}
      style={{
        flex: 1,
        height: "100%",
        overflow: "auto",
        border: "2px dashed #ccc",
        background: "transparent",
        padding: isMobileView ? 12 : 20,
        position: "relative",
      }}
    >
      {widgets.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", padding: 20 }}>
          Drag widgets here to start building your site
        </div>
      ) : (
        widgets?.map((widget, idx) => (
          <SortableWidget
            key={widget.id}
            widget={widget}
            index={idx}
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
