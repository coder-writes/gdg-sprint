import { useState, useContext } from 'react';
import { AppContent } from '../contexts/AppContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Zap, Sparkles, Copy, Download, Trash2, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PerformanceOptimizer = () => {
  const { backendUrl } = useContext(AppContent);
  const { isDarkMode } = useDarkMode();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [metrics, setMetrics] = useState('');
  const [optimization, setOptimization] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'
  ];

  const handleOptimize = async () => {
    if (!code.trim()) {
      toast.error('Please enter code to optimize');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/ai/performance/optimize`, {
        code,
        language,
        performanceMetrics: metrics
      });

      if (response.data.success) {
        setOptimization(response.data.optimization);
        toast.success('Performance analysis completed!');
      }
    } catch (error) {
      console.error('Error optimizing:', error);
      toast.error(error.response?.data?.message || 'Failed to optimize performance');
    } finally {
      setLoading(false);
    }
  };

  const copyOptimization = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadOptimization = () => {
    const blob = new Blob([optimization], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-optimization-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Optimization report downloaded!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-700/30' : 'bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200'}`}>
        <h1 className={`text-3xl font-bold flex items-center gap-3 mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-cyan-600' : 'bg-gradient-to-br from-cyan-500 to-blue-500'} shadow-lg`}>
            <Zap className="text-white w-7 h-7" />
          </div>
          Performance Optimizer
        </h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
          ⚡ Analyze and optimize code performance with complexity analysis and benchmarking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Programming Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 transition-all ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white' 
                  : 'border border-gray-300 bg-white text-gray-900 shadow-sm'
              }`}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <TrendingUp className="w-4 h-4 text-cyan-500" />
              Current Performance Metrics (Optional)
            </label>
            <textarea
              value={metrics}
              onChange={(e) => setMetrics(e.target.value)}
              placeholder="e.g., Execution time: 2.5s, Memory usage: 150MB, Database queries: 25..."
              className={`w-full h-24 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 transition-all resize-none ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Code to Optimize</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here for performance analysis..."
              className={`w-full h-80 p-4 rounded-xl font-mono text-sm focus:ring-2 focus:ring-cyan-500 transition-all resize-none ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'
              }`}
            />
          </div>

          <button
            onClick={handleOptimize}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg ${
                       isDarkMode
                         ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
                         : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
                     } text-white`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing Performance...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Optimize Performance
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Optimization Report</label>
            {optimization && (
              <div className="flex gap-2">
                <button
                  onClick={() => copyOptimization(optimization)}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Copy report"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadOptimization}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Download report"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOptimization('')}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Clear report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className={`h-[580px] rounded-xl overflow-y-auto shadow-lg ${
            isDarkMode 
              ? 'border border-gray-600 bg-gray-800/50' 
              : 'border border-gray-300 bg-white'
          }`}>
            {optimization ? (
              <div className={`p-6 prose ${isDarkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
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
                  {optimization}
                </ReactMarkdown>
              </div>
            ) : (
              <div className={`h-full flex flex-col items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className={`p-6 rounded-full ${isDarkMode ? 'bg-cyan-900/20' : 'bg-gradient-to-br from-cyan-100 to-blue-100'} mb-4`}>
                  <Zap className={`w-16 h-16 ${isDarkMode ? 'text-cyan-500/30' : 'text-cyan-500'}`} />
                </div>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Optimization suggestions will appear here</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Paste code to analyze performance</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimizer;
