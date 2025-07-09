// import { useEditor } from "@/context/EditorContext";
// import React from "react";

// const VisualEditor = () => {
//   const { widgets, setWidgets, setCode, selectedWidgetId } = useEditor();

//   const generateCodeFromWidgets = (widgetList: typeof widgets): string => {
//     const importSet = new Set<string>();
//     widgetList.forEach((w) => {
//       if (["Button", "Image", "Table", "Calendar"].includes(w.type)) {
//         importSet.add(w.type);
//       }
//       if (w.type === "Text") {
//         importSet.add("Typography");
//       }
//     });

//     let importLines = `import React from 'react';\n`;
//     if (importSet.size > 0) {
//       if (importSet.has("Typography")) {
//         importSet.delete("Typography");
//         const otherImports = Array.from(importSet);
//         if (otherImports.length > 0) {
//           importLines += `import { Typography, ${otherImports.join(
//             ", "
//           )} } from 'antd';\n`;
//         } else {
//           importLines += `import { Typography } from 'antd';\n`;
//         }
//       } else {
//         importLines += `import { ${Array.from(importSet).join(
//           ", "
//         )} } from 'antd';\n`;
//       }
//     }
//     importLines += "\n";

//     let componentCode = `const GeneratedComponent = () => {\n  return (\n    <div style={{ padding: '20px' }}>\n`;
//     widgetList?.forEach((widget) => {
//       const { type, props, content } = widget;

//       let attrStr = "";
//       if (props?.style && Object.keys(props.style).length > 0) {
//         const stylePairs: string[] = [];
//         Object.entries(props.style).forEach(([key, val]) => {
//           if (typeof val === "string") {
//             stylePairs.push(`${key}: '${val}'`);
//           } else {
//             stylePairs.push(`${key}: ${val}`);
//           }
//         });
//         attrStr += ` style={{ ${stylePairs.join(", ")} }}`;
//       }
//       if (props.src) {
//         attrStr += ` src="${props.src}"`;
//       }
//       if (props.alt) {
//         attrStr += ` alt="${props.alt}"`;
//       }

//       Object.entries(props).forEach(([key, val]) => {
//         if (key === "style" || key === "src" || key === "alt") return;
//         if (typeof val === "string") {
//           attrStr += ` ${key}="${val}"`;
//         } else if (typeof val === "number" || typeof val === "boolean") {
//           attrStr += ` ${key}={${val}}`;
//         }
//       });

//       if (type === "Text") {
//         const innerText = content || "";
//         componentCode += `      <Typography.Text${attrStr}>${innerText}</Typography.Text>\n`;
//       } else if (type === "Image" || type === "img") {
//         componentCode += `      <${type}${attrStr} />\n`;
//       } else {
//         const innerText = content || "";
//         componentCode += `      <${type}${attrStr}>${innerText}</${type}>\n`;
//       }
//     });
//     componentCode += `    </div>\n  );\n};\n\nexport default GeneratedComponent;\n`;
//     return importLines + componentCode;
//   };

//   const handleStyleChange = (field: string, value: string) => {
//     setWidgets((prevWidgets) => {
//       const updatedWidgets = prevWidgets?.map((w: any) => {
//         if (w?.id === selectedWidgetId) {
//           if (
//             [
//               "height",
//               "width",
//               "padding",
//               "margin",
//               "color",
//               "fontSize",
//               "fontWeight",
//               "backgroundColor",
//             ].includes(field)
//           ) {
//             const newStyle = { ...w.props.style, [field]: value };
//             return { ...w, props: { ...w.props, style: newStyle } };
//           }

//           if (field === "src" || field === "alt" || field === "placeholder") {
//             return { ...w, props: { ...w.props, [field]: value } };
//           }

//           if (field === "content") {
//             return { ...w, content: value };
//           }
//         }
//         return w;
//       });
//       setCode(generateCodeFromWidgets(updatedWidgets));
//       return updatedWidgets;
//     });
//   };

//   const handleArrayChange = (field: string, index: number, value: string) => {
//     setWidgets((prevWidgets: any) => {
//       const updatedWidgets = prevWidgets.map((w: any) => {
//         if (w?.id === selectedWidgetId) {
//           const existingArray: string[] = w.props[field] || [];
//           const newArray = [...existingArray];
//           newArray[index] = value;
//           return { ...w, props: { ...w.props, [field]: newArray } };
//         }
//         return w;
//       });
//       setCode(generateCodeFromWidgets(updatedWidgets));
//       return updatedWidgets;
//     });
//   };

//   if (!selectedWidgetId) {
//     return (
//       <div className="w-[300px] p-4 text-sm text-muted-foreground">
//         Select an element to edit its properties.
//       </div>
//     );
//   }

