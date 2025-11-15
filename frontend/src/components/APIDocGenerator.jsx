import { useState, useContext } from 'react';
import { AppContent } from '../contexts/AppContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { FileText, Sparkles, Copy, Download, Trash2, Globe } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const APIDocGenerator = () => {
  const { backendUrl } = useContext(AppContent);
  const { isDarkMode } = useDarkMode();
  const [endpoint, setEndpoint] = useState('');
  const [method, setMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('');
  const [responseBody, setResponseBody] = useState('');
  const [documentation, setDocumentation] = useState('');
  const [loading, setLoading] = useState(false);

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  const handleGenerate = async () => {
    if (!endpoint.trim()) {
      toast.error('Please enter an endpoint');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/ai/api/documentation`, {
        endpoint,
        method,
        requestBody,
        responseBody
      });

      if (response.data.success) {
        setDocumentation(response.data.documentation);
        toast.success('API documentation generated!');
      }
    } catch (error) {
      console.error('Error generating docs:', error);
      toast.error(error.response?.data?.message || 'Failed to generate documentation');
    } finally {
      setLoading(false);
    }
  };

  const copyDocumentation = () => {
    navigator.clipboard.writeText(documentation);
    toast.success('Copied to clipboard!');
  };

  const downloadDocumentation = () => {
    const blob = new Blob([documentation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-documentation-${endpoint.replace(/\//g, '-')}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Documentation downloaded!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-pink-900/20 to-rose-900/20 border border-pink-700/30' : 'bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200'}`}>
        <h1 className={`text-3xl font-bold flex items-center gap-3 mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-pink-600' : 'bg-gradient-to-br from-pink-500 to-rose-500'} shadow-lg`}>
            <FileText className="text-white w-7 h-7" />
          </div>
          API Documentation Generator
        </h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
          📚 Generate comprehensive API documentation with examples and schemas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Globe className="w-4 h-4 text-pink-500" />
                API Endpoint
              </label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="/api/users/:id"
                className={`w-full p-3 rounded-xl font-mono focus:ring-2 focus:ring-pink-500 transition-all ${isDarkMode ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-pink-500 transition-all ${isDarkMode ? 'border border-gray-600 bg-gray-800 text-white' : 'border border-gray-300 bg-white text-gray-900 shadow-sm'}`}
              >
                {methods.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Request Body Schema (JSON, Optional)
            </label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder={`{
  "name": "string",
  "email": "string",
  "age": "number"
}`}
              className={`w-full h-48 p-4 rounded-xl font-mono text-sm focus:ring-2 focus:ring-pink-500 transition-all resize-none ${isDarkMode ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Response Body Schema (JSON, Optional)
            </label>
            <textarea
              value={responseBody}
              onChange={(e) => setResponseBody(e.target.value)}
              placeholder={`{
  "id": "string",
  "name": "string",
  "email": "string",
  "createdAt": "string"
}`}
              className={`w-full h-48 p-4 rounded-xl font-mono text-sm focus:ring-2 focus:ring-pink-500 transition-all resize-none ${isDarkMode ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'}`}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg ${isDarkMode ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} text-white`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Documentation...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Documentation
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Generated Documentation</label>
            {documentation && (
              <div className="flex gap-2">
                <button
                  onClick={copyDocumentation}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Copy documentation"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadDocumentation}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Download documentation"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDocumentation('')}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Clear documentation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className={`h-[630px] rounded-xl overflow-y-auto shadow-lg ${isDarkMode ? 'border border-gray-600 bg-gray-800/50' : 'border border-gray-300 bg-white'}`}>
            {documentation ? (
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
                  {documentation}
                </ReactMarkdown>
              </div>
            ) : (
              <div className={`h-full flex flex-col items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className={`p-6 rounded-full ${isDarkMode ? 'bg-pink-900/20' : 'bg-gradient-to-br from-pink-100 to-rose-100'} mb-4`}>
                  <FileText className={`w-16 h-16 ${isDarkMode ? 'text-pink-500/30' : 'text-pink-500'}`} />
                </div>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>API documentation will appear here</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Enter an endpoint to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocGenerator;
