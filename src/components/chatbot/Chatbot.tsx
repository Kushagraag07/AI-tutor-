// src/components/Chatbot/Chatbot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, X, MinusIcon, MessageSquare, AlertTriangle } from 'lucide-react';
import { sendMessageToGemini, ChatMessage } from '../../services/chatbotService';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error' | 'checking'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Auto-scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Test connection to Gemini
  const checkConnection = async () => {
    setConnectionStatus('checking');
    
    try {
      // Check if API key exists
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        console.error("Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
        setConnectionStatus('error');
        return;
      }
      
      // Send a simple test message
      const testMessage: ChatMessage = {
        id: 'test',
        role: 'user',
        content: 'Hello, this is a connection test.',
        timestamp: new Date()
      };
      
      const response = await sendMessageToGemini([testMessage]);
      
      // If the response contains an error message, set status to error
      if (response.includes('error') || response.includes('Sorry, I encountered')) {
        setConnectionStatus('error');
        console.error("AI service connection test failed:", response);
      } else {
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error("Connection test error:", error);
      setConnectionStatus('error');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await sendMessageToGemini([...messages, userMessage]);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Update connection status based on response
      if (response.includes('error') || response.includes('Sorry, I encountered')) {
        setConnectionStatus('error');
      } else {
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error("Error in chat:", error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format message content with basic markdown support
  const formatMessage = (content: string) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const inlineCodeRegex = /`([^`]+)`/g;
    
    // Replace code blocks
    let formattedContent = content.replace(codeBlockRegex, '<pre class="bg-gray-100 p-3 rounded my-2 overflow-x-auto"><code>$1</code></pre>');
    
    // Replace inline code
    formattedContent = formattedContent.replace(inlineCodeRegex, '<code class="bg-gray-100 px-1 rounded">$1</code>');
    
    // Handle line breaks
    formattedContent = formattedContent.replace(/\n/g, '<br />');
    
    return { __html: formattedContent };
  };

  // Reset the conversation
  const handleReset = () => {
    setMessages([]);
    // Add a system message indicating reset
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Conversation has been reset. How can I help you?",
      timestamp: new Date()
    };
    setMessages([systemMessage]);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors z-20 ${
          connectionStatus === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : connectionStatus === 'error' ? (
          <AlertTriangle className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col z-10 border border-gray-200">
          {/* Header */}
          <div className={`text-white py-3 px-4 rounded-t-lg flex justify-between items-center ${
            connectionStatus === 'error' ? 'bg-red-600' : 'bg-blue-600'
          }`}>
            <h3 className="font-medium">AI Tutor Assistant</h3>
            <div className="flex items-center space-x-2">
              {connectionStatus === 'error' && (
                <button 
                  onClick={checkConnection} 
                  className="text-white bg-red-700 hover:bg-red-800 rounded-full p-1"
                  title="Retry connection"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
              <button 
                onClick={handleReset} 
                className="text-white hover:bg-blue-700 rounded-full p-1"
                title="Reset conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white">
                <MinusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {connectionStatus === 'error' && messages.length === 0 && (
              <div className="bg-red-50 text-red-800 p-3 rounded-lg mb-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <p className="font-medium">Connection Error</p>
                </div>
                <p className="text-sm mt-1">
                  Could not connect to the AI service. Please check your internet connection and API configuration.
                </p>
                <p className="text-sm mt-2">
                  Make sure <strong>VITE_GEMINI_API_KEY</strong> is set in your <strong>.env</strong> file.
                </p>
              </div>
            )}
            
            {messages.length === 0 && connectionStatus !== 'error' ? (
              <div className="text-center text-gray-500 mt-20">
                <p>Ask me anything about your course!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block px-4 py-2 rounded-lg max-w-[85%] ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <div dangerouslySetInnerHTML={formatMessage(msg.content)} />
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={1}
                disabled={connectionStatus === 'error'}
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim() || connectionStatus === 'error'}
                className={`text-white p-2 rounded-lg ${
                  isLoading || !input.trim() || connectionStatus === 'error' 
                    ? 'opacity-50 cursor-not-allowed bg-blue-400' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <SendIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;