import type { Resource } from './types'

export function defineResource<S extends Record<string, any>>(resource: Resource<S>) {
  return resource
}
