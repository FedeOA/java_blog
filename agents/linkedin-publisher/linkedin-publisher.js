const fs = require('fs');
const path = require('path');

const { callClaudeAPI } = require('../cloud-api');
const claudeConfig = require('../config/claude-config');
const { buildPrompt } = require('./prompt');
const { getCategoryConfig } = require('../category-map');
const { createPostCard } = require('../blog-post-creator/blog-post-creator');
const SYSTEM_PROMPT = 'You are an expert technical content editor specialized in concise professional LinkedIn posts about Java and software development.';

// ============================================
// AGENTE 5: Content Optimizer para LinkedIn
// ============================================

async function generateLinkedInPost(topic, postFile, config) {
  console.log('\n📱 Agent: LinkedIn Content Generator\n');

  const linkedinPost = await callClaudeAPI(
    buildPrompt(topic),
    claudeConfig,
    SYSTEM_PROMPT,
    claudeConfig.language
  );
  console.log('📋 LinkedIn post generated:\n', linkedinPost);
  return linkedinPost;
}

// ============================================
// AGENTE 6: Blog Structure Manager
// ============================================


async function updateBlogStructure(topic, postFile, config) {
  console.log('\n🗂️  Agent: Blog Structure Manager\n');

  const categoryConfig = getCategoryConfig(topic);
  const categoryPath = path.join(process.cwd(), 'categories', topic.category);
  const categoryIndexPath = path.join(categoryPath, categoryConfig.indexFile);

  if (!fs.existsSync(categoryIndexPath)) {
    console.warn(`⚠️  Archivo de categoría no encontrado: ${categoryIndexPath}`);
    return false;
  }

  let indexContent = fs.readFileSync(categoryIndexPath, 'utf8');

  const postHref = categoryConfig.hasSubcategory
    ? `${categoryConfig.postDirectory}/${postFile.filename}`
    : postFile.filename;

  const postCard = createPostCard(topic.title, topic.description, postHref);

  const updated = indexContent.replace(
    '</main>',
    `  ${postCard}\n\n</main>`
  );

  if (updated !== indexContent) {
    fs.writeFileSync(categoryIndexPath, updated);
    console.log(`✅ Structure updated: ${categoryIndexPath}`);
    return true;
  } else {
    console.warn('⚠️  Could not update the structure');
    return false;
  }
}

module.exports = {
  generateLinkedInPost,
  updateBlogStructure,
  createPostCard
};