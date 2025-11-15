import { useState, useContext } from 'react';
import { AppContent } from '../contexts/AppContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Code2, Sparkles, Send, Copy, Download, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeReviewTool = () => {
  const { backendUrl } = useContext(AppContent);
  const { isDarkMode } = useDarkMode();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [context, setContext] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'html', 'css'
  ];

  const handleReview = async () => {
    if (!code.trim()) {
      toast.error('Please enter code to review');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/ai/code/review`, {
        code,
        language,
        context
      });

      if (response.data.success) {
        setReview(response.data.review);
        toast.success('Code review completed!');
      }
    } catch (error) {
      console.error('Error reviewing code:', error);
      toast.error(error.response?.data?.message || 'Failed to review code');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadReview = () => {
    const blob = new Blob([review], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-review-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Review downloaded!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold flex items-center gap-2 mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Code2 className={isDarkMode ? 'text-blue-400' : 'text-blue-500'} />
          AI Code Reviewer
        </h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Get expert code review, quality assessment, and refactoring suggestions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Programming Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white' 
                  : 'border border-gray-300 bg-white text-gray-900'
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
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Context (Optional)
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., Authentication function, API endpoint, etc."
              className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className={`w-full h-96 p-4 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 transition-all ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          <button
            onClick={handleReview}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg ${
                       isDarkMode
                         ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                         : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                     } text-white`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Reviewing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Review Code
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Review Results</label>
            {review && (
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(review)}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Copy review"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadReview}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Download review"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setReview('')}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Clear review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className={`h-[550px] rounded-xl overflow-y-auto shadow-lg ${
            isDarkMode 
              ? 'border border-gray-600 bg-gray-800' 
              : 'border border-gray-300 bg-white'
          }`}>
            {review ? (
              <div className={`p-4 prose ${isDarkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
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
                  {review}
                </ReactMarkdown>
              </div>
            ) : (
              <div className={`h-full flex flex-col items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Code2 className={`w-16 h-16 mb-4 ${isDarkMode ? 'opacity-20' : 'text-blue-200'}`} />
                <p>Review results will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeReviewTool;
