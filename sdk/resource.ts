import type { Parameters, Resource, ResourceTemplate, ServerSession } from './types'

export function defineResource<S extends ServerSession>(resource: Resource<S>) {
  return resource
}

export function defineResourceTemplate<S extends ServerSession = ServerSession, P extends Parameters = Parameters>(
  resourceTemplate: ResourceTemplate<P, S>,
) {
  return resourceTemplate
}
