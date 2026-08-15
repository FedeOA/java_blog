function buildPrompt(topic) {
  return `
Create a LinkedIn post based on this blog article.

Article title: ${topic.title}
Category: ${topic.category}
Slug: ${topic.slug}
Description: ${topic.description}

Requirements:
- Strong hook in the first line
- 3-5 key bullets
- Clear call-to-action toward the blog
- Relevant hashtags (5-7)
- Length: 500-700 characters
- Professional but accessible tone
- Use emojis strategically
- Write in English

Respond ONLY with the post content (no quotes, no markdown, ready to copy-paste):`;
}

module.exports = {
  buildPrompt
};
