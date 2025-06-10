
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from 'antd';
import { PaperClipOutlined, LinkOutlined, AudioOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/editor');
  };

  const handleAttach = () => {
    console.log('attach');
  };

  const handleLink = () => {
    console.log('link');
  };

  const handleVoice = () => {
    console.log('voice');
  };

  return (
    <div className="landing-hero">
      <div className="hero-content">
        <h1 className="hero-title">Build with AI</h1>
        <p className="hero-subtitle">
          Launch Scalable, Secure, and Stunning Websites in Minutes with nocode.AI
        </p>
        
        <div className="idea-input-container">
          <TextArea
            placeholder="Describe your website idea..."
            rows={6}
            style={{
              fontSize: '16px',
              padding: '16px',
              paddingBottom: '60px',
              borderRadius: '12px',
              border: '1px solid rgb(203 213 225)',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              resize: 'none'
            }}
          />
          <div className="embedded-controls">
            <Button 
              type="text" 
              icon={<PaperClipOutlined />} 
              onClick={handleAttach}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid rgb(226 232 240)',
                boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)'
              }}
            />
            <Button 
              type="text" 
              icon={<LinkOutlined />} 
              onClick={handleLink}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid rgb(226 232 240)',
                boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)'
              }}
            />
            <Button 
              type="text" 
              icon={<AudioOutlined />} 
              onClick={handleVoice}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid rgb(226 232 240)',
                boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)'
              }}
            />
          </div>
        </div>

        <Button 
          type="primary" 
          size="large" 
          onClick={handleGetStarted}
          style={{
            height: '48px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '12px',
            paddingLeft: '32px',
            paddingRight: '32px',
            backgroundColor: 'rgb(99 102 241)',
            borderColor: 'rgb(99 102 241)',
            boxShadow: '0 4px 14px 0 rgb(99 102 241 / 0.39)'
          }}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
