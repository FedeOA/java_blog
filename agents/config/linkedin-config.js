require('dotenv').config();

module.exports = Object.freeze({
  accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
  personalProfileId: process.env.LINKEDIN_PERSONAL_PROFILE_ID
});