//   const widget = widgets.find((w) => w.id === selectedWidgetId);
//   if (!widget) return null;
//   const style = widget.props.style || {};

//   const inputClass =
//     "w-full px-3 py-2 rounded-md border border-border bg-input dark:bg-neutral-600 dark:text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

//   const renderInput = (
//     label: string,
//     field: string,
//     value: any = "",
//     placeholder?: string
//   ) => (
//     <div key={field}>
//       <label className="block text-xs text-foreground mb-1">{label}</label>
//       <input
//         type="text"
//         value={value || ""}
//         onChange={(e) => handleStyleChange(field, e.target.value)}
//         className={inputClass}
//         placeholder={placeholder}
//       />
//     </div>
//   );

//   const renderImageInput = (
//     label: string,
//     field: string,
//     index: number,
//     value: string
//   ) => (
//     <div key={`${field}-${index}`}>
//       <label className="block text-xs text-foreground mb-1">{label}</label>
//       <input
//         type="text"
//         value={value}
//         onChange={(e) => handleArrayChange(field, index, e.target.value)}
//         className={inputClass}
//         placeholder="https://example.com/image.jpg"
//       />
//     </div>
//   );

//   type FieldSpec = {
//     label: string;
//     field: string;
//     value: any;
//     placeholder?: string;
//     customRender?: () => React.ReactNode;
//   };
//   const fields: FieldSpec[] = [
//     {
//       label: "Height",
//       field: "height",
//       value: style.height || "",
//       placeholder: "e.g. 40px",
//     },
//     {
//       label: "Width",
//       field: "width",
//       value: style.width || "",
//       placeholder: "e.g. 100%",
//     },
//     {
//       label: "Padding",
//       field: "padding",
//       value: style.padding || "",
//       placeholder: "e.g. 8px 12px",
//     },
//     {
//       label: "Margin",
//       field: "margin",
//       value: style.margin || "",
//       placeholder: "e.g. 0 auto",
//     },
//     {
//       label: "Background Color",
//       field: "backgroundColor",
//       value: style.backgroundColor || "",
//       placeholder: "e.g. #fff",
//     },
//   ];

//   if (widget.type === "Text") {
//     fields.push(
//       {
//         label: "Text Content",
//         field: "content",
//         value: widget.content || "",
//         placeholder: "e.g. Hello world",
//       },
//       {
//         label: "Text Color",
//         field: "color",
//         value: style.color || "",
//         placeholder: "e.g. #222",
//       },
//       {
//         label: "Font Size",
//         field: "fontSize",
//         value: style.fontSize || "",
//         placeholder: "e.g. 16px",
//       },
//       {
//         label: "Font Weight",
//         field: "fontWeight",
//         value: style.fontWeight || "",
//         placeholder: "e.g. 400 or bold",
//       }
//     );
//   }

//   if (widget.type?.toLowerCase() === "imageslider") {
//     const images: string[] = widget.props.images || ["", "", ""];
//     fields.push(
//       {
//         label: "Image 1 URL",
//         field: "images",
//         value: undefined,
//         customRender: () =>
//           renderImageInput("Image 1 URL", "images", 0, images[0] || ""),
//       },
//       {
//         label: "Image 2 URL",
//         field: "images",
//         value: undefined,
//         customRender: () =>
//           renderImageInput("Image 2 URL", "images", 1, images[1] || ""),
//       },
//       {
//         label: "Image 3 URL",
//         field: "images",
//         value: undefined,
//         customRender: () =>
//           renderImageInput("Image 3 URL", "images", 2, images[2] || ""),
//       }
//     );
//   }

//   if (widget.type === "Image") {
//     fields.push(
//       {
//         label: "Image URL",
//         field: "src",
//         value: widget.props.src || "",
//         placeholder: "https://...",
//       },
//       {
//         label: "Alt Text",
//         field: "alt",
//         value: widget.props.alt || "",
//         placeholder: "Image description",
//       }
//     );
//   }

//   if (widget.type === "Button") {
//     fields.push(
//       {
//         label: "Button Label",
//         field: "content",
//         value: widget.content || "",
//         placeholder: "Click me",
//       },
//       {
//         label: "Text Color",
//         field: "color",
//         value: style.color || "",
//         placeholder: "e.g. white",
//       },
//       {
//         label: "Font Weight",
//         field: "fontWeight",
//         value: style.fontWeight || "",
//         placeholder: "e.g. 600",
//       },
//       {
//         label: "Font Size",
//         field: "fontSize",
//         value: style.fontSize || "",
//         placeholder: "e.g. 14px",
//       }
//     );
//   }

