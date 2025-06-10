
import React, { useState } from 'react';
import { List, Input, Button, Typography, Avatar } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ChatPanel = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m here to help you build your website. What would you like to create?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    console.log('send', inputValue);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I understand you want to add that feature. Try dragging some widgets from the left panel!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-panel">
      <div style={{ padding: '16px', borderBottom: '1px solid rgb(226 232 240)' }}>
        <Text strong>AI Assistant</Text>
      </div>
      
      <div className="chat-messages">
        <List
          dataSource={messages}
          renderItem={(message) => (
            <List.Item style={{ padding: '8px 0', border: 'none' }}>
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <Avatar 
                  size="small" 
                  icon={message.type === 'ai' ? <RobotOutlined /> : <UserOutlined />}
                  style={{ 
                    backgroundColor: message.type === 'ai' ? '#1890ff' : '#52c41a',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <Text style={{ fontSize: '14px', lineHeight: '1.4' }}>
                    {message.content}
                  </Text>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
      
      <div className="chat-input-area">
        <Input.TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask AI for help..."
          rows={3}
          style={{ marginBottom: '8px', resize: 'none' }}
        />
        <Button 
          type="primary" 
          icon={<SendOutlined />} 
          onClick={handleSend}
          style={{ width: '100%' }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatPanel;
