import type { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js'
import type { IncomingMessage } from 'node:http'

import {
  AudioContentSchema,
  ImageContentSchema,
  ReadResourceResultSchema,
  ResourceContentsSchema,
  TextContentSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

export const ContentSchema = z.discriminatedUnion('type', [TextContentSchema, ImageContentSchema, AudioContentSchema])

export const ErrorContentSchema = z.object({
  content: z.array(ContentSchema),
  isError: z.boolean(),
})

export type Authenticate<T> = (request: IncomingMessage) => Promise<T>

export type ErrorContent = z.infer<typeof ErrorContentSchema>

export type Parameters = z.ZodType

export type Resource<S extends ServerSession = ServerSession> = {
  description?: string
  mimeType?: string
  name: string
  read: (uri: URL, context: ServerContext<S>) => Promise<z.infer<typeof ReadResourceResultSchema>>
  uri?: string
}

export type ResourceTemplate<P extends Parameters = Parameters, S extends ServerSession = ServerSession> = {
  description?: string
  mimeType?: string
  name: string
  parameters?: P
  read: (uri: URL, params: z.infer<P>, context: ServerContext<S>) => Promise<z.infer<typeof ReadResourceResultSchema>>
  uriTemplate: string
}

export interface Server<S extends ServerSession = ServerSession> {
  authenticate?: Authenticate<S>
  name: string
  resources?: Resource[]
  resourceTemplates?: ResourceTemplate[]
  sse?: {
    endpoint: `/${string}`
    port: number
  }
  tools: Tool<any, S>[]
  transport?: 'http-streamable' | 'sse' | 'stdio'
  version: `${number}.${number}.${number}`
}

export interface ServerContext<T extends ServerSession> {
  session?: T
}

export type ServerSession = Record<string, any>

export { AudioContentSchema, ImageContentSchema, ReadResourceResultSchema, ResourceContentsSchema, TextContentSchema }

export type Tool<P extends Parameters = Parameters, S extends ServerSession = ServerSession> = {
  description?: string
  execute: (args: z.infer<P>, context: ServerContext<S>) => Promise<ToolResult>
  name: string
  parameters?: P
}

export type ToolResult = z.infer<typeof CallToolResultSchema>