//   if (
//     widget.type !== "Text" &&
//     widget.type?.toLowerCase() !== "imageslider" &&
//     widget.type !== "Image" &&
//     widget.type !== "Button"
//   ) {
//     fields.push(
//       {
//         label: "Text Content",
//         field: "content",
//         value: widget.content || "",
//         placeholder: "e.g. Enter text",
//       },
//       {
//         label: "Text Color",
//         field: "color",
//         value: style.color || "",
//         placeholder: "e.g. #000",
//       },
//       {
//         label: "Font Size",
//         field: "fontSize",
//         value: style.fontSize || "",
//         placeholder: "e.g. 14px",
//       },
//       {
//         label: "Font Weight",
//         field: "fontWeight",
//         value: style.fontWeight || "",
//         placeholder: "e.g. 400 or bold",
//       }
//     );
//   }

//   return (
//     <div className="w-[300px] max-h-[85vh] overflow-y-auto p-4 bg-card shadow-md space-y-4">
//       <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2">
//         Visual Edits
//       </h3>
//       <div className="space-y-4">
//         {fields?.map((f) =>
//           f.customRender
//             ? f.customRender()
//             : renderInput(f.label, f.field, f.value, f.placeholder)
//         )}
//       </div>
//     </div>
//   );
// };

// export default VisualEditor;

import { useEditor } from "@/context/EditorContext";
import React from "react";

