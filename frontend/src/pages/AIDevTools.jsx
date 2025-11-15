import { useState } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { 
  Code2, Database, Regex, FileCode, Bot, Sparkles, 
  Shield, Zap, GitBranch, BookOpen, Wrench, MessageSquare,
  FileText, Bug, TestTube, Package
} from 'lucide-react';
import CodeReviewTool from '../components/CodeReviewTool';
import CodeSnippetGenerator from '../components/CodeSnippetGenerator';
import SQLQueryGenerator from '../components/SQLQueryGenerator';
import RegexGenerator from '../components/RegexGenerator';
import LiveChatAssistant from '../components/LiveChatAssistant';
import BugDetector from '../components/BugDetector';
import SecurityScanner from '../components/SecurityScanner';
import PerformanceOptimizer from '../components/PerformanceOptimizer';
import TechStackAdvisor from '../components/TechStackAdvisor';
import APIDocGenerator from '../components/APIDocGenerator';

const AIDevTools = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const { isDarkMode } = useDarkMode();

  const tools = [
    { 
      id: 'chat', 
      name: 'Live Chat', 
      icon: MessageSquare, 
      color: 'text-blue-500',
      description: 'Real-time AI assistant for coding help'
    },
    { 
      id: 'review', 
      name: 'Code Review', 
      icon: Code2, 
      color: 'text-blue-500',
      description: 'Get expert code review and suggestions'
    },
    { 
      id: 'snippet', 
      name: 'Snippet Generator', 
      icon: FileCode, 
      color: 'text-purple-500',
      description: 'Generate code snippets from descriptions'
    },
    { 
      id: 'sql', 
      name: 'SQL Generator', 
      icon: Database, 
      color: 'text-green-500',
      description: 'Create optimized SQL queries'
    },
    { 
      id: 'regex', 
      name: 'Regex Builder', 
      icon: Regex, 
      color: 'text-orange-500',
      description: 'Build and test regex patterns'
    },
    { 
      id: 'bugs', 
      name: 'Bug Detector', 
      icon: Bug, 
      color: 'text-red-500',
      description: 'Find and fix bugs in your code'
    },
    { 
      id: 'security', 
      name: 'Security Scanner', 
      icon: Shield, 
      color: 'text-yellow-500',
      description: 'Scan for security vulnerabilities'
    },
    { 
      id: 'performance', 
      name: 'Performance', 
      icon: Zap, 
      color: 'text-cyan-500',
      description: 'Optimize code performance'
    },
    { 
      id: 'techstack', 
      name: 'Tech Stack', 
      icon: Package, 
      color: 'text-indigo-500',
      description: 'Get tech stack recommendations'
    },
    { 
      id: 'api-docs', 
      name: 'API Docs', 
      icon: FileText, 
      color: 'text-pink-500',
      description: 'Generate API documentation'
    },
  ];

  const renderTool = () => {
    switch (activeTab) {
      case 'chat':
        return <LiveChatAssistant />;
      case 'review':
        return <CodeReviewTool />;
      case 'snippet':
        return <CodeSnippetGenerator />;
      case 'sql':
        return <SQLQueryGenerator />;
      case 'regex':
        return <RegexGenerator />;
      case 'bugs':
        return <BugDetector />;
      case 'security':
        return <SecurityScanner />;
      case 'performance':
        return <PerformanceOptimizer />;
      case 'techstack':
        return <TechStackAdvisor />;
      case 'api-docs':
        return <APIDocGenerator />;
      default:
        return <LiveChatAssistant />;
    }
  };

  return (
    <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-xl border-b ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-500'} shadow-xl`}>
              <Bot className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className={`text-4xl font-bold flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Developer Tools
                <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
              </h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2 text-lg`}>
                Powered by Google Gemini AI - Your intelligent coding companion 🚀
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Navigation */}
      <div className={`${isDarkMode ? 'bg-gray-800/30' : 'bg-white/60'} backdrop-blur-xl border-b ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} sticky top-16 z-10 shadow-md`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto py-5 scrollbar-hide">
            {tools.map(tool => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap 
                    transition-all duration-200 transform hover:scale-105 ${
                      activeTab === tool.id
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/30'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl shadow-blue-400/40'
                        : isDarkMode
                          ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:shadow-lg'
                          : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-lg border border-gray-200'
                    }`}
                  title={tool.description}
                >
                  <Icon className={`w-5 h-5 ${activeTab === tool.id ? 'text-white' : tool.color}`} />
                  {tool.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tool Content */}
      <div className="py-8">
        {renderTool()}
      </div>
    </div>
  );
};

export default AIDevTools;
