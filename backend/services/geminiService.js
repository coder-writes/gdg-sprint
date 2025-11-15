import { GoogleGenAI } from '@google/genai';

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY not found in environment variables');
    }
    this.genAI = this.apiKey ? new GoogleGenAI({ apiKey: this.apiKey }) : null;
  }

  // Helper method to generate content
  async generateContent(prompt, modelName = 'gemini-2.0-flash-exp', config = {}) {
    if (!this.genAI) {
      throw new Error('Gemini API not initialized. Please set GEMINI_API_KEY in environment variables.');
    }

    const response = await this.genAI.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        temperature: config.temperature || 0.7,
        topP: config.topP || 0.8,
        topK: config.topK || 40,
        maxOutputTokens: config.maxOutputTokens || 8192,
        ...config,
      },
    });

    return response.text;
  }

  // Code Review functionality
  async reviewCode(code, language, context = '') {
    const prompt = `You are an expert code reviewer. Analyze the following ${language} code and provide:
1. Code quality assessment (rating 1-10)
2. Potential bugs or issues
3. Security vulnerabilities
4. Performance optimization suggestions
5. Best practices violations
6. Refactoring recommendations

${context ? `Context: ${context}` : ''}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide detailed, actionable feedback in a structured format.`;

    return await this.generateContent(prompt);
  }

  // Bug Detection
  async detectBugs(code, language, errorMessage = '') {
    const prompt = `You are an expert debugger. Analyze this ${language} code for bugs and potential issues.

${errorMessage ? `Error Message: ${errorMessage}\n` : ''}
Code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. Identified bugs with line references
2. Root cause analysis
3. Step-by-step fix instructions
4. Corrected code snippet
5. Prevention tips`;

    return await this.generateContent(prompt);
  }

  // Code Explanation
  async explainCode(code, language, level = 'intermediate') {
    const prompt = `Explain the following ${language} code for a ${level} level developer.

Code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. Overall purpose and functionality
2. Line-by-line explanation for complex parts
3. Key concepts used
4. Time and space complexity (if applicable)
5. Use cases and examples`;

    return await this.generateContent(prompt);
  }

  // Generate Documentation
  async generateDocumentation(code, language, docStyle = 'JSDoc') {
    const prompt = `Generate comprehensive ${docStyle} documentation for this ${language} code.

Code:
\`\`\`${language}
${code}
\`\`\`

Include:
1. Function/class descriptions
2. Parameter documentation
3. Return value documentation
4. Usage examples
5. Edge cases and error handling`;

    return await this.generateContent(prompt);
  }

  // Refactor Code
  async refactorCode(code, language, goals = []) {
    const goalsText = goals.length > 0 ? goals.join(', ') : 'better readability, performance, and maintainability';
    
    const prompt = `Refactor the following ${language} code focusing on: ${goalsText}

Original Code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. Refactored code
2. Explanation of changes made
3. Benefits of the refactoring
4. Any trade-offs`;

    return await this.generateContent(prompt);
  }

  // Generate Tests
  async generateTests(code, language, framework = '') {
    const frameworkText = framework ? `using ${framework}` : '';
    
    const prompt = `Generate comprehensive unit tests ${frameworkText} for this ${language} code.

Code:
\`\`\`${language}
${code}
\`\`\`

Include:
1. Test cases for normal scenarios
2. Edge cases
3. Error handling tests
4. Mock data setup (if needed)
5. Assertions and expected outcomes`;

    return await this.generateContent(prompt);
  }

  // Code Completion/Suggestion
  async suggestCode(partialCode, language, context = '') {
    const prompt = `Complete or suggest improvements for this ${language} code.

${context ? `Context: ${context}\n` : ''}
Partial Code:
\`\`\`${language}
${partialCode}
\`\`\`

Provide intelligent code completion or suggestions.`;

    return await this.generateContent(prompt, 'gemini-2.0-flash-exp', { temperature: 0.4 });
  }

  // SQL Query Generator
  async generateSQLQuery(description, schema = '', dialect = 'PostgreSQL') {
    const prompt = `Generate a ${dialect} SQL query based on this description: ${description}

${schema ? `Database Schema:\n${schema}\n` : ''}

Provide:
1. The SQL query
2. Explanation of the query
3. Expected result format
4. Potential optimizations
5. Index suggestions (if applicable)`;

    return await this.generateContent(prompt);
  }

  // Regex Generator
  async generateRegex(description, examples = [], testCases = []) {
    const examplesText = examples.length > 0 ? `\nExamples to match: ${examples.join(', ')}` : '';
    const testCasesText = testCases.length > 0 ? `\nTest cases: ${testCases.join(', ')}` : '';
    
    const prompt = `Generate a regular expression for: ${description}${examplesText}${testCasesText}

Provide:
1. The regex pattern
2. Explanation of each part
3. Flags to use
4. Test cases demonstrating matches
5. Common pitfalls to avoid`;

    return await this.generateContent(prompt);
  }

  // API Documentation Helper
  async generateAPIDocumentation(endpoint, method, requestBody = '', responseBody = '') {
    const prompt = `Generate comprehensive API documentation for:

Endpoint: ${endpoint}
Method: ${method}
${requestBody ? `Request Body:\n${requestBody}\n` : ''}
${responseBody ? `Response Body:\n${responseBody}\n` : ''}

Provide:
1. Endpoint description
2. Request parameters
3. Request body schema
4. Response schema
5. Status codes
6. Example requests (curl and code)
7. Error responses`;

    return await this.generateContent(prompt);
  }

  // Architecture Advisor
  async suggestArchitecture(projectDescription, requirements = [], constraints = []) {
    const reqText = requirements.length > 0 ? `\nRequirements: ${requirements.join(', ')}` : '';
    const constraintsText = constraints.length > 0 ? `\nConstraints: ${constraints.join(', ')}` : '';
    
    const prompt = `Suggest software architecture for:

Project: ${projectDescription}${reqText}${constraintsText}

Provide:
1. Recommended architecture pattern
2. Tech stack suggestions
3. System design diagram (in text/ASCII)
4. Database schema recommendations
5. Scalability considerations
6. Security best practices
7. Deployment strategy`;

    return await this.generateContent(prompt);
  }

  // Performance Optimization
  async optimizePerformance(code, language, performanceMetrics = '') {
    const prompt = `Analyze and optimize the performance of this ${language} code.

${performanceMetrics ? `Current Performance Metrics:\n${performanceMetrics}\n` : ''}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. Performance bottlenecks
2. Time complexity analysis
3. Space complexity analysis
4. Optimized version
5. Caching strategies
6. Algorithm improvements
7. Expected performance gains`;

    return await this.generateContent(prompt);
  }

  // Security Vulnerability Scanner
  async scanSecurity(code, language, framework = '') {
    const frameworkText = framework ? ` (${framework} framework)` : '';
    
    const prompt = `Perform a security audit on this ${language} code${frameworkText}.

Code:
\`\`\`${language}
${code}
\`\`\`

Identify:
1. Security vulnerabilities (SQL injection, XSS, CSRF, etc.)
2. Authentication/Authorization issues
3. Data exposure risks
4. Insecure dependencies
5. Input validation issues
6. Secure coding recommendations
7. OWASP Top 10 compliance`;

    return await this.generateContent(prompt);
  }

  // Code Converter
  async convertCode(code, fromLanguage, toLanguage) {
    const prompt = `Convert the following code from ${fromLanguage} to ${toLanguage}.

Original ${fromLanguage} Code:
\`\`\`${fromLanguage}
${code}
\`\`\`

Provide:
1. Converted ${toLanguage} code
2. Explanation of key differences
3. Idiomatic ${toLanguage} patterns used
4. Any caveats or considerations`;

    return await this.generateContent(prompt);
  }

  // Tech Stack Advisor
  async adviseTechStack(projectType, requirements = [], teamSize = 'small') {
    const reqText = requirements.length > 0 ? `\nRequirements: ${requirements.join(', ')}` : '';
    
    const prompt = `Recommend a tech stack for a ${projectType} project.

Team Size: ${teamSize}${reqText}

Provide:
1. Frontend framework/library recommendation
2. Backend framework recommendation
3. Database selection
4. DevOps tools
5. Testing frameworks
6. CI/CD tools
7. Monitoring and logging solutions
8. Pros and cons of each choice
9. Learning curve considerations
10. Cost analysis`;

    return await this.generateContent(prompt);
  }

  // AI Mentor Chat with History
  async chat(message, history = [], systemPrompt = null) {
    const defaultSystemPrompt = `You are an expert AI programming mentor and assistant for developers. You help with:
- Code review and debugging
- Algorithm and data structure guidance
- System design and architecture
- Best practices and design patterns
- Learning new technologies
- Problem-solving and optimization

Provide clear, actionable advice with code examples when helpful. Be encouraging and educational.`;

    // Format history for new API
    let contents = '';
    if (history.length > 0) {
      contents = history.map(msg => {
        const role = msg.role === 'assistant' ? 'Assistant' : 'User';
        return `${role}: ${msg.content}`;
      }).join('\n\n') + '\n\n';
    }
    
    const fullPrompt = (systemPrompt || defaultSystemPrompt) + '\n\n' + contents + `User: ${message}`;
    
    return await this.generateContent(fullPrompt);
  }

  // Stream response for real-time chat
  async streamChat(message, history = [], onChunk) {
    if (!this.genAI) {
      throw new Error('Gemini API not initialized. Please set GEMINI_API_KEY in environment variables.');
    }

    // Format history
    let contents = '';
    if (history.length > 0) {
      contents = history.map(msg => {
        const role = msg.role === 'assistant' ? 'Assistant' : 'User';
        return `${role}: ${msg.content}`;
      }).join('\n\n') + '\n\n';
    }
    
    const fullPrompt = contents + `User: ${message}`;

    try {
      const stream = await this.genAI.models.generateContentStream({
        model: 'gemini-2.0-flash-exp',
        contents: fullPrompt,
        config: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8192,
        },
      });

      let fullResponse = '';
      
      for await (const chunk of stream) {
        if (chunk.text) {
          fullResponse += chunk.text;
          if (onChunk) {
            onChunk(chunk.text);
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('Stream chat error:', error);
      throw error;
    }
  }

  // Generate Code Snippet
  async generateSnippet(description, language, style = 'modern') {
    const prompt = `Generate a ${style} ${language} code snippet for: ${description}

Provide:
1. Clean, production-ready code
2. Comments explaining key parts
3. Usage example
4. Any dependencies needed`;

    return await this.generateContent(prompt);
  }

  // Code Smell Detector
  async detectCodeSmells(code, language) {
    const prompt = `Detect code smells in this ${language} code.

Code:
\`\`\`${language}
${code}
\`\`\`

Identify:
1. Code smells present
2. Severity (Low/Medium/High)
3. Refactoring suggestions
4. Before/after examples`;

    return await this.generateContent(prompt);
  }

  // Git Commit Message Generator
  async generateCommitMessage(diff, style = 'conventional') {
    const prompt = `Generate a ${style} commit message for these changes:

${diff}

Follow ${style} commit style guidelines.`;

    return await this.generateContent(prompt, 'gemini-2.0-flash-exp', { temperature: 0.5 });
  }

  // Algorithm Explainer
  async explainAlgorithm(algorithmName, includeCode = true, language = 'JavaScript') {
    const codeText = includeCode ? `Include ${language} implementation.` : '';
    
    const prompt = `Explain the ${algorithmName} algorithm in detail.

Provide:
1. Concept and purpose
2. Step-by-step explanation
3. Time and space complexity
4. Advantages and disadvantages
5. Use cases
6. Visualization/diagram (text-based)
${codeText}`;

    return await this.generateContent(prompt);
  }
}

export default new GeminiService();