const VisualEditor = () => {
  const { widgets, setWidgets, setCode, selectedWidgetId } = useEditor();

  const generateCodeFromWidgets = (widgetList: typeof widgets): string => {
    const importSet = new Set<string>();
    widgetList.forEach((w) => {
      if (["Button", "Image", "Table", "Calendar"].includes(w.type)) {
        importSet.add(w.type);
      }
      if (w.type === "Text") {
        importSet.add("Typography");
      }
    });

    let importLines = `import React from 'react';\n`;
    if (importSet.size > 0) {
      if (importSet.has("Typography")) {
        importSet.delete("Typography");
        const otherImports = Array.from(importSet);
        if (otherImports.length > 0) {
          importLines += `import { Typography, ${otherImports.join(
            ", "
          )} } from 'antd';\n`;
        } else {
          importLines += `import { Typography } from 'antd';\n`;
        }
      } else {
        importLines += `import { ${Array.from(importSet).join(
          ", "
        )} } from 'antd';\n`;
      }
    }
    importLines += "\n";

    let componentCode = `const GeneratedComponent = () => {\n  return (\n    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '20px' }}>\n`;
    widgetList?.forEach((widget) => {
      const { type, props, content } = widget;

      let attrStr = "";
      if (props?.style && Object.keys(props.style).length > 0) {
        const stylePairs: string[] = [];
        Object.entries(props.style).forEach(([key, val]) => {
          if (typeof val === "string") {
            stylePairs.push(`${key}: '${val}'`);
          } else {
            stylePairs.push(`${key}: ${val}`);
          }
        });
        attrStr += ` style={{ ${stylePairs.join(", ")} }}`;
      }
      if (props.src) {
        attrStr += ` src="${props.src}"`;
      }
      if (props.alt) {
        attrStr += ` alt="${props.alt}"`;
      }

      Object.entries(props).forEach(([key, val]) => {
        if (key === "style" || key === "src" || key === "alt") return;
        if (typeof val === "string") {
          attrStr += ` ${key}="${val}"`;
        } else if (typeof val === "number" || typeof val === "boolean") {
          attrStr += ` ${key}={${val}}`;
        }
      });

      if (type === "Text") {
        const innerText = content || "";
        componentCode += `      <Typography.Text${attrStr}>${innerText}</Typography.Text>\n`;
      } else if (type === "Image" || type === "img") {
        componentCode += `      <${type}${attrStr} />\n`;
      } else {
        const innerText = content || "";
        componentCode += `      <${type}${attrStr}>${innerText}</${type}>\n`;
      }
    });
    componentCode += `    </div>\n  );\n};\n\nexport default GeneratedComponent;\n`;
    return importLines + componentCode;
  };

  const handleStyleChange = (field: string, value: string) => {
    setWidgets((prevWidgets) => {
      const updatedWidgets = prevWidgets?.map((w: any) => {
        if (w?.id === selectedWidgetId) {
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

          if (field === "src" || field === "alt" || field === "placeholder") {
            return { ...w, props: { ...w.props, [field]: value } };
          }

          if (field === "content") {
            return { ...w, content: value };
          }
        }
        return w;
      });
      setCode(generateCodeFromWidgets(updatedWidgets));
      return updatedWidgets;
    });
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setWidgets((prevWidgets: any) => {
      const updatedWidgets = prevWidgets.map((w: any) => {
        if (w?.id === selectedWidgetId) {
          const existingArray: string[] = w.props[field] || [];
          const newArray = [...existingArray];
          newArray[index] = value;
          return { ...w, props: { ...w.props, [field]: newArray } };
        }
        return w;
      });
      setCode(generateCodeFromWidgets(updatedWidgets));
      return updatedWidgets;
    });
  };

  if (!selectedWidgetId) {
    return (
      <div className="w-[300px] p-4 text-sm text-muted-foreground">
        Select an element to edit its properties.
      </div>
    );
  }

  const widget = widgets.find((w) => w.id === selectedWidgetId);
  if (!widget) return null;
  const style = widget.props.style || {};

  const inputClass =
    "w-full px-3 py-2 rounded-md border border-border bg-input dark:bg-neutral-600 dark:text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  const renderInput = (
    label: string,
    field: string,
    value: any = "",
    placeholder?: string
  ) => (
    <div key={field}>
      <label className="block text-xs text-foreground mb-1">{label}</label>
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
    label: string,
    field: string,
    index: number,
    value: string
  ) => (
    <div key={`${field}-${index}`}>
      <label className="block text-xs text-foreground mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => handleArrayChange(field, index, e.target.value)}
        className={inputClass}
        placeholder="https://example.com/image.jpg"
      />
    </div>
  );

  type FieldSpec = {
    label: string;
    field: string;
    value: any;
    placeholder?: string;
    customRender?: () => React.ReactNode;
  };
  const fields: FieldSpec[] = [
    {
      label: "Height",
      field: "height",
      value: style.height || "",
      placeholder: "e.g. 40px",
    },
    {
      label: "Width",
      field: "width",
      value: style.width || "",
      placeholder: "e.g. 100%",
    },
    {
      label: "Padding",
      field: "padding",
      value: style.padding || "",
      placeholder: "e.g. 8px 12px",
    },
    {
      label: "Margin",
      field: "margin",
      value: style.margin || "",
      placeholder: "e.g. 0 auto",
    },
    {
      label: "Background Color",
      field: "backgroundColor",
      value: style.backgroundColor || "",
      placeholder: "e.g. #fff",
    },
  ];

  if (widget.type === "Text") {
    fields.push(
      {
        label: "Text Content",
        field: "content",
        value: widget.content || "",
        placeholder: "e.g. Hello world",
      },
      {
        label: "Text Color",
        field: "color",
        value: style.color || "",
        placeholder: "e.g. #222",
      },
      {
        label: "Font Size",
        field: "fontSize",
        value: style.fontSize || "",
        placeholder: "e.g. 16px",
      },
      {
        label: "Font Weight",
        field: "fontWeight",
        value: style.fontWeight || "",
        placeholder: "e.g. 400 or bold",
      }
    );
  }

  if (widget.type?.toLowerCase() === "imageslider") {
    const images: string[] = widget.props.images || ["", "", ""];
    fields.push(
      {
        label: "Image 1 URL",
        field: "images",
        value: undefined,
        customRender: () =>
          renderImageInput("Image 1 URL", "images", 0, images[0] || ""),
      },
      {
        label: "Image 2 URL",
        field: "images",
        value: undefined,
        customRender: () =>
          renderImageInput("Image 2 URL", "images", 1, images[1] || ""),
      },
      {
        label: "Image 3 URL",
        field: "images",
        value: undefined,
        customRender: () =>
          renderImageInput("Image 3 URL", "images", 2, images[2] || ""),
      }
    );
  }

  if (widget.type === "Image") {
    fields.push(
      {
        label: "Image URL",
        field: "src",
        value: widget.props.src || "",
        placeholder: "https://...",
      },
      {
        label: "Alt Text",
        field: "alt",
        value: widget.props.alt || "",
        placeholder: "Image description",
      }
    );
  }

  if (widget.type === "Button") {
    fields.push(
      {
        label: "Button Label",
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

  if (
    widget.type !== "Text" &&
    widget.type?.toLowerCase() !== "imageslider" &&
    widget.type !== "Image" &&
    widget.type !== "Button"
  ) {
    fields.push(
      {
        label: "Text Content",
        field: "content",
        value: widget.content || "",
        placeholder: "e.g. Enter text",
      },
      {
        label: "Text Color",
        field: "color",
        value: style.color || "",
        placeholder: "e.g. #000",
      },
      {
        label: "Font Size",
        field: "fontSize",
        value: style.fontSize || "",
        placeholder: "e.g. 14px",
      },
      {
        label: "Font Weight",
        field: "fontWeight",
        value: style.fontWeight || "",
        placeholder: "e.g. 400 or bold",
      }
    );
  }

  return (
    <div className="w-[300px] max-h-[85vh] overflow-y-auto p-4 bg-card shadow-md space-y-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2">
        Visual Edits
      </h3>
      <div className="space-y-4">
        {fields?.map((f) =>
          f.customRender
            ? f.customRender()
            : renderInput(f.label, f.field, f.value, f.placeholder)
        )}
      </div>
    </div>
  );
};

export default VisualEditor;
