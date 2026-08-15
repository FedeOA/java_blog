const {
  createPost,
  updateIndex,
  createPostCard
} = require('./blog-post-creator/blog-post-creator');
const {
  loadTopics,
  getNextPendingTopic,
  markTopicAsPublished
} = require('./topic-manager/topic-manager');
const { createJavaExample } = require('./java-example-publisher/java-example-pusblisher');
const { generateLinkedInPost, updateBlogStructure } = require('./linkedin-publisher/linkedin-publisher');
const { callClaudeAPI } = require('./cloud-api');

module.exports = {
  loadTopics,
  getNextPendingTopic,
  markTopicAsPublished,
  createPost,
  updateIndex,
  createPostCard,
  createJavaExample,
  generateLinkedInPost,
  updateBlogStructure,
  callClaudeAPI
};
