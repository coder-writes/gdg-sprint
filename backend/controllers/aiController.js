import geminiService from '../services/geminiService.js';

// Code Review
export const reviewCode = async (req, res) => {
  try {
    const { code, language, context } = req.body;

    if (!code || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code and language are required' 
      });
    }

    const review = await geminiService.reviewCode(code, language, context);
    
    res.json({ 
      success: true, 
      review,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in reviewCode:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to review code' 
    });
  }
};

// Bug Detection
export const detectBugs = async (req, res) => {
  try {
    const { code, language, errorMessage } = req.body;

    if (!code || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code and language are required' 
      });
    }

    const analysis = await geminiService.detectBugs(code, language, errorMessage);
    
    res.json({ 
      success: true, 
      analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in detectBugs:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to detect bugs' 
    });
  }
};

// Explain Code
export const explainCode = async (req, res) => {
  try {
    const { code, language, level } = req.body;

    if (!code || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code and language are required' 
      });
    }

    const explanation = await geminiService.explainCode(
      code, 
      language, 
      level || 'intermediate'
    );
    
    res.json({ 
      success: true, 
      explanation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in explainCode:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to explain code' 
    });
  }
};

// Generate Documentation
export const generateDocumentation = async (req, res) => {
  try {
    const { code, language, docStyle } = req.body;

    if (!code || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code and language are required' 
      });
    }

    const documentation = await geminiService.generateDocumentation(
      code, 
      language, 
      docStyle || 'JSDoc'
    );
    
    res.json({ 
      success: true, 
      documentation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in generateDocumentation:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate documentation' 
    });
  }
};

// Refactor Code
export const refactorCode = async (req, res) => {
  try {
    const { code, language, goals } = req.body;

    if (!code || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code and language are required' 
      });
    }

    const refactored = await geminiService.refactorCode(
      code, 
      language, 
      goals || []
    );
    
    res.json({ 
      success: true, 
      refactored,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in refactorCode:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to refactor code' 
    });
  }
};

// Generate Tests
export const generateTests = async (req, res) => {
  try {
    const { code, language, framework } = req.body;

    if (!code || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code and language are required' 
      });
    }

    const tests = await geminiService.generateTests(
      code, 
      language, 
      framework || ''
    );
    
    res.json({ 
      success: true, 
      tests,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in generateTests:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate tests' 
    });
  }
};

// Code Completion/Suggestion
export const suggestCode = async (req, res) => {
  try {
    const { partialCode, language, context } = req.body;

    if (!partialCode || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Partial code and language are required' 
      });
    }

    const suggestion = await geminiService.suggestCode(
      partialCode, 
      language, 
      context || ''
    );
    
    res.json({ 
      success: true, 
      suggestion,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in suggestCode:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to suggest code' 
    });
  }
};

// SQL Query Generator
export const generateSQLQuery = async (req, res) => {
  try {
    const { description, schema, dialect } = req.body;

    if (!description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Description is required' 
      });
    }

    const query = await geminiService.generateSQLQuery(
      description, 
      schema || '', 
      dialect || 'PostgreSQL'
    );
    
    res.json({ 
      success: true, 
      query,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in generateSQLQuery:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate SQL query' 
    });
  }
};

// Regex Generator
export const generateRegex = async (req, res) => {
  try {
    const { description, examples, testCases } = req.body;

    if (!description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Description is required' 
      });
    }

    const regex = await geminiService.generateRegex(
      description, 
      examples || [], 
      testCases || []
    );
    
    res.json({ 
      success: true, 
      regex,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in generateRegex:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate regex' 
    });
  }
};

// API Documentation Helper
export const generateAPIDocumentation = async (req, res) => {
  try {
    const { endpoint, method, requestBody, responseBody } = req.body;

    if (!endpoint || !method) {
      return res.status(400).json({ 
        success: false, 
        message: 'Endpoint and method are required' 
      });
    }

    const documentation = await geminiService.generateAPIDocumentation(
      endpoint, 
      method, 
      requestBody || '', 
      responseBody || ''
    );
    
    res.json({ 
      success: true, 
      documentation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in generateAPIDocumentation:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate API documentation' 
    });
  }
};

