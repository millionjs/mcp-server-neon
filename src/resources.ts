import type { Resource } from 'fastmcp'

async function fetchRawGithubContent(rawPath: string) {
  const path = rawPath.replace('/blob', '')

  return fetch(`https://raw.githubusercontent.com${path}`).then((res) => res.text())
}

export const NEON_RESOURCES: Resource[] = [
  {
    description: 'Neon Auth usage instructions',
    load: async () => {
      const content = await fetchRawGithubContent('/neondatabase-labs/ai-rules/refs/heads/main/neon-auth.mdc')
      return {
        text: content,
      }
    },
    mimeType: 'text/plain',
    name: 'neon-auth',
    uri: 'https://github.com/neondatabase-labs/ai-rules/blob/main/neon-auth.mdc',
  },
  {
    description: 'Neon Serverless usage instructions',
    load: async () => {
      const content = await fetchRawGithubContent('/neondatabase-labs/ai-rules/refs/heads/main/neon-serverless.mdc')
      return {
        text: content,
      }
    },
    mimeType: 'text/plain',
    name: 'neon-serverless',
    uri: 'https://github.com/neondatabase-labs/ai-rules/blob/main/neon-serverless.mdc',
  },
  {
    description: 'Neon Drizzle usage instructions',
    load: async () => {
      const content = await fetchRawGithubContent('/neondatabase-labs/ai-rules/refs/heads/main/neon-drizzle.mdc')
      return {
        text: content,
      }
    },
    mimeType: 'text/plain',
    name: 'neon-drizzle',
    uri: 'https://github.com/neondatabase-labs/ai-rules/blob/main/neon-drizzle.mdc',
  },
]
