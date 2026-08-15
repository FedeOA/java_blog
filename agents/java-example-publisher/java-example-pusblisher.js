const { callClaudeAPI } = require('../cloud-api');
const { buildPrompt } = require('./prompt');
const SYSTEM_PROMPT = 'You are an expert Java developer focused on clear, runnable examples and clean architecture.';

// ============================================
// AGENTE 4: Java Example Publisher
// ============================================

async function createJavaExample(topic, config, postMain) {
  console.log('\n☕ Agent: Java Example Publisher\n');

  const exampleJson = await callClaudeAPI(
    buildPrompt(topic, postMain),
    config,
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
    throw new TypeError('La respuesta del agente Java debe ser un string no vacío');
  }

  let jsonContent = response.trim();
  const fencedResponse = jsonContent.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);

  if (fencedResponse) {
    jsonContent = fencedResponse[1].trim();
  }

  try {
    return JSON.parse(jsonContent);
  } catch (error) {
    throw new Error(`La respuesta del agente Java no es JSON válido: ${error.message}`);
  }
}

function validateJavaExample(example, topic) {
  if (!example || typeof example !== 'object' || Array.isArray(example)) {
    throw new TypeError('El ejemplo Java debe ser un objeto');
  }

  const expectedProjectPath = `${topic.slug}/example`;
  if (example.projectPath !== expectedProjectPath) {
    throw new Error(`projectPath inválido: se esperaba "${expectedProjectPath}"`);
  }

  if (!example.files || typeof example.files !== 'object' || Array.isArray(example.files)) {
    throw new TypeError('El ejemplo Java debe incluir un objeto files');
  }

  const requiredFiles = [
    'src/main/java/com/blog/example/Main.java',
    'README.md'
  ];

  for (const requiredFile of requiredFiles) {
    if (typeof example.files[requiredFile] !== 'string' || !example.files[requiredFile].trim()) {
      throw new Error(`Falta el archivo requerido: ${requiredFile}`);
    }
  }

  for (const [filePath, content] of Object.entries(example.files)) {
    if (!filePath || pathIsUnsafe(filePath)) {
      throw new Error(`Ruta de archivo inválida: ${filePath}`);
    }

    if (typeof content !== 'string') {
      throw new TypeError(`El contenido de ${filePath} debe ser un string`);
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