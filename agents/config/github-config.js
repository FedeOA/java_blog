require('dotenv').config();

module.exports = Object.freeze({
  token: process.env.GITHUB_TOKEN,
  email: process.env.GITHUB_EMAIL,
  username: process.env.GITHUB_USERNAME,
  repository: process.env.GITHUB_REPO
});
