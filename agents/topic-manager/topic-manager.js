const fs = require('fs');
const path = require('path');

const TOPICS_FILE = path.join(process.cwd(), 'agents', 'blog-topics.json');

function getNextPendingTopic(filePath = TOPICS_FILE) {
  const topics = loadTopics(filePath);
  const pendingTopics = topics
    .filter(isPendingTopic)
    .sort((a, b) => Number(a.priority ?? Number.MAX_SAFE_INTEGER) - Number(b.priority ?? Number.MAX_SAFE_INTEGER));

  return pendingTopics[0] || null;
}

function loadTopics(filePath = TOPICS_FILE) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`⚠️  No pude leer la lista de temas en ${filePath}:`, error.message);
    return [];
  }
}

function isPendingTopic(topic) {
  return topic?.status === 'pending';
}

function markTopicAsPublished(slug, filePath = TOPICS_FILE) {
  if (typeof slug !== 'string' || !slug.trim()) {
    throw new TypeError('slug debe ser un string obligatorio');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Archivo de temas no encontrado: ${filePath}`);
  }

  let topics;
  try {
    topics = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`No se pudo leer la lista de temas: ${error.message}`);
  }

  if (!Array.isArray(topics)) {
    throw new TypeError('La lista de temas debe ser un array');
  }

  const topic = topics.find(candidate => candidate?.slug === slug);
  if (!topic) {
    throw new Error(`No se encontró el tema con slug "${slug}"`);
  }

  topic.status = 'published';
  topic.publishedAt = new Date().toISOString();
  fs.writeFileSync(filePath, `${JSON.stringify(topics, null, 2)}\n`, 'utf8');

  return topic;
}

module.exports = {
  getNextPendingTopic,
  loadTopics,
  markTopicAsPublished
};
