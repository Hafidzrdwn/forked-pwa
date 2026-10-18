import { z } from 'zod'

export const MAX_BACKUP_BYTES = 10 * 1024 * 1024
export const MAX_DECISIONS = 5000
export const MAX_SCENARIOS_PER_DECISION = 50
export const MAX_ASSUMPTIONS_PER_SCENARIO = 200

const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD').refine((val) => {
  const [year, month, day] = val.split('-').map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day
}, 'Tanggal kalender tidak valid')

export const AssumptionKindSchema = z.enum(['assumption', 'fact', 'estimate'])
export const AssumptionStatusSchema = z.enum(['untested', 'confirmed', 'falsified'])

export const AssumptionSchema = z.object({
  id: z.string().min(1, 'ID asumsi wajib diisi').max(200),
  text: z.string().min(1, 'Pernyataan asumsi wajib diisi').max(5000),
  confidence: z.number().min(0).max(100),
  checked: z.boolean(),
  kind: AssumptionKindSchema.optional(),
  status: AssumptionStatusSchema.optional(),
  notes: z.string().max(10000).optional()
})

export const ScenarioSchema = z.object({
  id: z.string().min(1, 'ID skenario wajib diisi').max(200),
  name: z.string().min(1, 'Nama skenario wajib diisi').max(300),
  description: z.string().max(5000).default(''),
  monthlyIncome: z.number().min(0, 'Pemasukan tidak boleh negatif'),
  monthlyCost: z.number().min(0, 'Pengeluaran tidak boleh negatif'),
  hoursPerWeek: z.number().min(0).max(168, 'Jam per minggu maksimal 168 jam'),
  growth: z.number().min(0).max(100),
  risk: z.number().min(0).max(100),
  assumptions: z.array(AssumptionSchema).max(MAX_ASSUMPTIONS_PER_SCENARIO).default([])
}).refine((data) => {
  const ids = new Set<string>()
  for (const a of data.assumptions) {
    if (ids.has(a.id)) return false
    ids.add(a.id)
  }
  return true
}, { message: 'ID asumsi di dalam skenario tidak boleh duplikat' })

export const ScoringWeightsSchema = z.object({
  money: z.number().min(0).max(100),
  time: z.number().min(0).max(100),
  growth: z.number().min(0).max(100),
  risk: z.number().min(0).max(100)
})

export const DecisionJournalSchema = z.object({
  reason: z.string().max(20000).default(''),
  expectedOutcome: z.string().max(20000).default(''),
  actualOutcome: z.string().max(20000).default(''),
  reflection: z.string().max(20000).default(''),
  lastReviewedAt: z.string().optional()
})

export const DecisionStatusSchema = z.enum(['exploring', 'decided', 'reviewed'])

export const DecisionSchema = z.object({
  id: z.string().min(1, 'ID keputusan wajib diisi').max(200),
  title: z.string().min(1, 'Judul keputusan wajib diisi').max(300),
  context: z.string().max(20000).default(''),
  createdAt: DateStringSchema,
  reviewDate: DateStringSchema,
  status: DecisionStatusSchema,
  selectedScenarioId: z.string().max(200).nullable(),
  weights: ScoringWeightsSchema.optional(),
  scenarios: z.array(ScenarioSchema)
    .min(2, 'Keputusan harus memiliki minimal 2 jalur/skenario')
    .max(MAX_SCENARIOS_PER_DECISION, 'Jumlah skenario melebihi batas'),
  journal: DecisionJournalSchema
}).refine((data) => {
  const scenarioIds = new Set(data.scenarios.map(s => s.id))
  if (scenarioIds.size !== data.scenarios.length) {
    return false
  }
  if (data.selectedScenarioId !== null && !scenarioIds.has(data.selectedScenarioId)) {
    return false
  }
  return true
}, { message: 'ID skenario tidak konsisten atau jalur terpilih tidak ditemukan' })

export const BackupEnvelopeSchema = z.union([
  z.array(DecisionSchema),
  z.object({
    app: z.string().optional(),
    version: z.number().optional(),
    decisions: z.array(DecisionSchema)
  })
])

export const CreateDecisionInputSchema = z.object({
  title: z.string().trim().min(3, 'Judul keputusan minimal 3 karakter').max(120, 'Judul maksimal 120 karakter'),
  context: z.string().trim().max(500, 'Konteks maksimal 500 karakter').default('')
})

export const AddScenarioInputSchema = z.object({
  name: z.string().trim().min(2, 'Nama jalan minimal 2 karakter').max(80, 'Nama jalan maksimal 80 karakter'),
  income: z.number().min(0, 'Pemasukan tidak boleh negatif'),
  cost: z.number().min(0, 'Pengeluaran tidak boleh negatif'),
  hours: z.number().min(0).max(168, 'Jam kerja per minggu maksimal 168 jam'),
  growth: z.number().min(0).max(100),
  risk: z.number().min(0).max(100)
})

export const AddAssumptionInputSchema = z.object({
  text: z.string().trim().min(3, 'Pernyataan minimal 3 karakter').max(500, 'Pernyataan maksimal 500 karakter'),
  confidence: z.number().min(0).max(100),
  kind: AssumptionKindSchema.default('assumption')
})

export type AssumptionKind = z.infer<typeof AssumptionKindSchema>
export type AssumptionStatus = z.infer<typeof AssumptionStatusSchema>
export type Assumption = z.infer<typeof AssumptionSchema>
export type Scenario = z.infer<typeof ScenarioSchema>
export type ScoringWeights = z.infer<typeof ScoringWeightsSchema>
export type DecisionJournal = z.infer<typeof DecisionJournalSchema>
export type DecisionStatus = z.infer<typeof DecisionStatusSchema>
export type Decision = z.infer<typeof DecisionSchema>
export type CreateDecisionInput = z.infer<typeof CreateDecisionInputSchema>
export type AddScenarioInput = z.infer<typeof AddScenarioInputSchema>
export type AddAssumptionInput = z.infer<typeof AddAssumptionInputSchema>
