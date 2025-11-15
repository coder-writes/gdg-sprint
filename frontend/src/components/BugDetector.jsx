import { useState, useContext } from 'react';
import { AppContent } from '../contexts/AppContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Bug, Sparkles, Copy, Download, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const BugDetector = () => {
  const { backendUrl } = useContext(AppContent);
  const { isDarkMode } = useDarkMode();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [errorMessage, setErrorMessage] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'
  ];

  const handleDetect = async () => {
    if (!code.trim()) {
      toast.error('Please enter code to analyze');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/ai/code/bugs`, {
        code,
        language,
        errorMessage
      });

      if (response.data.success) {
        setAnalysis(response.data.analysis);
        toast.success('Bug analysis completed!');
      }
    } catch (error) {
      console.error('Error detecting bugs:', error);
      toast.error(error.response?.data?.message || 'Failed to detect bugs');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadAnalysis = () => {
    const blob = new Blob([analysis], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bug-analysis-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analysis downloaded!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-700/30' : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'}`}>
        <h1 className={`text-3xl font-bold flex items-center gap-3 mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-red-600' : 'bg-gradient-to-br from-red-500 to-pink-500'} shadow-lg`}>
            <Bug className="text-white w-7 h-7" />
          </div>
          Bug Detector & Fixer
        </h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
          🐛 Identify bugs, get root cause analysis, and receive step-by-step fixes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${
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
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Error Message (Optional)
            </label>
            <input
              type="text"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              placeholder="e.g., TypeError: Cannot read property 'map' of undefined"
              className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Code to Analyze</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your buggy code here..."
              className={`w-full h-96 p-4 rounded-xl font-mono text-sm focus:ring-2 focus:ring-red-500 transition-all resize-none ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'
              }`}
            />
          </div>

          <button
            onClick={handleDetect}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg ${
                       isDarkMode
                         ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
                         : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                     } text-white`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing Bugs...
              </>
            ) : (
              <>
                <Bug className="w-5 h-5" />
                Detect & Fix Bugs
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bug Analysis</label>
            {analysis && (
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(analysis)}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Copy analysis"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadAnalysis}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Download analysis"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAnalysis('')}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Clear analysis"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className={`h-[550px] rounded-xl overflow-y-auto shadow-lg ${
            isDarkMode 
              ? 'border border-gray-600 bg-gray-800/50' 
              : 'border border-gray-300 bg-white'
          }`}>
            {analysis ? (
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
                  {analysis}
                </ReactMarkdown>
              </div>
            ) : (
              <div className={`h-full flex flex-col items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className={`p-6 rounded-full ${isDarkMode ? 'bg-red-900/20' : 'bg-gradient-to-br from-red-100 to-pink-100'} mb-4`}>
                  <Bug className={`w-16 h-16 ${isDarkMode ? 'text-red-500/30' : 'text-red-500'}`} />
                </div>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bug analysis will appear here</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Paste code to detect and fix bugs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugDetector;
