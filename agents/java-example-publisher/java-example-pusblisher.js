const { callClaudeAPI } = require('../cloud-api');
const { buildPrompt } = require('./prompt');
const SYSTEM_PROMPT = 'You are an expert Java developer focused on clear, runnable examples and clean architecture.';

// ============================================
// AGENT 4: Java Example Publisher
// ============================================

async function createJavaExample(topic, config, postMain) {
  console.log('\n☕ Agent: Java Example Publisher\n');

  const javaConfig = {
    ...config,
    model: config.javaModel || config.model,
    maxTokens: Number(config.javaMaxTokens || config.maxTokens || 4096)
  };

  const exampleJson = await callClaudeAPI(
    buildPrompt(topic, postMain),
    javaConfig,
    SYSTEM_PROMPT,
    config.javaLanguage
  );
  const example = parseJavaExampleResponse(exampleJson);

  validateJavaExample(example, topic);

  console.log(`✅ Java example generated for: ${example.projectPath}`);
  return example;
}

function parseJavaExampleResponse(response) {
  if (typeof response !== 'string' || !response.trim()) {
    throw new TypeError('The Java agent response must be a non-empty string');
  }

  let jsonContent = response.trim();
  const fencedResponse = jsonContent.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);

  if (fencedResponse) {
    jsonContent = fencedResponse[1].trim();
  }

  try {
    return JSON.parse(jsonContent);
  } catch (error) {
    throw new Error(`The Java agent response is not valid JSON: ${error.message}`);
  }
}

function validateJavaExample(example, topic) {
  if (!example || typeof example !== 'object' || Array.isArray(example)) {
    throw new TypeError('The Java example must be an object');
  }

  const expectedProjectPath = `${topic.slug}/example`;
  if (example.projectPath !== expectedProjectPath) {
    throw new Error(`Invalid projectPath: expected "${expectedProjectPath}"`);
  }

  if (!example.files || typeof example.files !== 'object' || Array.isArray(example.files)) {
    throw new TypeError('The Java example must include a files object');
  }

  const requiredFiles = [
    'src/main/java/com/blog/example/Main.java',
    'README.md'
  ];

  for (const requiredFile of requiredFiles) {
    if (typeof example.files[requiredFile] !== 'string' || !example.files[requiredFile].trim()) {
      throw new Error(`Required file is missing: ${requiredFile}`);
    }
  }

  for (const [filePath, content] of Object.entries(example.files)) {
    if (!filePath || pathIsUnsafe(filePath)) {
      throw new Error(`Invalid file path: ${filePath}`);
    }

    if (typeof content !== 'string') {
      throw new TypeError(`The content of ${filePath} must be a string`);
    }
  }
}

function pathIsUnsafe(filePath) {
  return filePath.startsWith('/')
    || filePath.startsWith('\\')
    || filePath.includes('..')
    || /^[A-Za-z]:[\\/]/.test(filePath);
}

module.exports = {
  createJavaExample,
  parseJavaExampleResponse,
  validateJavaExample
};