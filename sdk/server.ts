import { Server as MCPServer } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js'
import consola from 'consola'
import { startSSEServer } from 'mcp-proxy'
import zodToJsonSchema from 'zod-to-json-schema'

import type { Authenticate, Server, ServerContext, ToolResult } from './types'

import { errorContent } from './utils'

export class MCP<S extends Record<string, any> = Record<string, any>> {
  #authenticate: Authenticate<S> | undefined
  #mcpServer: MCPServer
  #session: S | undefined
  #sse: Server<S>['sse']
  #tools: Server<S>['tools']
  #transport: Server<S>['transport']

  constructor(server: Server<S>) {
    this.#mcpServer = new MCPServer(
      {
        name: server.name,
        version: server.version,
      },
      {
        capabilities: {
          tools: {},
        },
      },
    )
    this.#tools = server.tools
    this.#transport = server.transport
    this.#authenticate = server.authenticate
    this.#sse = server.sse

    this.setupTools()
  }

  setupTools() {
    this.#mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: await Promise.all(
          this.#tools.map(async (tool) => {
            return {
              description: tool.description,
              inputSchema: tool.parameters ? await zodToJsonSchema(tool.parameters) : undefined,
              name: tool.name,
            }
          }),
        ),
      }
    })

    this.#mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = this.#tools.find((tool) => tool.name === request.params.name)

      if (!tool) {
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`)
      }

      let args: any

      if (tool.parameters) {
        const parsed = await tool.parameters['~standard'].validate(request.params.arguments)

        if (parsed.issues) {
          throw new McpError(ErrorCode.InvalidParams, `Invalid ${request.params.name} parameters`)
        }

        args = parsed.value
      }

      let result: ToolResult

      try {
        const context: ServerContext<S> = {
          session: this.#session,
        }

        result = await tool.execute(args, context)
      } catch (error) {
        return errorContent(`Error: ${error}`)
      }

      return result
    })
  }

  async start() {
    if (this.#transport === 'stdio') {
      const transport = new StdioServerTransport()
      await this.#mcpServer.connect(transport)
      consola.success(`server is running on stdio`)
    } else if (this.#transport === 'sse') {
      const endpoint = this.#sse?.endpoint ?? '/sse'
      const port = this.#sse?.port ?? 3000

      await startSSEServer({
        createServer: async (request) => {
          if (this.#authenticate) {
            this.#session = await this.#authenticate(request)
          }

          return this.#mcpServer
        },
        endpoint,
        port,
      })

      consola.success(`server is running on SSE at http://localhost:${port}${endpoint}`)
    } else {
      throw new Error(`Unsupported transport: ${this.#transport}`)
    }
  }
}
