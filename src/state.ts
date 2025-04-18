import type { Branch } from '@neondatabase/api-client'

type MigrationDetails = {
  appliedBranch: Branch
  databaseName: string
  migrationSql: string
}
type MigrationId = string

const migrationsState = new Map<MigrationId, MigrationDetails>()

export function getMigrationFromMemory(migrationId: string) {
  return migrationsState.get(migrationId)
}

export function persistMigrationToMemory(migrationId: string, migrationDetails: MigrationDetails) {
  migrationsState.set(migrationId, migrationDetails)
}
