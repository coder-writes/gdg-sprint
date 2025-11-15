import { useState, useContext } from 'react';
import { AppContent } from '../contexts/AppContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Regex, Sparkles, Copy, TestTube, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const RegexGenerator = () => {
  const { backendUrl } = useContext(AppContent);
  const { isDarkMode } = useDarkMode();
  const [description, setDescription] = useState('');
  const [examples, setExamples] = useState('');
  const [testCases, setTestCases] = useState('');
  const [regex, setRegex] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);
    try {
      const examplesArray = examples.split('\n').filter(e => e.trim());
      const testCasesArray = testCases.split('\n').filter(t => t.trim());

      const response = await axios.post(`${backendUrl}/api/ai/regex/generate`, {
        description,
        examples: examplesArray,
        testCases: testCasesArray
      });

      if (response.data.success) {
        setRegex(response.data.regex);
        toast.success('Regex generated!');
      }
    } catch (error) {
      console.error('Error generating regex:', error);
      toast.error(error.response?.data?.message || 'Failed to generate regex');
    } finally {
      setLoading(false);
    }
  };

  const copyRegex = () => {
    navigator.clipboard.writeText(regex);
    toast.success('Copied to clipboard!');
  };

  const downloadRegex = () => {
    const blob = new Blob([regex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `regex-pattern-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Pattern downloaded!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-orange-900/20 to-amber-900/20 border border-orange-700/30' : 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200'}`}>
        <h1 className={`text-3xl font-bold flex items-center gap-3 mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-orange-600' : 'bg-gradient-to-br from-orange-500 to-amber-500'} shadow-lg`}>
            <Regex className="text-white w-7 h-7" />
          </div>
          Regex Pattern Generator
        </h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
          🔍 Generate and test regular expressions with AI-powered pattern matching
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Pattern Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Match valid email addresses, Extract phone numbers in (123) 456-7890 format, Validate strong passwords..."
            className={`w-full h-32 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all resize-none ${
              isDarkMode 
                ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'
            }`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Examples to Match (one per line)
            </label>
            <textarea
              value={examples}
              onChange={(e) => setExamples(e.target.value)}
              placeholder={`user@example.com
john.doe@company.co.uk
admin@subdomain.site.org`}
              className={`w-full h-40 p-4 rounded-xl font-mono text-sm focus:ring-2 focus:ring-orange-500 transition-all resize-none ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'
              }`}
            />
          </div>

          <div>
            <label className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <TestTube className="w-4 h-4 text-red-500" />
              Test Cases (should NOT match)
            </label>
            <textarea
              value={testCases}
              onChange={(e) => setTestCases(e.target.value)}
              placeholder={`invalid@email
not-an-email
@example.com`}
              className={`w-full h-40 p-4 rounded-xl font-mono text-sm focus:ring-2 focus:ring-orange-500 transition-all resize-none ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'
              }`}
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg ${
                     isDarkMode
                       ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'
                       : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
                   } text-white`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Pattern...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Regex Pattern
            </>
          )}
        </button>
      </div>

      {/* Output Section */}
      {regex && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <label className={`block text-lg font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Generated Pattern</label>
            <div className="flex gap-2">
              <button
                onClick={copyRegex}
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
                onClick={downloadRegex}
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
                onClick={() => setRegex('')}
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
            <div className={`p-6 ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <div className={`prose ${isDarkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
                <ReactMarkdown>
                  {regex}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegexGenerator;
