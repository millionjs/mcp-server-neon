import { defineResource } from '../sdk/resource'

async function fetchRawGithubContent(rawPath: string) {
  const path = rawPath.replace('/blob', '')

  return fetch(`https://raw.githubusercontent.com${path}`).then((res) => res.text())
}

const neonAuthResource = defineResource({
  mimeType: 'text/plain',
  name: 'neon-auth',
  read: async (uri) => {
    const content = await fetchRawGithubContent('/neondatabase-labs/ai-rules/refs/heads/main/neon-auth.mdc')
    return {
      contents: [{ text: content, uri: uri.href }],
    }
  },
  uri: 'https://github.com/neondatabase-labs/ai-rules/blob/main/neon-auth.mdc',
})

const neonServerlessResource = defineResource({
  mimeType: 'text/plain',
  name: 'neon-serverless',
  read: async (uri) => {
    const content = await fetchRawGithubContent('/neondatabase-labs/ai-rules/refs/heads/main/neon-serverless.mdc')
    return {
      contents: [{ text: content, uri: uri.href }],
    }
  },
  uri: 'https://github.com/neondatabase-labs/ai-rules/blob/main/neon-serverless.mdc',
})

const neonDrizzleResource = defineResource({
  mimeType: 'text/plain',
  name: 'neon-drizzle',
  read: async (uri) => {
    const content = await fetchRawGithubContent('/neondatabase-labs/ai-rules/refs/heads/main/neon-drizzle.mdc')
    return {
      contents: [{ text: content, uri: uri.href }],
    }
  },
  uri: 'https://github.com/neondatabase-labs/ai-rules/blob/main/neon-drizzle.mdc',
})

export const NEON_RESOURCES = [neonAuthResource, neonServerlessResource, neonDrizzleResource]
