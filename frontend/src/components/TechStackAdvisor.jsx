import { useState, useContext } from 'react';
import { AppContent } from '../contexts/AppContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Package, Sparkles, Copy, Download, Trash2, Users, Code2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TechStackAdvisor = () => {
  const { backendUrl } = useContext(AppContent);
  const { isDarkMode } = useDarkMode();
  const [projectType, setProjectType] = useState('');
  const [requirements, setRequirements] = useState('');
  const [teamSize, setTeamSize] = useState('small');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const projectTypes = [
    'Web Application',
    'Mobile App',
    'REST API',
    'GraphQL API',
    'Microservices',
    'E-commerce Platform',
    'Social Media App',
    'Real-time Chat App',
    'Dashboard/Analytics',
    'CMS',
    'Machine Learning Project',
    'IoT Application',
    'Desktop Application'
  ];

  const teamSizes = ['small', 'medium', 'large'];

  const handleAdvise = async () => {
    if (!projectType) {
      toast.error('Please select a project type');
      return;
    }

    setLoading(true);
    try {
      const reqArray = requirements.split('\n').filter(r => r.trim());

      const response = await axios.post(`${backendUrl}/api/ai/techstack/advise`, {
        projectType,
        requirements: reqArray,
        teamSize
      });

      if (response.data.success) {
        setAdvice(response.data.advice);
        toast.success('Tech stack recommendation generated!');
      }
    } catch (error) {
      console.error('Error getting advice:', error);
      toast.error(error.response?.data?.message || 'Failed to get tech stack advice');
    } finally {
      setLoading(false);
    }
  };

  const copyAdvice = () => {
    navigator.clipboard.writeText(advice);
    toast.success('Copied to clipboard!');
  };

  const downloadAdvice = () => {
    const blob = new Blob([advice], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-stack-recommendations-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Recommendations downloaded!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-700/30' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200'}`}>
        <h1 className={`text-3xl font-bold flex items-center gap-3 mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-purple-500'} shadow-lg`}>
            <Package className="text-white w-7 h-7" />
          </div>
          Tech Stack Advisor
        </h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
          🚀 Get personalized technology stack recommendations for your project
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Code2 className="w-4 h-4 text-indigo-500" />
              Project Type
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white' 
                  : 'border border-gray-300 bg-white text-gray-900 shadow-sm'
              }`}
            >
              <option value="">Select project type...</option>
              {projectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Users className="w-4 h-4 text-indigo-500" />
              Team Size
            </label>
            <select
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white' 
                  : 'border border-gray-300 bg-white text-gray-900 shadow-sm'
              }`}
            >
              {teamSizes.map(size => (
                <option key={size} value={size}>
                  {size.charAt(0).toUpperCase() + size.slice(1)} (
                  {size === 'small' ? '1-5' : size === 'medium' ? '6-20' : '20+'} people)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Project Requirements (one per line)
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder={`e.g.,
Real-time updates
User authentication
File uploads
Payment processing
Mobile responsive`}
              className={`w-full h-96 p-4 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${
                isDarkMode 
                  ? 'border border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm'
              }`}
            />
          </div>

          <button
            onClick={handleAdvise}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg ${
                       isDarkMode
                         ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                         : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                     } text-white`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing Requirements...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Get Tech Stack Recommendation
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Technology Recommendations</label>
            {advice && (
              <div className="flex gap-2">
                <button
                  onClick={copyAdvice}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Copy recommendations"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadAdvice}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Download recommendations"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAdvice('')}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Clear recommendations"
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
            {advice ? (
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
                  {advice}
                </ReactMarkdown>
              </div>
            ) : (
              <div className={`h-full flex flex-col items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className={`p-6 rounded-full ${isDarkMode ? 'bg-indigo-900/20' : 'bg-gradient-to-br from-indigo-100 to-purple-100'} mb-4`}>
                  <Package className={`w-16 h-16 ${isDarkMode ? 'text-indigo-500/30' : 'text-indigo-500'}`} />
                </div>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tech stack recommendations will appear here</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Describe your project to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStackAdvisor;
