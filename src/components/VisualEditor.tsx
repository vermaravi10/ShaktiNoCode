import { useEditor } from "@/context/EditorContext";
import React from "react";

const VisualEditor = () => {
  const { widgets, setWidgets, setCode, selectedWidgetId } = useEditor();

  const generateCodeFromWidgets = (widgetList: typeof widgets): string => {
    // Determine which Ant Design components need to be imported
    const importSet = new Set<string>();
    widgetList.forEach((w) => {
      if (["Button", "Image", "Table", "Calendar"].includes(w.type)) {
        importSet.add(w.type);
      }
    });
    // Build import statements
    let importLines = `import React from 'react';\n`;
    if (importSet.size > 0) {
      importLines += `import { ${Array.from(importSet).join(
        ", "
      )} } from 'antd';\n`;
    }
    importLines += "\n";

    // Start component code
    let componentCode = `const GeneratedComponent = () => {\n  return (\n    <div style={{ padding: '20px' }}>\n`;
    // Add JSX for each widget
    for (const widget of widgetList) {
      const { type, props, content } = widget;
      // Build attributes string for JSX
      let attrStr = "";
      if (props.style && Object.keys(props.style).length > 0) {
        // Convert style object to inline style JSX
        const stylePairs: string[] = [];
        for (const [key, val] of Object.entries(props.style)) {
          if (typeof val === "string") {
            stylePairs.push(`${key}: '${val}'`);
          } else {
            stylePairs.push(`${key}: ${val}`);
          }
        }
        attrStr += ` style={{ ${stylePairs.join(", ")} }}`;
      }
      if (props.src) {
        attrStr += ` src="${props.src}"`;
      }
      if (props.alt) {
        attrStr += ` alt="${props.alt}"`;
      }

      if (type === "Image" || type === "img") {
        componentCode += `      <${type}${attrStr} />\n`;
      } else {
        const innerText = content || "";
        componentCode += `      <${type}${attrStr}>${innerText}</${type}>\n`;
      }
    }
    componentCode += `    </div>\n  );\n};\n\nexport default GeneratedComponent;\n`;

    return importLines + componentCode;
  };

  const handleStyleChange = (field: string, value: string) => {
    setWidgets((prevWidgets) => {
      const updated = prevWidgets.map((w) => {
        if (w.id === selectedWidgetId) {
          // Style fields
          if (
            [
              "height",
              "width",
              "padding",
              "margin",
              "color",
              "fontSize",
              "fontWeight",
              "backgroundColor",
            ].includes(field)
          ) {
            const newStyle = { ...w.props.style, [field]: value };
            return { ...w, props: { ...w.props, style: newStyle } };
          }

          // Other editable props
          if (field === "src" || field === "alt") {
            return { ...w, props: { ...w.props, [field]: value } };
          }

          // Content / innerText update
          if (field === "content") {
            return { ...w, content: value };
          }
        }
        return w;
      });

      const newCode = generateCodeFromWidgets(updated);
      setCode(newCode);
      return updated;
    });
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setWidgets((prevWidgets) => {
      const updated = prevWidgets.map((w) => {
        if (w.id === selectedWidgetId) {
          const existing = w.props[field] || [];
          const newArray = [...existing];
          newArray[index] = value;

          return {
            ...w,
            props: {
              ...w.props,
              [field]: newArray,
            },
          };
        }
        return w;
      });

      setCode(generateCodeFromWidgets(updated));
      return updated;
    });
  };

  return (
    <div className="w-[300px] max-h-[85vh] overflow-y-auto p-4 bg-card  shadow-md space-y-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2">
        Visual Edits
      </h3>

      {(() => {
        const widget = widgets?.find((w) => w.id === selectedWidgetId);
        if (!widget) return null;
        const style = widget.props.style || {};
        const inputClass =
          "w-full px-3 py-2 rounded-md border border-border bg-input dark:bg-neutral-600 dark:text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

        const renderInput = (
          label: any,
          field: any,
          value: any = "",
          placeholder?: any
        ) => (
          <div key={field}>
            <label className="block text-xs text-foreground mb-1">
              {label}
            </label>
            <input
              type="text"
              value={value || ""}
              onChange={(e) => handleStyleChange(field, e.target.value)}
              className={inputClass}
              placeholder={placeholder}
            />
          </div>
        );

        const renderImageInput = (
          label: any,
          field: any,
          index: any,
          value: any
        ) => (
          <div key={`${field}-${index}`}>
            <label className="block text-xs text-foreground mb-1">
              {label}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleArrayChange(field, index, e.target.value)}
              className={inputClass}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        );

        // Common fields for all widgets
        type Field = {
          label: string;
          field: string;
          value: any;
          placeholder?: string;
          customRender?: () => React.ReactNode;
        };

        const fields: Field[] = [
          {
            label: "Height",
            field: "height",
            value: style.height,
            placeholder: "e.g. 40px",
          },
          {
            label: "Width",
            field: "width",
            value: style.width,
            placeholder: "e.g. 100%",
          },
          {
            label: "Padding",
            field: "padding",
            value: style.padding,
            placeholder: "e.g. 8px 12px",
          },
          {
            label: "Margin",
            field: "margin",
            value: style.margin,
            placeholder: "e.g. 0 auto",
          },
          {
            label: "Background Color",
            field: "backgroundColor",
            value: style.backgroundColor,
            placeholder: "e.g. #fff",
          },
        ];

        // Widget-specific additions
        if (widget.type === "Text") {
          fields.push(
            {
              label: "Text Content",
              field: "content",
              value: widget.content,
              placeholder: "e.g. Hello world",
            },
            {
              label: "Text Color",
              field: "color",
              value: style.color,
              placeholder: "e.g. #222",
            },
            {
              label: "Font Size",
              field: "fontSize",
              value: style.fontSize,
              placeholder: "e.g. 16px",
            },
            {
              label: "Font Weight",
              field: "fontWeight",
              value: style.fontWeight,
              placeholder: "e.g. 400 or bold",
            }
          );
        }

        if (widget.type?.toLowerCase() === "imageslider") {
          const images = widget.props.images || ["", "", ""];

          fields.push(
            {
              label: "Image 1 URL",
              field: "images",
              customRender: () =>
                renderImageInput("Image 1 URL", "images", 0, images[0] || ""),
              value: undefined,
            },
            {
              label: "Image 2 URL",
              field: "images",
              customRender: () =>
                renderImageInput("Image 2 URL", "images", 1, images[1] || ""),
              value: undefined,
            },
            {
              label: "Image 3 URL",
              field: "images",
              customRender: () =>
                renderImageInput("Image 3 URL", "images", 2, images[2] || ""),
              value: undefined,
            }
          );
        }

        if (widget.type === "Image") {
          fields.push({
            label: "Image URL",
            field: "src",
            value: widget.props.src,
            placeholder: "https://...",
          });
        }

        if (widget.type === "Button") {
          fields.push(
            {
              label: "Label",
              field: "content",
              value: widget.content || "",
              placeholder: "Click me",
            },
            {
              label: "Text Color",
              field: "color",
              value: style.color || "",
              placeholder: "e.g. white",
            },
            {
              label: "Font Weight",
              field: "fontWeight",
              value: style.fontWeight || "",
              placeholder: "e.g. 600",
            },
            {
              label: "Font Size",
              field: "fontSize",
              value: style.fontSize || "",
              placeholder: "e.g. 14px",
            }
          );
        }

        return (
          <div className="space-y-4">
            {fields.map((f) =>
              f.customRender
                ? f.customRender()
                : renderInput(f.label, f.field, f.value, f.placeholder)
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default VisualEditor;
