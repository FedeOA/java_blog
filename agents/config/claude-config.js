require('dotenv').config();

module.exports = Object.freeze({
  apiKey: process.env.CLAUDE_API_KEY,
  apiUrl: process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages',
  model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
  version: process.env.CLAUDE_VERSION || '2023-06-01',
  temperature: Number(process.env.CLAUDE_TEMPERATURE || 0.7),
  maxTokens: Number(process.env.CLAUDE_MAX_TOKENS || 4096),
  language: process.env.CLAUDE_LANGUAGE || 'Spanish',
  javaLanguage: process.env.CLAUDE_JAVA_LANGUAGE || 'English'
});
