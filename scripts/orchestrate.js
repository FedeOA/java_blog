#!/usr/bin/env node

/**
 * Blog Orchestrator - Coordinates the automated post publishing workflow
 * 
 * Workflow:
 * 1. Selects a research topic without duplicates
 * 2. Generates the complete HTML post
 * 3. Updates the blog structure and indexes
 * 4. Optimizes the content
 * 5. Creates a Java example with tests
 * 6. Creates GitHub pull requests for review
 * 7. Completes the publication workflow
 */

// Import the agents module
const agents = require('../agents');
const blogConfig = require('../blog-automation.json');
const claudeConfig = require('../agents/config/claude-config');
const githubConfig = require('../agents/config/github-config');
const {
  createPullRequests,
  getJavaExampleRepositoryName
} = require('./git/git,js');

// Validate required environment variables
const requiredEnvVars = [
  ['CLAUDE_API_KEY', claudeConfig.apiKey],
  ['GITHUB_TOKEN', githubConfig.token],
  ['GITHUB_EMAIL', githubConfig.email],
  ['GITHUB_USERNAME', githubConfig.username],
  ['GITHUB_REPO', githubConfig.repository],
];

function validateEnv() {
  console.log('📋 Validating environment variables...\n');
  
  const missing = requiredEnvVars.filter(([, value]) => !value).map(([name]) => name);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}`);
    process.exit(1);
  }
  
  console.log('✅ All required variables are configured\n');
}

async function main() {
  console.log('🚀 Starting the complete blog publishing workflow\n');

  validateEnv();
  const pendingTopic = agents.getNextPendingTopic();

  if (!pendingTopic) {
    throw new Error('No pending topics found in agents/blog-topics.json');
  }

  const javaRepositoryName = getJavaExampleRepositoryName(pendingTopic);
  const topic = {
    ...pendingTopic,
    githubUrl: pendingTopic.githubUrl
      || `https://github.com/${githubConfig.username}/${javaRepositoryName}`
  };

  console.log('\n📌 Step 1: create the HTML post');
  const postFile = await agents.createPost(topic, claudeConfig);

  console.log('\n📌 Step 2: create the Java example');
  const javaExample = await agents.createJavaExample(topic, claudeConfig, postFile.mainContent);

  console.log('\n📌 Step 3: create the Pull Request and publish the Java repository');
  await createPullRequests(topic, postFile, javaExample, blogConfig, githubConfig);
  agents.markTopicAsPublished(topic.slug);

  console.log('\n✅ Complete workflow finished');
  return { topic, postFile, javaExample };
}

// Run the orchestrator
main().catch((error) => {
  console.error('\n❌ Main workflow error:');
  console.error(error.message || error);
  process.exit(1);
});