// Architecture Advisor
export const suggestArchitecture = async (req, res) => {
  try {
    const { projectDescription, requirements, constraints } = req.body;

    if (!projectDescription) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project description is required' 
      });
    }

    const architecture = await geminiService.suggestArchitecture(
      projectDescription, 
      requirements || [], 
      constraints || []
    );
    
    res.json({ 
      success: true, 
      architecture,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in suggestArchitecture:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to suggest architecture' 
    });
  }
};

// Performance Optimization
export const optimizePerformance = async (req, res) => {
  try {
    const { code, language, performanceMetrics } = req.body;

    if (!code || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code and language are required' 
      });
    }

    const optimization = await geminiService.optimizePerformance(
      code, 
      language, 
      performanceMetrics || ''
    );
    
    res.json({ 
      success: true, 
      optimization,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in optimizePerformance:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to optimize performance' 
    });
  }
};

// Security Vulnerability Scanner
export const scanSecurity = async (req, res) => {
  try {
    const { code, language, framework } = req.body;

    if (!code || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code and language are required' 
      });
    }

    const securityReport = await geminiService.scanSecurity(
      code, 
      language, 
      framework || ''
    );
    
    res.json({ 
      success: true, 
      securityReport,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in scanSecurity:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to scan security' 
    });
  }
};

// Code Converter
export const convertCode = async (req, res) => {
  try {
    const { code, fromLanguage, toLanguage } = req.body;

    if (!code || !fromLanguage || !toLanguage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code, fromLanguage, and toLanguage are required' 
      });
    }

    const converted = await geminiService.convertCode(
      code, 
      fromLanguage, 
      toLanguage
    );
    
    res.json({ 
      success: true, 
      converted,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in convertCode:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to convert code' 
    });
  }
};

// Tech Stack Advisor
export const adviseTechStack = async (req, res) => {
  try {
    const { projectType, requirements, teamSize } = req.body;

    if (!projectType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project type is required' 
      });
    }

    const advice = await geminiService.adviseTechStack(
      projectType, 
      requirements || [], 
      teamSize || 'small'
    );
    
    res.json({ 
      success: true, 
      advice,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in adviseTechStack:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to advise tech stack' 
    });
  }
};

// Generate Code Snippet
export const generateSnippet = async (req, res) => {
  try {
    const { description, language, style } = req.body;

    if (!description || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Description and language are required' 
      });
    }

    const snippet = await geminiService.generateSnippet(
      description, 
      language, 
      style || 'modern'
    );
    
    res.json({ 
      success: true, 
      snippet,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in generateSnippet:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate snippet' 
    });
  }
};

// Code Smell Detector
export const detectCodeSmells = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code and language are required' 
      });
    }

    const smells = await geminiService.detectCodeSmells(code, language);
    
    res.json({ 
      success: true, 
      smells,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in detectCodeSmells:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to detect code smells' 
    });
  }
};

// Git Commit Message Generator
export const generateCommitMessage = async (req, res) => {
  try {
    const { diff, style } = req.body;

    if (!diff) {
      return res.status(400).json({ 
        success: false, 
        message: 'Git diff is required' 
      });
    }

    const commitMessage = await geminiService.generateCommitMessage(
      diff, 
      style || 'conventional'
    );
    
    res.json({ 
      success: true, 
      commitMessage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in generateCommitMessage:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate commit message' 
    });
  }
};

// Algorithm Explainer
export const explainAlgorithm = async (req, res) => {
  try {
    const { algorithmName, includeCode, language } = req.body;

    if (!algorithmName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Algorithm name is required' 
      });
    }

    const explanation = await geminiService.explainAlgorithm(
      algorithmName, 
      includeCode !== false, 
      language || 'JavaScript'
    );
    
    res.json({ 
      success: true, 
      explanation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in explainAlgorithm:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to explain algorithm' 
    });
  }
};

// AI Chat
export const chat = async (req, res) => {
  try {
    const { message, history, systemPrompt } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    const response = await geminiService.chat(
      message, 
      history || [], 
      systemPrompt
    );
    
    res.json({ 
      success: true, 
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to process chat' 
    });
  }
};

// Stream Chat (for real-time responses)
export const streamChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullResponse = '';

    await geminiService.streamChat(
      message, 
      history || [], 
      (chunk) => {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ chunk, done: false })}\n\n`);
      }
    );

    res.write(`data: ${JSON.stringify({ chunk: '', done: true, fullResponse })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Error in streamChat:', error);
    res.write(`data: ${JSON.stringify({ error: error.message, done: true })}\n\n`);
    res.end();
  }
};
