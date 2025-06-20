// src/utils/parseWidgets.ts
import * as Babel from '@babel/standalone';
import { Widget } from '../Canvas';

const KNOWN_WIDGETS = [
  'Button','Image','Text','Table','Form','Calendar','SearchBar','ImageSlider'
];

export function parseWidgetsFromJSX(code: string): Widget[] {
  // 1️⃣ parse with Babel-standalone
  const ast = (Babel as any).parse(code, {
    sourceType: 'module',
    plugins: ['jsx','typescript'],
  });

  const widgets: Widget[] = [];

  // 2️⃣ traverse from the same bundle
  ;(Babel as any).traverse(ast, {
    JSXElement(path: any) {
      const name = path.node.openingElement.name.name;
      if (KNOWN_WIDGETS.includes(name)) {
        const content = path.node.children
          .filter((c: any) => c.type === 'JSXText')
          .map((c: any) => c.value.trim())
          .join('');
        widgets.push({
          id: path.node.start,
          type: name,
          content,
        });
      }
    }
  });

  return widgets;
}
