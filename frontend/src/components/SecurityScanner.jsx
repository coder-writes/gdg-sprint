import { useState, useContext } from 'react';
import { AppContent } from '../contexts/AppContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Shield, Sparkles, AlertTriangle, Copy, Download, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SecurityScanner = () => {
  const { backendUrl } = useContext(AppContent);
  const { isDarkMode } = useDarkMode();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [framework, setFramework] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'sql'
  ];

  const handleScan = async () => {
    if (!code.trim()) {
      toast.error('Please enter code to scan');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/ai/security/scan`, {
        code,
        language,
        framework
      });

      if (response.data.success) {
        setReport(response.data.securityReport);
        toast.success('Security scan completed!');
      }
    } catch (error) {
      console.error('Error scanning security:', error);
      toast.error(error.response?.data?.message || 'Failed to scan security');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-700/30' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200'}`}>
        <h1 className={`text-3xl font-bold flex items-center gap-3 mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-yellow-600' : 'bg-gradient-to-br from-yellow-500 to-orange-500'} shadow-lg`}>
            <Shield className="text-white w-7 h-7" />
          </div>
          Security Vulnerability Scanner
        </h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
          🔒 Identify security vulnerabilities, get OWASP compliance checks, and receive remediation advice
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all ${
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
                Framework (Optional)
              </label>
              <input
                type="text"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                placeholder="e.g., Express, Django..."
                className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all ${
                  isDarkMode 
                    ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                    : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Code to Scan</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here for security analysis..."
              className={`w-full h-[450px] p-4 rounded-xl font-mono text-sm focus:ring-2 focus:ring-yellow-500 transition-all resize-none ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'
              }`}
            />
          </div>

          <button
            onClick={handleScan}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg ${
                       isDarkMode
                         ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
                         : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                     } text-white`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Scanning for Vulnerabilities...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Scan for Vulnerabilities
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Security Report</label>
            {report && (
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(report)}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Copy report"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadReport}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Download report"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setReport('')}
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
            {report ? (
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
                  {report}
                </ReactMarkdown>
              </div>
            ) : (
              <div className={`h-full flex flex-col items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className={`p-6 rounded-full ${isDarkMode ? 'bg-yellow-900/20' : 'bg-gradient-to-br from-yellow-100 to-orange-100'} mb-4`}>
                  <AlertTriangle className={`w-16 h-16 ${isDarkMode ? 'text-yellow-500/30' : 'text-yellow-500'}`} />
                </div>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Security report will appear here</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Scan your code to detect vulnerabilities</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityScanner;
