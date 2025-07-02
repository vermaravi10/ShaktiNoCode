import { parse } from "@babel/parser";

export interface WidgetNode {
  id: string;
  type: string;
  props: { [key: string]: any };
  content: string;
}

const KNOWN_WIDGETS = ["Text", "Button", "Image", "Table", "Calendar"];

const genId = () => "widget-" + Math.random().toString(36).substring(2, 8);

function extractWidgetsFromChildren(children: any[]): WidgetNode[] {
  const widgets: WidgetNode[] = [];

  for (const child of children) {
    if (child.type !== "JSXElement") continue;

    const element = child.openingElement;
    const nameNode = element.name;

    let widgetType = "";
    if (nameNode.type === "JSXIdentifier") {
      widgetType = nameNode.name;
    } else if (nameNode.type === "JSXMemberExpression") {
      widgetType = nameNode.property.name || "";
    }

    const props: Record<string, any> = { style: {} };

    for (const attr of element.attributes) {
      if (attr.type !== "JSXAttribute") continue;

      const attrName = attr.name.name;
      const attrValue = attr.value;

      if (attrName === "style") {
        if (
          attrValue?.type === "JSXExpressionContainer" &&
          attrValue.expression.type === "ObjectExpression"
        ) {
          for (const prop of attrValue.expression.properties) {
            if (
              prop.type === "ObjectProperty" &&
              prop.key.type === "Identifier"
            ) {
              const key = prop.key.name;
              const val = prop.value;
              if (
                val.type === "StringLiteral" ||
                val.type === "NumericLiteral" ||
                val.type === "BooleanLiteral"
              ) {
                props.style[key] = val.value;
              }
            }
          }
        }

        continue;
      }

      if (attrValue?.type === "StringLiteral") {
        props[attrName] = attrValue.value;
      } else if (
        attrValue?.type === "JSXExpressionContainer" &&
        ["StringLiteral", "NumericLiteral", "BooleanLiteral"].includes(
          attrValue.expression.type
        )
      ) {
        props[attrName] = attrValue.expression.value;
      } else if (!attrValue) {
        props[attrName] = true;
      }
    }

    let content = "";
    for (const inner of child.children || []) {
      if (inner.type === "JSXText") {
        const text = inner.value.trim();
        if (text) content += (content ? " " : "") + text;
      }
    }

    widgets.push({
      id: genId(),
      type: widgetType,
      props,
      content,
    });

    if (child.children?.length) {
      widgets.push(...extractWidgetsFromChildren(child.children));
    }
  }

  return widgets;
}

export default function parseWidgetsFromJSX(code: string): WidgetNode[] {
  console.log("🚀 ~ parseWidgetsFromJSX ~ code:", code);
  let ast: any;
  try {
    ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });
    console.log("🚀 ~ parseWidgetsFromJSX ~ ast:", ast);
  } catch (err) {
    console.log("rv");
    console.warn("Babel parse error. JSX might be invalid.", err);
    return [];
  }

  const widgets: WidgetNode[] = [];

  const body = ast.program.body;
  console.log("🚀 ~ parseWidgetsFromJSX ~ body:", body);
  for (const node of body) {
    console.log("🚀 ~ parseWidgetsFromJSX ~ node:", node);
    if (node.type === "VariableDeclaration") {
      for (const decl of node.declarations) {
        if (
          decl.id?.type === "Identifier" &&
          decl.id.name === "GeneratedComponent" &&
          decl.init?.type === "ArrowFunctionExpression"
        ) {
          const funcBody = decl.init.body;

          let returnJSX: any = null;

          if (funcBody.type === "BlockStatement") {
            const returnStmt = funcBody.body.find(
              (stmt: any) => stmt.type === "ReturnStatement"
            );
            if (returnStmt?.argument) {
              returnJSX = returnStmt.argument;
            }
          } else {
            returnJSX = funcBody;
          }
          console.log("returnJSX node:", returnJSX);

          if (returnJSX?.type === "JSXElement") {
            const innerChildren = returnJSX.children ?? [];
            widgets.push(...extractWidgetsFromChildren(innerChildren));
          }
        }
      }
    }
  }

  return widgets;
}
