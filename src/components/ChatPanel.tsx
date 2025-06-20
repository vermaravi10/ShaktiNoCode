import React, { useState } from "react";
import { List, Input, Button, Typography, Avatar } from "antd";
import { SendOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ChatPanel = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm here to help you build your website. What would you like to create?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        content:
          "I understand you want to add that feature. Try dragging some widgets from the left panel!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-panel flex flex-col h-full border-l border-border bg-background text-foreground dark:bg-neutral-900">
      <div className="p-4 border-b border-border">
        <Text className="text-foreground font-semibold">AI Assistant</Text>
      </div>

      <div className="chat-messages flex-1 overflow-y-auto p- space-y-4">
        <List
          dataSource={messages}
          renderItem={(message) => (
            <List.Item className="!border-none !p-0">
              <div
                className={`
                  flex items-start gap-2 w-full p-2 
                  ${
                    message.type === "user"
                      ? "justify-end flex-row-reverse"
                      : "justify-start"
                  }
                `}
              >
                <Avatar
                  size="small"
                  icon={
                    message.type === "ai" ? <RobotOutlined /> : <UserOutlined />
                  }
                  className={
                    message.type === "ai" ? "bg-blue-500" : "bg-green-500"
                  }
                />

                <div
                  className={`
                  px-4 py-2 rounded-lg text-sm max-w-[80%] whitespace-pre-wrap shadow-sm
                  ${
                    message.type === "ai"
                      ? "bg-white text-black dark:bg-neutral-800 dark:text-white"
                      : "bg-primary text-white ml-auto"
                  }
                  `}
                >
                  {message.content}
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>

      <div className="chat-input-area border-t border-border border-opacity-20 p-4 bg-white text-black dark:bg-neutral-900 dark:text-white">
        <Input.TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask AI for help..."
          rows={2}
          className="text-sm resize-none bg-white text-black border border-border border-opacity-20 placeholder:text-gray-400 focus:border-ring focus:ring-1 focus:ring-ring dark:bg-neutral-800 dark:text-white"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          className="mt-2 w-full bg-primary text-white hover:opacity-90"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatPanel;
