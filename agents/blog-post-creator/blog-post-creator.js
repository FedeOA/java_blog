const fs = require('fs');
const path = require('path');

const { callClaudeAPI } = require('../cloud-api');
const { buildPrompt } = require('./prompt');
const { getCategoryConfig } = require('../category-map');

const SYSTEM_PROMPT = 'You are an expert technical writer specialized in Java and backend development.';
const { getNextPendingTopic } = require('../topic-manager/topic-manager');

// ============================================
// AGENT: Blog Post Creator
// ============================================

async function createPost(topic, config) {
  console.log('\n✍️  Agent: Blog Post Creator\n');

  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new TypeError('config debe ser un objeto obligatorio');
  }

  const selectedTopic = topic || getNextPendingTopic();
  if (!selectedTopic) {
    throw new Error('No hay temas pendientes en agents/blog-topics.json');
  }

  const normalizedTopic = {
    ...selectedTopic,
    title: selectedTopic.title,
    slug: selectedTopic.slug,
    category: selectedTopic.category || 'patterns',
    subcategory: selectedTopic.subcategory,
    description: selectedTopic.description || 'Tema técnico de Java y backend.',
    keyTopics: Array.isArray(selectedTopic.keyTopics) ? selectedTopic.keyTopics : [selectedTopic.category || 'Java']
  };

  
  const categoryConfig = getCategoryConfig(normalizedTopic);

  const postFilename = `post-${normalizedTopic.slug}.html`;
  const categoryPath = path.join(process.cwd(), 'categories', normalizedTopic.category);
  const postDirectory = path.join(categoryPath, categoryConfig.postDirectory);
  const postPath = path.join(postDirectory, postFilename);
  const indexLink = categoryConfig.hasSubcategory
    ? `../${categoryConfig.indexFile}`
    : categoryConfig.indexFile;

  const postHref = categoryConfig.hasSubcategory
    ? `${categoryConfig.postDirectory}/${postFilename}`
    : postFilename;
  const indexPath = path.join(categoryPath, categoryConfig.indexFile);

  const htmlContent = await callClaudeAPI(
    buildPrompt(normalizedTopic),
    config,
    SYSTEM_PROMPT,
    config.language
  );
  const htmlDocument = buildPostHtml(normalizedTopic, htmlContent, categoryConfig, indexLink);

  if (normalizedTopic.category.toLowerCase() === 'patterns') {
    updatePatternsIndex(normalizedTopic, postFilename, categoryConfig.postDirectory);
  } else {
    updateIndex(normalizedTopic, normalizedTopic.description, postHref, indexPath);
  }

  writePostFile(postPath, htmlDocument);

  return {
    filename: postFilename,
    path: postPath,
    mainContent: htmlContent
  };
}

function loadBlogConfig(filePath = path.join(process.cwd(), 'blog-automation.json')) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`No se pudo leer la configuración del blog: ${error.message}`);
  }
}

function updateIndex(normalizedTopic, description, postHref, indexPath) {
  if (!fs.existsSync(indexPath)) {
    console.warn(`⚠️  Archivo de índice no encontrado: ${indexPath}`);
    return false;
  }

  const indexContent = fs.readFileSync(indexPath, 'utf8');
  const mainTag = /<main\b[^>]*>/i;

  if (!mainTag.test(indexContent)) {
    console.warn(`⚠️  No se encontró el tag <main> en ${indexPath}`);
    return false;
  }

  const postCard = createPostCard(normalizedTopic.title, description, postHref);
  const updatedContent = indexContent.replace(
    mainTag,
    mainTagMatch => `${mainTagMatch}\n${postCard}\n`
  );

  fs.writeFileSync(indexPath, updatedContent);
  console.log(`✅ Índice actualizado: ${indexPath}`);
  return true;
}

function createPostCard(title, description, postHref) {
  return `  <div class="post-card">
    <h3>${title}</h3>
    <p>${description}</p>
    <a class="post-button" href="${postHref}">Ver artículo</a>
  </div>`;
}

function buildPostHtml(topic, htmlContent, categoryConfig, indexLink) {
  const stylesheetPath = categoryConfig.hasSubcategory ? '../../../styles.css' : '../../styles.css';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${topic.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${stylesheetPath}" />
  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css" />
  <style>
    a {
      color: #58a6ff;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .github-link {
      display: inline-block;
      margin-top: 0.5rem;
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      background-color: #238636;
      color: #ffffff;
      font-weight: bold;
    }

    .github-link:hover {
      background-color: #2ea043;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <header>
    <h1>${topic.title}</h1>
    <p>${topic.description}</p>
  </header>

  <nav>
    <a href="${indexLink}">← Volver a la categoría</a>
  </nav>

  ${htmlContent}

  <footer>
    <p>© 2025 Federico Oscar Acosta</p>
  </footer>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>hljs.highlightAll();</script>
</body>
</html>`;
}

function updatePatternsIndex(
  normalizedTopic,
  postFilename,
  subcategory = normalizedTopic.subcategory,
  indexPath = path.join(process.cwd(), 'categories', 'patterns', 'design-patterns.html')
) {
  if (normalizedTopic.category.toLowerCase() !== 'patterns') {
    return false;
  }

  if (!fs.existsSync(indexPath)) {
    console.warn(`⚠️  Archivo de patrones no encontrado: ${indexPath}`);
    return false;
  }

  const lines = fs.readFileSync(indexPath, 'utf8').split('\n');
  const slugIndex = lines.findIndex(line => line.toLowerCase().includes(normalizedTopic.slug.toLowerCase()));

  if (slugIndex === -1) {
    console.warn(`⚠️  No se encontró el slug "${normalizedTopic.slug}" en ${indexPath}`);
    return false;
  }

  const indentation = lines[slugIndex].match(/^\s*/)[0];
  lines[slugIndex] = `${indentation}<li><a href="${subcategory}/${postFilename}">${normalizedTopic.slug}</a></li>`;
  fs.writeFileSync(indexPath, lines.join('\n'));
  console.log(`✅ Índice de patrones actualizado: ${indexPath}`);
  return true;
}

function writePostFile(postPath, htmlContent) {
  if (typeof postPath !== 'string' || !postPath.trim()) {
    throw new TypeError('postPath debe ser una ruta no vacía');
  }

  if (typeof htmlContent !== 'string') {
    throw new TypeError('htmlContent debe ser un string');
  }

  const postDirectory = path.dirname(postPath);
  fs.mkdirSync(postDirectory, { recursive: true });
  fs.writeFileSync(postPath, htmlContent, 'utf8');
  console.log(`✅ Post creado: ${postPath}`);

  return { path: postPath };
}

module.exports = {
  createPost,
  loadBlogConfig,
  updatePatternsIndex,
  updateIndex,
  createPostCard,
  buildPostHtml
};