const axios = require('axios');

async function callClaudeAPI(prompt, config, systemPrompt, language) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new TypeError('config debe ser un objeto obligatorio');
  }

  if (typeof systemPrompt !== 'string' || !systemPrompt.trim()) {
    throw new TypeError('systemPrompt debe ser un string obligatorio');
  }

  if (typeof language !== 'string' || !language.trim()) {
    throw new TypeError('language debe ser un string obligatorio');
  }

  if (!config.apiKey) {
    throw new Error('CLAUDE_API_KEY is not configured');
  }

  console.log('🔄 Calling Claude API...');
  
  try {
    const response = await axios.post(config.apiUrl, {
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
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
    
    return response.data.content[0].text;
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
