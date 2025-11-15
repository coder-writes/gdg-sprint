import { useState, useContext } from 'react';
import { AppContent } from '../contexts/AppContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Database, Sparkles, Copy, Download, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SQLQueryGenerator = () => {
  const { backendUrl } = useContext(AppContent);
  const { isDarkMode } = useDarkMode();
  const [description, setDescription] = useState('');
  const [schema, setSchema] = useState('');
  const [dialect, setDialect] = useState('PostgreSQL');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const dialects = ['PostgreSQL', 'MySQL', 'SQLite', 'SQL Server', 'Oracle'];

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/ai/sql/generate`, {
        description,
        schema,
        dialect
      });

      if (response.data.success) {
        setQuery(response.data.query);
        toast.success('SQL query generated!');
      }
    } catch (error) {
      console.error('Error generating SQL:', error);
      toast.error(error.response?.data?.message || 'Failed to generate SQL query');
    } finally {
      setLoading(false);
    }
  };

  const copyQuery = () => {
    navigator.clipboard.writeText(query);
    toast.success('Copied to clipboard!');
  };

  const downloadQuery = () => {
    const blob = new Blob([query], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Query downloaded!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-700/30' : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'}`}>
        <h1 className={`text-3xl font-bold flex items-center gap-3 mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-green-600' : 'bg-gradient-to-br from-green-500 to-emerald-500'} shadow-lg`}>
            <Database className="text-white w-7 h-7" />
          </div>
          SQL Query Generator
        </h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
          💾 Generate optimized SQL queries from natural language descriptions
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>SQL Dialect</label>
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value)}
            className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-green-500 transition-all ${
              isDarkMode 
                ? 'border border-gray-600 bg-gray-800 text-white' 
                : 'border border-gray-300 bg-white text-gray-900 shadow-sm'
            }`}
          >
            {dialects.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Query Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Get all users who have made purchases in the last 30 days, ordered by total spend"
            className={`w-full h-32 p-4 rounded-xl focus:ring-2 focus:ring-green-500 transition-all resize-none ${
              isDarkMode 
                ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Database Schema (Optional)
          </label>
          <textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            placeholder={`e.g., 
users (id, name, email, created_at)
orders (id, user_id, amount, created_at)
products (id, name, price)`}
            className={`w-full h-32 p-4 rounded-xl font-mono text-sm focus:ring-2 focus:ring-green-500 transition-all resize-none ${
              isDarkMode 
                ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'
            }`}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg ${
                     isDarkMode
                       ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                       : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                   } text-white`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating SQL...
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              Generate SQL Query
            </>
          )}
        </button>
      </div>

      {query && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <label className={`block text-lg font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Generated Query</label>
            <div className="flex gap-2">
              <button
                onClick={copyQuery}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-sm'
                }`}
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={downloadQuery}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-sm'
                }`}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => setQuery('')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-sm'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>

          <div className={`rounded-xl overflow-hidden shadow-lg ${
            isDarkMode ? 'border border-gray-600' : 'border border-gray-300'
          }`}>
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
                {query}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SQLQueryGenerator;
