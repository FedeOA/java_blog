function buildPrompt(topic, postMain = '') {
  return `
You are an expert Java developer. Create a complete, runnable Java example based on the topic: "${topic.title}"

Use the following HTML main content from the blog post only as technical context:
${postMain}

The blog post explains the topic, but it is not a template to copy. Create an
original example that teaches the same concept through a different, self-contained
scenario.

Originality requirements:
- Do not reproduce the exact example, domain, use case, story, or execution flow from the post.
- Choose a different realistic domain and invent your own classes, interfaces, data,
  method names, and sample values.
- Do not copy class names, variable names, code blocks, DTOs, or file structure from
  the post unless a name is required by the Java language or by this output contract.
- Preserve the underlying Java concept or design pattern, but demonstrate it with
  a fresh implementation that can stand on its own.
- The README must explain why the generated scenario is an independent example and
  must document the roles of the new classes in that scenario.

Project layout:
- The project root is "${topic.slug}/example/".
- All file paths in the response must be relative to that project root.
- Use the package "com.blog.example" for Java source files.
- Organize Java classes by responsibility instead of placing every class in the same package.
- Create only the layers that are genuinely needed by the example. Do not create empty or artificial layers.

Organize the source files into packages or layers according to their actual
responsibilities and the needs of the example. Use your judgment:
- Separate classes when doing so makes the design, pattern roles, or execution flow clearer.
- Keep closely related classes together when splitting them would add ceremony without value.
- Create only the packages that are genuinely needed; do not force config, model,
  repository, service, controller, or util packages into every project.
- Do not create empty, artificial, or speculative layers merely to follow a template.
- Keep the package structure proportionate to the size and complexity of the example.
- Every class must be placed where its responsibility is clearest, and its package
  declaration must match its path.
- Main.java should coordinate a small demonstration by calling the relevant classes;
  it should not contain all business logic.

Required files:
- src/main/java/com/blog/example/Main.java with a public static void main(String[] args)
  that runs a small, clear demonstration of the topic
- One or more additional Java classes containing the actual example implementation, organized by layer
- README.md with the project purpose, structure, prerequisites, run commands,
  javac/java commands, a layer description, and a short explanation of the example

Requirements:
- Code must compile and run without errors
- Main.java must be executable with javac and the Java command
- Classes must have a single clear responsibility
- Avoid putting unrelated responsibilities in one package, but do not split simple
  examples into unnecessary packages
- Use imports between layers consistently and avoid circular dependencies
- Clear English comments and naming
- Do not use markdown fences inside file contents
- Do not include files outside the project layout

Respond ONLY with JSON (no markdown blocks):
{
  "projectPath": "${topic.slug}/example",
  "files": {
    "src/main/java/com/blog/example/Main.java": "full content...",
    "src/main/java/com/blog/example/ExampleClass.java": "full content...",
    "README.md": "full content..."
  }
}`;
}

module.exports = {
  buildPrompt
};
