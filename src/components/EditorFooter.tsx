import React from "react";
import { Layout, Breadcrumb } from "antd";

const { Footer } = Layout;

const EditorFooter: React.FC = () => {
  return (
    <Footer className="border-t border-border bg-white dark:bg-neutral-800 text-foreground px-4 h-[50px] flex items-center">
      <Breadcrumb
        separator={
          <span className="text-muted-foreground dark:text-foreground">›</span>
        }
        className="text-sm"
      >
        <Breadcrumb.Item>
          <a
            href="/"
            className="text-muted-foreground dark:text-foreground hover:underline"
          >
            Home
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a
            href="/editor"
            className="text-muted-foreground dark:text-foreground hover:underline"
          >
            Editor
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-foreground font-semibold">My Website</span>
        </Breadcrumb.Item>
      </Breadcrumb>
    </Footer>
  );
};

export default EditorFooter;
