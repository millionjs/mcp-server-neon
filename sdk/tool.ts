import type { Parameters, ServerSession, Tool } from './types'

export function defineTool<S extends ServerSession, P extends Parameters = Parameters>(tool: Tool<P, S>) {
  return tool
}
