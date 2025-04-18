import type { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js'
import type { IncomingMessage } from 'node:http'

import {
  AudioContentSchema,
  ImageContentSchema,
  ReadResourceResultSchema,
  ResourceContentsSchema,
  ResourceTemplate,
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

export type Resource<S extends Record<string, any> = Record<string, any>> = {
  description?: string
  mimeType?: string
  name: string
  read: (uri: URL, context: ServerContext<S>) => Promise<z.infer<typeof ReadResourceResultSchema>>
  uri?: string
  uriTemplate?: string
}

export interface Server<S extends Record<string, any> = Record<string, any>> {
  authenticate?: Authenticate<S>
  name: string
  resources?: Resource[]
  sse?: {
    endpoint: `/${string}`
    port: number
  }
  tools: Tool<any, S>[]
  transport?: 'http-streamable' | 'sse' | 'stdio'
  version: `${number}.${number}.${number}`
}

export interface ServerContext<T extends Record<string, any>> {
  session?: T
}

export type Tool<P extends ToolParameters = ToolParameters, S extends Record<string, any> = Record<string, any>> = {
  description?: string
  execute: (args: z.infer<P>, context: ServerContext<S>) => Promise<ToolResult>
  name: string
  parameters?: P
}

export {
  AudioContentSchema,
  ImageContentSchema,
  ReadResourceResultSchema,
  ResourceContentsSchema,
  ResourceTemplate,
  TextContentSchema,
}

export type ToolParameters = z.ZodType

export type ToolResult = z.infer<typeof CallToolResultSchema>
