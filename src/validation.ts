import {
  DecisionSchema,
  BackupEnvelopeSchema,
  MAX_BACKUP_BYTES,
  MAX_DECISIONS,
  type Decision
} from './schemas/decision.schema.ts'

export function isValidDecision(value: unknown): value is Decision {
  return DecisionSchema.safeParse(value).success
}

export function parseBackupText(text: string): Decision[] {
  if (new TextEncoder().encode(text).byteLength > MAX_BACKUP_BYTES) {
    throw new Error('Backup is larger than 10 MB.')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Malformed JSON.')
  }

  const result = BackupEnvelopeSchema.safeParse(parsed)
  if (!result.success) {
    throw new Error('Backup structure is invalid.')
  }

  const rawDecisions = Array.isArray(result.data) ? result.data : result.data.decisions
  if (!rawDecisions || rawDecisions.length > MAX_DECISIONS) {
    throw new Error('Backup structure is invalid.')
  }

  const ids = new Set<string>()
  for (const decision of rawDecisions) {
    if (ids.has(decision.id)) {
      throw new Error('Backup contains duplicate decision IDs.')
    }
    ids.add(decision.id)
  }

  return rawDecisions
}
