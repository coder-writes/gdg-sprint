import { useState, useContext } from 'react';
import { AppContent } from '../contexts/AppContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { FileCode, Sparkles, Copy, Download, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeSnippetGenerator = () => {
  const { backendUrl } = useContext(AppContent);
  const { isDarkMode } = useDarkMode();
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [style, setStyle] = useState('modern');
  const [snippet, setSnippet] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'
  ];

  const styles = ['modern', 'functional', 'object-oriented', 'minimal', 'verbose'];

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/ai/snippet/generate`, {
        description,
        language,
        style
      });

      if (response.data.success) {
        setSnippet(response.data.snippet);
        toast.success('Snippet generated!');
      }
    } catch (error) {
      console.error('Error generating snippet:', error);
      toast.error(error.response?.data?.message || 'Failed to generate snippet');
    } finally {
      setLoading(false);
    }
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(snippet);
    toast.success('Copied to clipboard!');
  };

  const downloadSnippet = () => {
    const fileExtensions = {
      javascript: 'js', typescript: 'ts', python: 'py', java: 'java',
      cpp: 'cpp', csharp: 'cs', go: 'go', rust: 'rs',
      php: 'php', ruby: 'rb', swift: 'swift', kotlin: 'kt'
    };

    const ext = fileExtensions[language] || 'txt';
    const blob = new Blob([snippet], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snippet-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Snippet downloaded!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-700/30' : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'}`}>
        <h1 className={`text-3xl font-bold flex items-center gap-3 mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-purple-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'} shadow-lg`}>
            <FileCode className="text-white w-7 h-7" />
          </div>
          Code Snippet Generator
        </h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
          ⚡ Generate production-ready code snippets from natural language descriptions
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Programming Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all ${
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
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Coding Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white' 
                  : 'border border-gray-300 bg-white text-gray-900 shadow-sm'
              }`}
            >
              {styles.map(s => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            What do you want to create?
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A function to debounce user input, An API client with retry logic, A custom React hook for form validation..."
            className={`w-full h-32 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all resize-none ${
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
                       ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                       : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                   } text-white`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Snippet...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Snippet
            </>
          )}
        </button>
      </div>

      {/* Output Section */}
      {snippet && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <label className={`block text-lg font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Generated Snippet</label>
            <div className="flex gap-2">
              <button
                onClick={copySnippet}
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
                onClick={downloadSnippet}
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
                onClick={() => setSnippet('')}
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
                        customStyle={{ margin: 0, borderRadius: '0.5rem' }}
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
                {snippet}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeSnippetGenerator;
