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
    console.warn(`⚠️  Could not read the topic list at ${filePath}:`, error.message);
    return [];
  }
}

function isPendingTopic(topic) {
  return topic?.status === 'pending';
}

function markTopicAsPublished(slug, filePath = TOPICS_FILE) {
  if (typeof slug !== 'string' || !slug.trim()) {
    throw new TypeError('slug must be a required string');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Topics file not found: ${filePath}`);
  }

  let topics;
  try {
    topics = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Could not read the topic list: ${error.message}`);
  }

  if (!Array.isArray(topics)) {
    throw new TypeError('The topic list must be an array');
  }

  const topic = topics.find(candidate => candidate?.slug === slug);
  if (!topic) {
    throw new Error(`Topic with slug "${slug}" was not found`);
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
