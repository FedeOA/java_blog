# Java Blog Automation

Automation project for generating Spanish Java blog posts and independent Java example repositories. Claude generates the content, the local workflow writes the post into the static blog, GitHub receives the Java example in a separate repository, and the blog post is submitted for manual review through a Pull Request.

## What the Project Does

For the next pending topic, the orchestrator:

1. Reads the topic from `agents/blog-topics.json`.
2. Builds the GitHub URL used by the article.
3. Generates the blog article in Spanish as an HTML `<main>` section.
4. Writes the post under `categories/` and updates the category index.
5. Sends the generated article content to the Java example publisher.
6. Generates an English Java example with layered packages, `Main.java`, and `README.md`.
7. Creates an independent GitHub repository for the Java example.
8. Pushes the Java example to that repository's `main` branch.
9. Creates a post branch in the main blog repository.
10. Pushes the branch and opens one Pull Request against `main`.
11. Marks the topic as `published` only after the complete workflow succeeds.

LinkedIn publishing is not part of the current automation.

## Technologies

- Node.js 16 or newer
- JavaScript with CommonJS modules
- Claude API through the Anthropic Messages API
- Axios for HTTP requests
- Dotenv for environment variables
- Git and GitHub API
- GitHub Actions for scheduled execution
- Static HTML, CSS, and JavaScript for the blog
- Java for generated examples

## Project Structure

```text
.
├── agents/
│   ├── blog-post-creator/       Generates the HTML article
│   ├── config/                  Claude and GitHub configuration
│   ├── java-example-publisher/  Generates and validates Java examples
│   ├── topic-manager/           Loads topics and updates their status
│   ├── category-map.js          Category and index mapping
│   └── cloud-api.js             Claude API client
├── categories/                  Generated blog posts and indexes
├── scripts/
│   ├── git/git,js               GitHub repositories, branches, and PRs
│   └── orchestrate.js           Main workflow coordinator
├── agents/blog-topics.json      Topic queue
├── blog-automation.json         Author and blog URL
├── package.json                 npm scripts and dependencies
├── .env                         Local credentials and API settings
└── .github/workflows/           Scheduled GitHub Actions workflow
```

## Prerequisites

Install the following tools:

- Node.js 16 or newer
- npm
- Git
- A Claude API key
- A GitHub account and a token with repository access and repository-creation permissions

## Configuration

### Environment Variables

Create `.env` in the project root. You can copy the template when it is available:

```powershell
Copy-Item .env.example .env
```

Configure the following values:

```env
CLAUDE_API_KEY=your-anthropic-api-key
CLAUDE_API_URL=https://api.anthropic.com/v1/messages
CLAUDE_MODEL=claude-haiku-4-5-20251001
CLAUDE_VERSION=2023-06-01
CLAUDE_TEMPERATURE=0.3
CLAUDE_MAX_TOKENS=4096
CLAUDE_LANGUAGE=Spanish
CLAUDE_JAVA_LANGUAGE=English

GITHUB_TOKEN=your-github-token
GITHUB_EMAIL=your-github-email
GITHUB_USERNAME=your-github-username
GITHUB_REPO=your-user/blog-repository
```

`CLAUDE_LANGUAGE` controls the blog post language. `CLAUDE_JAVA_LANGUAGE` controls the generated Java code comments, names, and README language.

The current Claude settings use a Haiku model and a moderate token limit to keep the workflow economical. Adjust them in `.env` when necessary.

Never commit `.env`. It is ignored by Git.

### Blog Configuration

`blog-automation.json` contains only general blog information:

```json
{
  "author": "Your Name",
  "blogUrl": "https://your-blog.example"
}
```

Topics are managed separately in `agents/blog-topics.json`.

### Topic Queue

Each topic normally contains:

```json
{
  "title": "Factory Method in Java",
  "slug": "factory-method",
  "category": "patterns",
  "priority": 1,
  "status": "pending"
}
```

The topic with the lowest pending priority is selected first. After a successful workflow, it receives a `publishedAt` timestamp and changes to `published`:

```json
{
  "slug": "factory-method",
  "status": "published",
  "publishedAt": "2026-08-15T22:00:00.000Z"
}
```

If Claude or GitHub fails before the end of the workflow, the topic remains pending.

## GitHub Permissions

