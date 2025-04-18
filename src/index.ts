import type { Api } from '@neondatabase/api-client'

import { createApiClient } from '@neondatabase/api-client'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { MCP } from '../sdk/server'
import { NEON_RESOURCES } from './resources'
import { NEON_TOOLS } from './tools'

export type MCPSession = {
  neonClient: Api<any>
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))

const server = new MCP({
  authenticate: async (request) => {
    const authorization = request.headers.authorization

    if (!authorization) {
      throw new Error('Unauthorized')
    }

    const neonClient = createApiClient({
      apiKey: authorization.split(' ')[1],
      headers: {
        'User-Agent': `mcp-server-neon/${packageJson.version}`,
      },
    })

    // Whatever you return here will be accessible in the `context.session` object.
    return {
      neonClient,
    }
  },
  name: 'mcp-server-neon',
  resources: NEON_RESOURCES,
  sse: {
    endpoint: '/sse',
    port: process.env.PORT ? Number.parseInt(process.env.PORT) : 9990,
  },
  tools: NEON_TOOLS,
  transport: 'sse',
  version: packageJson.version,
})

server.start()
