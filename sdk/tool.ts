import type { Tool, ToolParameters } from './types'

export function defineTool<S extends Record<string, any>, P extends ToolParameters = ToolParameters>(tool: Tool<P, S>) {
  return tool
}
