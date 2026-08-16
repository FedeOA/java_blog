function buildPrompt(topic) {
  const safeDescription = topic.description || 'Tema técnico de Java y backend.';
  const safeSubcategory = topic.subcategory || topic.category || 'general';
  const safeKeyTopics = Array.isArray(topic.keyTopics) && topic.keyTopics.length > 0
    ? topic.keyTopics
    : ['Java', topic.category || 'backend'];
  const safeGithubUrl = topic.githubUrl || `https://github.com/FedeOA/${topic.slug}`;

  return `
You are an expert Java technical writer. Create a complete blog article.

Title: ${topic.title}
Slug: ${topic.slug}
Category: ${topic.category}
Subcategory: ${safeSubcategory}
Description: ${safeDescription}
Key concepts: ${safeKeyTopics.join(', ')}

Requirements:
- Written in Spanish
- Structure: Introduction → 3-4 main sections → Conclusion
- Include 2-3 Java code examples
- Format as HTML with <pre><code class="java">
- Around 1500-2000 words
- Professional but accessible tone
- Do not include <html>, <head>, or <body> tags

Use this article structure as a reference. Adapt the headings and content to the requested topic:

<main class="post">

  <!-- Introduction -->
  <section>
    <h2>¿Qué es el concepto principal?</h2>
    <p>Explicación clara del concepto y del problema que resuelve.</p>
  </section>

  <!-- Problem -->
  <section>
    <h2>Problema que resuelve</h2>
    <p>Descripción del problema y de sus consecuencias en una aplicación Java.</p>
  </section>

  <!-- Solution -->
  <section>
    <h2>Solución</h2>
    <p>Descripción de la solución y de cómo se aplica.</p>
  </section>

  <!-- Structure or key concepts -->
  <section>
    <h2>Estructura y conceptos principales</h2>
    <ul>
      <li><strong>Concepto</strong>: explicación breve.</li>
    </ul>
  </section>

  <!-- Example in Java -->
  <section>
    <h2>Ejemplo en Java</h2>
    <pre><code class="language-java">
// Código Java relacionado con el tema
    </code></pre>
  </section>

  <!-- Complete example -->
  <section>
    <h2>Ejemplo completo</h2>
    <a
      class="github-link"
      href="${safeGithubUrl}"
      target="_blank"
      rel="noopener noreferrer"
    >
      Ver ejemplo completo en GitHub
    </a>
  </section>

  <!-- When to use it -->
  <section>
    <h2>¿Cuándo usarlo?</h2>
    <ul>
      <li>Situación apropiada para utilizarlo.</li>
    </ul>
  </section>

  <!-- Advantages and disadvantages -->
  <section>
    <h2>Ventajas y desventajas</h2>
    <h3>Ventajas</h3>
    <ul>
      <li>Ventaja principal.</li>
    </ul>
    <h3>Desventajas</h3>
    <ul>
      <li>Posible desventaja o trade-off.</li>
    </ul>
  </section>

</main>

Respond ONLY with the generated <main> section, following the reference structure. The "Ejemplo completo" section must contain only the GitHub link shown above; do not add explanatory paragraphs or lists there. Do not include markdown fences, <html>, <head>, or <body> tags.`;
}

module.exports = {
  buildPrompt
};
