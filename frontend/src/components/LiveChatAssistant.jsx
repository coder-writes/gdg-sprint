import { useState, useContext, useEffect, useRef } from 'react';
import { AppContent } from '../contexts/AppContext';
import { SocketContext } from '../contexts/SocketContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { MessageSquare, Send, Sparkles, Mic, Download, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LiveChatAssistant = () => {
  const { userData } = useContext(AppContent);
  const { socket, connected } = useContext(SocketContext);
  const { isDarkMode } = useDarkMode();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [roomId, setRoomId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (socket && userData?._id) {
      const newRoomId = `user-${userData._id}`;
      setRoomId(newRoomId);
      socket.emit('join-room', newRoomId);
    }
  }, [socket, userData]);

  useEffect(() => {
    if (!socket) return;

    socket.on('user-message', (data) => {
      setMessages(prev => [...prev, {
        role: 'user',
        content: data.content,
        timestamp: data.timestamp
      }]);
    });

    socket.on('ai-message-chunk', (data) => {
      if (data.done) {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
            lastMessage.isStreaming = false;
            lastMessage.timestamp = data.timestamp;
          }
          return newMessages;
        });
        setIsTyping(false);
      } else {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          
          if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
            lastMessage.content += data.chunk;
          } else {
            newMessages.push({
              role: 'assistant',
              content: data.chunk,
              isStreaming: true
            });
          }
          return newMessages;
        });
        setIsTyping(true);
      }
    });

    socket.on('chat-error', (data) => {
      toast.error(data.error);
      setIsTyping(false);
    });

    return () => {
      socket.off('user-message');
      socket.off('ai-message-chunk');
      socket.off('chat-error');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !socket || !connected) return;

    const history = messages
      .filter(m => !m.isStreaming)
      .map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));

    socket.emit('chat-message', {
      message: input,
      history,
      roomId
    });

    setInput('');
    setIsTyping(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      toast.info('Listening...');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      toast.success('Voice input captured!');
    };

    recognition.onerror = (event) => {
      toast.error('Voice input error: ' + event.error);
    };

    recognition.start();
  };

  const exportChat = () => {
    const chatText = messages
      .filter(m => !m.isStreaming)
      .map(m => `**${m.role === 'user' ? 'You' : 'AI Assistant'}**: ${m.content}`)
      .join('\n\n');

    const blob = new Blob([chatText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat exported!');
  };

  const clearChat = () => {
    setMessages([]);
    toast.success('Chat cleared!');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 h-[calc(100vh-200px)]">
      <div className={`flex flex-col h-full ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {/* Header */}
        <div className={`p-5 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800/80' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50'} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-500 to-purple-500'}`}>
              <MessageSquare className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Live AI Assistant</h2>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ask anything about coding</p>
            </div>
            <span className={`ml-2 px-3 py-1 text-xs font-semibold rounded-full ${
              connected ? isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700 border border-green-300' : 
              isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {connected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportChat}
              className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Export chat"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={clearChat}
              className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${isDarkMode ? 'bg-gray-900/30' : 'bg-gradient-to-b from-gray-50/50 to-white'}`}>
          {messages.length === 0 ? (
            <div className={`h-full flex flex-col items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className={`p-6 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-100 to-purple-100'} mb-4`}>
                <Sparkles className={`w-16 h-16 ${isDarkMode ? 'opacity-20' : 'text-blue-400'}`} />
              </div>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Start a conversation with AI</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Ask anything about coding, algorithms, or development</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
                    message.role === 'user'
                      ? isDarkMode 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-100 border border-gray-700'
                        : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className={`prose ${isDarkMode ? 'prose-invert' : 'prose-slate'} prose-sm max-w-none`}>
                      <ReactMarkdown
                        components={{
                          code({ inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={isDarkMode ? vscDarkPlus : oneLight}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  {message.timestamp && (
                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'opacity-70' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className={`rounded-2xl p-4 shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <div className="flex gap-2">
                  <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-blue-400'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
                  <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-blue-400'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
                  <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-blue-400'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`p-5 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800/80' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex gap-3">
            <button
              onClick={handleVoiceInput}
              className={`p-3 rounded-xl transition-all hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
              }`}
              title="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Shift+Enter for new line)"
              className={`flex-1 p-3 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 transition-all ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400'
              }`}
              rows="1"
              disabled={!connected}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !connected}
              className={`p-3 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              } text-white shadow-lg`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChatAssistant;
