import * as Babel from '@babel/standalone';  // using Babel standalone in browser

interface WidgetNode {
  id: string;
  type: string;
  props: { [key: string]: any };
  content: string;
}

export default function parseWidgetsFromJSX(code: string): WidgetNode[] {
  // Parse the code into an AST, with JSX (and TS) plugins
  let ast;
  try {
    ast = Babel.parse(code, { sourceType: 'module', plugins: ['jsx', 'javascript'] });
  } catch (err) {
    console.error("Babel parse error:", err);
    return [];
  }

  const widgets: WidgetNode[] = [];

  // Helper to generate unique ids (could also be shared with EditorPage)
  const genId = () => 'widget-' + Math.random().toString(36).substr(2, 5);

  // Traverse AST to find JSX elements in the return of GeneratedComponent
  const programBody = ast.program.body;
  for (const node of programBody) {
    // Look for "const GeneratedComponent = () => { ... }"
    if (node.type === 'VariableDeclaration') {
      for (const decl of node.declarations) {
        if (
          decl.id && decl.id.type === 'Identifier' && decl.id.name === 'GeneratedComponent' &&
          decl.init && decl.init.type === 'ArrowFunctionExpression'
        ) {
          // We found the arrow function for GeneratedComponent
          const funcBody = decl.init.body;
          let returnJSX: any = null;
          if (funcBody.type === 'BlockStatement') {
            // Find return statement inside the function
            const returnStmt = funcBody.body.find(stmt => stmt.type === 'ReturnStatement');
            if (returnStmt && returnStmt.argument) {
              returnJSX = returnStmt.argument;
            }
          } else {
            // Arrow function with implicit return (e.g., () => (<div>...</div>))
            returnJSX = funcBody;
          }
          if (returnJSX) {
            // If the return is a single JSX element (e.g., a <div> container)
            let children: any[] = [];
            if (returnJSX.type === 'JSXElement') {
              children = returnJSX.children || [];
            } else if (returnJSX.type === 'JSXFragment') {
              children = returnJSX.children || [];
            }
            // Iterate over JSX children of the returned element
            children.forEach(child => {
              if (child.type !== 'JSXElement') return;  // skip text nodes or expressions here
              const widgetTypeNode = child.openingElement.name;
              let widgetType = '';
              if (widgetTypeNode.type === 'JSXIdentifier') {
                widgetType = widgetTypeNode.name;
              } else if (widgetTypeNode.type === 'JSXMemberExpression') {
                // e.g. Typography.Text -> take last part as type name
                widgetType = widgetTypeNode.property.name || '';
              }
              const widgetProps: any = { style: {} };
              // Extract JSX attributes (props)
              child.openingElement.attributes.forEach(attr => {
                if (attr.type !== 'JSXAttribute') return;
                const attrName = attr.name.name;
                const attrValue = attr.value;
                if (attrName === 'style' && attrValue && attrValue.type === 'JSXExpressionContainer') {
                  // Style prop is an object expression
                  const styleObj = attrValue.expression;
                  if (styleObj.type === 'ObjectExpression') {
                    styleObj.properties.forEach(prop => {
                      if (prop.type === 'ObjectProperty') {
                        const key = prop.key.type === 'Identifier' ? prop.key.name : String(prop.key.value);
                        // Only handle literal style values (string, number, boolean)
                        if (prop.value.type === 'StringLiteral') {
                          widgetProps.style[key] = prop.value.value;
                        } else if (prop.value.type === 'NumericLiteral') {
                          widgetProps.style[key] = prop.value.value;
                        } else if (prop.value.type === 'BooleanLiteral') {
                          widgetProps.style[key] = prop.value.value;
                        }
                      }
                    });
                  }
                } else if (attrName === 'src' || attrName === 'alt') {
                  // For Image attributes
                  if (attrValue && attrValue.type === 'StringLiteral') {
                    widgetProps[attrName] = attrValue.value;
                  }
                  if (attrValue && attrValue.type === 'JSXExpressionContainer' && attrValue.expression.type === 'StringLiteral') {
                    widgetProps[attrName] = attrValue.expression.value;
                  }
                } else {
                  // Handle other attributes (assuming literals or booleans)
                  if (!attrValue) {
                    // e.g. <Button disabled>
                    widgetProps[attrName] = true;
                  } else if (attrValue.type === 'StringLiteral') {
                    widgetProps[attrName] = attrValue.value;
                  } else if (attrValue.type === 'JSXExpressionContainer') {
                    const expr = attrValue.expression;
                    if (expr.type === 'StringLiteral') {
                      widgetProps[attrName] = expr.value;
                    } else if (expr.type === 'NumericLiteral') {
                      widgetProps[attrName] = expr.value;
                    } else if (expr.type === 'BooleanLiteral') {
                      widgetProps[attrName] = expr.value;
                    }
                  }
                }
              }); // end attributes loop

              // Extract text content inside the JSX element (if any)
              let innerText = '';
              child.children.forEach(node => {
                if (node.type === 'JSXText') {
                  const text = node.value.trim();
                  if (text) {
                    innerText += (innerText ? ' ' : '') + text;
                  }
                }
              });

              widgets.push({
                id: genId(),
                type: widgetType,
                props: widgetProps,
                content: innerText
              });
            });
          }
        }
      }
    }
  }

  return widgets;
}