The GitHub token must be able to:

- Push the post branch to the blog repository.
- Create Pull Requests.
- Create independent repositories for Java examples.
- Push generated Java files to those repositories.

Configure the local Git identity if needed:

```powershell
git config --global user.name "Your GitHub username"
git config --global user.email "your-github-email"
```

## Running Locally

From the project root:

```powershell
cd C:\java_blog
npm install
```

Run the orchestrator directly:

```powershell
node scripts/orchestrate.js
```

Or use the npm script:

```powershell
npm run publish
```

`npm run publish` executes `node scripts/orchestrate.js`.

The command performs real operations:

- Calls the Claude API.
- Writes or updates local HTML files.
- Updates category indexes.
- Creates and pushes a Git branch.
- Creates a Pull Request.
- Creates and pushes an independent Java repository.
- Updates the topic status.

There is currently no `--dry-run` mode. Review the next pending topic before running the command.

## End-to-End Workflow

```text
Pending topic
    |
    v
Claude generates the Spanish HTML post
    |
    v
Post is written under categories/
    |
    v
Claude generates the English Java example
    |
    v
Independent Java repository is created and pushed
    |
    v
feature/post-<slug>-<YYYY-MM-DD>
    |
    v
Pull Request against main
    |
    v
Topic marked as published
```

The blog Pull Request is the only Pull Request created by this workflow. The Java example is published directly to its own independent repository and does not use a second PR in the blog repository.

## Generated Java Repository

The Java example is created in a temporary local directory, initialized with Git, committed, and pushed to a new GitHub repository. It is not stored permanently inside the blog repository.

The repository name comes from `topic.githubUrl` when available. Otherwise, the topic slug is used.

Example:

```text
Topic slug: singleton
Repository: https://github.com/FedeOA/singleton
```

The generated repository normally contains:

```text
repository/
├── README.md
├── .gitignore
└── src/main/java/com/blog/example/
    ├── Main.java
    └── ...
```

Classes are organized by responsibility when needed, using packages such as:

```text
model/
service/
repository/
config/
controller/
util/
```

The example does not require Maven, JUnit, or `pom.xml`. Its README explains how to compile and run it with `javac` and `java`.

## Pull Request Review

After the orchestrator finishes:

1. Open the Pull Request in the main blog repository.
2. Review the generated HTML post and category index changes.
3. Open the independent Java repository using the URL printed by the orchestrator.
4. Review `Main.java`, the layered classes, and `README.md`.
5. Request changes or edit the post branch if needed.
6. Merge the Pull Request when the post is ready.

The Java repository already has its own `main` branch and does not wait for the blog Pull Request to be merged.

## GitHub Actions

The scheduled workflow is:

```text
.github/workflows/weekly-blog-publisher.yml
```

It runs every Sunday at 22:00 UTC and supports manual execution through `workflow_dispatch`.

The workflow runs:

```text
node scripts/orchestrate.js
```

Configure these repository secrets before enabling scheduled execution:

- `CLAUDE_API_KEY`
- `GITHUB_TOKEN`
- `GITHUB_EMAIL`
- `GITHUB_USERNAME`

`GITHUB_REPO` is supplied by the workflow from the current GitHub repository context.

Before enabling the schedule, verify that the token used by Actions can create repositories for Java examples. The default GitHub Actions token may not have that permission.

## Troubleshooting

| Problem | What to check |
|---|---|
| Missing Claude API key | Check `CLAUDE_API_KEY` in `.env` or GitHub Secrets. |
| Invalid Claude response | Check the model, token limit, prompt, and API key. |
| Git push failed | Check `GITHUB_TOKEN`, repository access, and Git identity. |
| Pull Request was not created | Check that the token can push branches and create Pull Requests. |
| Java repository was not created | Check that the token can create repositories and push to them. |
| Post is not visible on `main` | Merge the generated Pull Request. |
| Topic remains pending | Inspect the error; status changes only after the complete flow succeeds. |

## Security Checklist

- [ ] `.env` is listed in `.gitignore`.
- [ ] No API keys or tokens are committed.
- [ ] Credentials are rotated if exposed.
- [ ] GitHub Actions secrets are configured.
- [ ] The GitHub token has only the required permissions.
- [ ] Secrets are never printed in logs.