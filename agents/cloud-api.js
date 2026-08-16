const axios = require('axios');

async function callClaudeAPI(prompt, config, systemPrompt, language) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new TypeError('config must be a required object');
  }

  if (typeof systemPrompt !== 'string' || !systemPrompt.trim()) {
    throw new TypeError('systemPrompt must be a required string');
  }

  if (typeof language !== 'string' || !language.trim()) {
    throw new TypeError('language must be a required string');
  }

  if (!config.apiKey) {
    throw new Error('CLAUDE_API_KEY is not configured');
  }

  console.log('🔄 Calling Claude API...');
  
  try {
    const response = await axios.post(config.apiUrl, {
      model: config.model,
      max_tokens: config.maxTokens,
      system: `${systemPrompt}
    Respond always in ${language}.
    Follow the instructions exactly and do not add extra markdown blocks or unnecessary explanations.`,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }, {
      headers: {
        'x-api-key': config.apiKey,
        'anthropic-version': config.version,
        'content-type': 'application/json'
      }
    });
    
    const content = response.data?.content;
    const text = Array.isArray(content)
      ? content
        .filter((block) => block && block.type === 'text' && typeof block.text === 'string')
        .map((block) => block.text)
        .join('')
        .trim()
      : '';
    const stopReason = response.data?.stop_reason || 'unknown';
    const requestId = response.headers?.['request-id'];
    const requestContext = requestId ? ` (request-id: ${requestId})` : '';

    if (stopReason === 'max_tokens') {
      throw new Error(
        `Claude API response was truncated at max_tokens; increase CLAUDE_MAX_TOKENS${requestContext}`
      );
    }

    if (!text) {
      throw new Error(
        `Claude API returned no usable text (stop_reason: ${stopReason})${requestContext}`
      );
    }

    return text;
  } catch (error) {
    console.error('❌ Error calling Claude API:', error.response?.data || error.message);
    throw error;
  }
}

// ============================================.
// Exports
// ============================================

module.exports = {
  callClaudeAPI
};
