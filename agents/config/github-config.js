require('dotenv').config();

module.exports = Object.freeze({
  token: process.env.BLOG_GITHUB_TOKEN,
  email: process.env.BLOG_GITHUB_EMAIL,
  username: process.env.BLOG_GITHUB_USERNAME,
  repository: process.env.BLOG_GITHUB_REPO
});
