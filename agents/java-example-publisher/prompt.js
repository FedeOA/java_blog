function buildPrompt(topic, postMain = '') {
  return `
You are an expert Java developer. Create a complete, runnable Java example based on the topic: "${topic.title}"

Use the following HTML main content from the blog post as technical context:
${postMain}

Project layout:
- The project root is "${topic.slug}/example/".
- All file paths in the response must be relative to that project root.
- Use the package "com.blog.example" for Java source files.
- Organize Java classes by responsibility instead of placing every class in the same package.
- Create only the layers that are genuinely needed by the example. Do not create empty or artificial layers.

Use this layered package structure when those responsibilities exist:
- com.blog.example.config: configuration classes and constants
- com.blog.example.model: domain objects, DTOs, and value objects
- com.blog.example.repository: data access or in-memory storage
- com.blog.example.service: business logic and use cases
- com.blog.example.controller: application entry points or request coordination
- com.blog.example.util: small reusable technical utilities only
- com.blog.example: Main.java and classes that do not belong to a specific layer

The project should follow this general structure:
${topic.slug}/example/
├── README.md
└── src/main/java/com/blog/example/
  ├── Main.java
  ├── config/
  ├── model/
  ├── repository/
  ├── service/
  ├── controller/
  └── util/

The folders shown above are examples of possible layers, not mandatory files.
Each class must be placed in the layer that matches its responsibility, and its package declaration
must match its path. Main.java should coordinate a small demonstration by calling the appropriate
service or application class; it must not contain all business logic.

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
- Do not put service, configuration, model, repository, and utility classes all in the root package
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
