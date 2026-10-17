import { computed, ref } from 'vue'
import type {
  Assumption,
  AssumptionKind,
  Decision,
  DecisionJournal,
  DecisionStatus,
  Scenario,
  ScoringWeights
} from '../types'
import {
  deleteDecision as idbDeleteDecision,
  getAllDecisions as idbGetAllDecisions,
  putDecision as idbPutDecision,
  replaceAllDecisions as idbReplaceAllDecisions
} from '../storage'
import { DEFAULT_WEIGHTS, normalizeWeights, scoreScenario } from '../scoring'
import { parseBackupText } from '../validation'
import { useToast } from './useToast'
import { useConfirm } from './useConfirm'

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

const today = () => new Date().toISOString().slice(0, 10)

const plusDays = (n: number) => {
  const date = new Date()
  date.setDate(date.getDate() + n)
  return date.toISOString().slice(0, 10)
}

export function useDecisions() {
  const decisions = ref<Decision[]>([])
  const activeId = ref<string | null>(null)
  const searchTerm = ref('')
  const busy = ref(true)
  const notice = ref('')

  const activeDecision = computed(() => decisions.value.find(d => d.id === activeId.value) ?? null)

  const filteredDecisions = computed(() => {
    const term = searchTerm.value.trim().toLowerCase()
    if (!term) return decisions.value
    return decisions.value.filter(d =>
      `${d.title} ${d.context}`.toLowerCase().includes(term)
    )
  })

  const activeScenario = computed(() => {
    if (!activeDecision.value) return null
    return (
      activeDecision.value.scenarios.find(
        s => s.id === activeDecision.value?.selectedScenarioId
      ) ?? null
    )
  })

  const sortedScenarios = computed(() => {
    if (!activeDecision.value) return []
    const weights = activeDecision.value.weights ?? DEFAULT_WEIGHTS
    return [...activeDecision.value.scenarios].sort(
      (a, b) => scoreScenario(b, weights).total - scoreScenario(a, weights).total
    )
  })

  const totalDecisions = computed(() => decisions.value.length)
  const openDecisions = computed(() => decisions.value.filter(d => d.status === 'exploring').length)
  const reviewedDecisions = computed(() => decisions.value.filter(d => d.status === 'reviewed').length)
  const decidedDecisions = computed(() => decisions.value.filter(d => d.status === 'decided').length)

  const nextReview = computed(() => {
    const unreviewed = decisions.value
      .filter(d => d.status !== 'reviewed')
      .sort((a, b) => a.reviewDate.localeCompare(b.reviewDate))
    return unreviewed[0] ?? null
  })

  const toast = useToast()
  const { confirm: confirmDialog } = useConfirm()

  function flash(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    notice.value = message
    if (type === 'success') toast.success(message)
    else if (type === 'error') toast.error(message)
    else if (type === 'warning') toast.warning(message)
    else toast.info(message)

    window.setTimeout(() => {
      if (notice.value === message) notice.value = ''
    }, 3500)
  }

  function makeScenario(
    name: string,
    income = 5000000,
    cost = 1000000,
    hours = 20,
    growth = 70,
    risk = 35
  ): Scenario {
    return {
      id: uid(),
      name,
      description: '',
      monthlyIncome: income,
      monthlyCost: cost,
      hoursPerWeek: hours,
      growth,
      risk,
      assumptions: []
    }
  }

  function makeDecision(title: string, context = ''): Decision {
    return {
      id: uid(),
      title,
      context,
      createdAt: today(),
      reviewDate: plusDays(30),
      status: 'exploring',
      selectedScenarioId: null,
      weights: { ...DEFAULT_WEIGHTS },
      scenarios: [
        makeScenario('Jalur A : Pilihan aman & stabil', 4500000, 700000, 18, 55, 20),
        makeScenario('Jalur B : Pilihan bertumbuh cepat', 6000000, 1200000, 28, 85, 55)
      ],
      journal: { reason: '', expectedOutcome: '', actualOutcome: '', reflection: '' }
    }
  }

  async function persist(decision: Decision): Promise<void> {
    try {
      await idbPutDecision(decision)
    } catch (err) {
      console.error('Failed to save to IndexedDB:', err)
      flash('Peringatan: Gagal menyimpan data ke IndexedDB.')
    }
  }

  async function persistAll(): Promise<void> {
    try {
      await idbReplaceAllDecisions(decisions.value)
    } catch (err) {
      console.error('Failed to replace decisions in IndexedDB:', err)
      flash('Peringatan: Gagal memperbarui seluruh data di IndexedDB.')
    }
  }

  async function load(): Promise<void> {
    busy.value = true
    try {
      const existing = await idbGetAllDecisions()
      if (existing.length) {
        decisions.value = existing.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      } else {
        const sample = makeDecision(
          'Magang atau fokus freelance?',
          'Aku ingin berkembang sebagai software engineer tanpa mengorbankan stabilitas finansial dan waktu kuliah.'
        )
        sample.scenarios[0].name = 'Ambil magang terstruktur'
        sample.scenarios[0].monthlyIncome = 1500000
        sample.scenarios[0].monthlyCost = 300000
        sample.scenarios[0].hoursPerWeek = 25
        sample.scenarios[0].growth = 85
        sample.scenarios[0].risk = 25

        sample.scenarios[1].name = 'Fokus bangun klien freelance'
        sample.scenarios[1].monthlyIncome = 4000000
        sample.scenarios[1].monthlyCost = 500000
        sample.scenarios[1].hoursPerWeek = 30
        sample.scenarios[1].growth = 65
        sample.scenarios[1].risk = 60

        sample.scenarios.push(
          makeScenario('Magang part-time + freelance selektif', 3000000, 700000, 40, 90, 75)
        )

        sample.scenarios[0].assumptions.push({
          id: uid(),
          text: 'Jadwal magang konsisten dan mentor bersedia membimbing langsung.',
          confidence: 75,
          checked: false,
          kind: 'assumption',
          status: 'untested'
        })
        sample.scenarios[1].assumptions.push({
          id: uid(),
          text: 'Rata-rata 2 klien baru per bulan dengan pembayaran tepat waktu.',
          confidence: 55,
          checked: false,
          kind: 'estimate',
          status: 'untested'
        })
        sample.scenarios[2].assumptions.push({
          id: uid(),
          text: 'Jadwal kuliah tidak bentrok dengan jam operasional kantor.',
          confidence: 85,
          checked: true,
          kind: 'fact',
          status: 'confirmed'
        })

        decisions.value = [sample]
        await persist(sample)
      }
      activeId.value = decisions.value[0]?.id ?? null
    } catch (error) {
      notice.value = 'Penyimpanan lokal tidak dapat dibuka. Gunakan browser modern dengan IndexedDB aktif.'
      console.error(error)
    } finally {
      busy.value = false
    }
  }

  async function createDecision(title: string, context = ''): Promise<Decision> {
    const d = makeDecision(title.trim(), context.trim())
    decisions.value.unshift(d)
    activeId.value = d.id
    await persist(d)
    flash('Keputusan baru berhasil dibuat')
    return d
  }

  async function deleteActiveDecision(): Promise<void> {
    if (!activeDecision.value) return
    const id = activeDecision.value.id
    decisions.value = decisions.value.filter(d => d.id !== id)
    await idbDeleteDecision(id)
    activeId.value = decisions.value[0]?.id ?? null
    flash('Keputusan berhasil dihapus')
  }

  async function addScenarioToActive(
    name: string,
    income = 5000000,
    cost = 1000000,
    hours = 20,
    growth = 70,
    risk = 35
  ): Promise<void> {
    if (!activeDecision.value || !name.trim()) return
    const scenario = makeScenario(name.trim(), income, cost, hours, growth, risk)
    activeDecision.value.scenarios.push(scenario)
    await persist(activeDecision.value)
    flash('Jalur berhasil ditambahkan')
  }

  async function removeScenarioFromActive(scenarioId: string): Promise<boolean> {
    if (!activeDecision.value) return false
    if (activeDecision.value.scenarios.length <= 2) {
      flash('Pertahankan minimal 2 jalur untuk dibandingkan')
      return false
    }
    activeDecision.value.scenarios = activeDecision.value.scenarios.filter(s => s.id !== scenarioId)
    if (activeDecision.value.selectedScenarioId === scenarioId) {
      activeDecision.value.selectedScenarioId = null
    }
    await persist(activeDecision.value)
    flash('Jalur dihapus')
    return true
  }

  async function chooseScenario(scenarioId: string): Promise<void> {
    if (!activeDecision.value) return
    activeDecision.value.selectedScenarioId = scenarioId
    if (activeDecision.value.status === 'exploring') {
      activeDecision.value.status = 'decided'
    }
    await persist(activeDecision.value)
    flash('Jalur dipilih: skor adalah panduan, bukan vonis mutlak', 'success')
  }

  async function updateScenario(scenario: Scenario): Promise<void> {
    if (activeDecision.value) {
      await persist(activeDecision.value)
    }
  }

  async function addAssumptionToScenario(
    scenarioId: string,
    text: string,
    confidence = 70,
    kind: AssumptionKind = 'assumption'
  ): Promise<void> {
    if (!activeDecision.value || !text.trim()) return
    const scenario = activeDecision.value.scenarios.find(s => s.id === scenarioId)
    if (!scenario) return

    const newAssumption: Assumption = {
      id: uid(),
      text: text.trim(),
      confidence,
      checked: false,
      kind,
      status: 'untested'
    }
    scenario.assumptions.push(newAssumption)
    await persist(activeDecision.value)
    flash('Asumsi berhasil dicatat')
  }

  async function toggleAssumption(scenarioId: string, assumptionId: string): Promise<void> {
    if (!activeDecision.value) return
    const scenario = activeDecision.value.scenarios.find(s => s.id === scenarioId)
    if (!scenario) return
    const item = scenario.assumptions.find(a => a.id === assumptionId)
    if (!item) return

    item.checked = !item.checked
    item.status = item.checked ? 'confirmed' : 'untested'
    await persist(activeDecision.value)
  }

  async function removeAssumption(scenarioId: string, assumptionId: string): Promise<void> {
    if (!activeDecision.value) return
    const scenario = activeDecision.value.scenarios.find(s => s.id === scenarioId)
    if (!scenario) return
    scenario.assumptions = scenario.assumptions.filter(a => a.id !== assumptionId)
    await persist(activeDecision.value)
    flash('Asumsi dihapus')
  }

  async function saveJournal(
    decisionId: string,
    journal: DecisionJournal,
    newStatus?: DecisionStatus
  ): Promise<void> {
    const decision = decisions.value.find(d => d.id === decisionId)
    if (!decision) return

    decision.journal = {
      ...journal,
      lastReviewedAt: today()
    }

    if (newStatus) {
      decision.status = newStatus
    } else if (journal.actualOutcome.trim() || journal.reflection.trim()) {
      decision.status = 'reviewed'
    }

    await persist(decision)
    flash('Jurnal keputusan berhasil disimpan')
  }

  async function updateDecisionWeights(
    decisionId: string,
    weights: ScoringWeights
  ): Promise<void> {
    const decision = decisions.value.find(d => d.id === decisionId)
    if (!decision) return
    decision.weights = normalizeWeights(weights)
    await persist(decision)
    flash('Bobot skoring berhasil diperbarui')
  }

  async function updateReviewDate(decisionId: string, date: string): Promise<void> {
    const decision = decisions.value.find(d => d.id === decisionId)
    if (!decision) return
    decision.reviewDate = date
    await persist(decision)
    flash('Tanggal peninjauan diperbarui')
  }

  function exportBackup(): void {
    const payload = {
      app: 'Forked',
      version: 1,
      exportedAt: new Date().toISOString(),
      decisions: decisions.value
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forked-backup-${today()}.json`
    a.click()
    URL.revokeObjectURL(url)
    flash('Cadangan data berhasil diekspor')
  }

  async function importBackupFile(file: File): Promise<{ ok: boolean; message: string }> {
    try {
      const text = await file.text()
      const imported = parseBackupText(text)
      const confirmed = await confirmDialog({
        title: 'Impor Cadangan Data?',
        message: `Impor ${imported.length} keputusan? Seluruh data yang ada saat ini di perangkat akan digantikan.`,
        confirmText: 'Ya, Impor Data',
        cancelText: 'Batal',
        danger: true
      })
      if (!confirmed) {
        return { ok: false, message: 'Impor dibatalkan oleh pengguna.' }
      }

      decisions.value = imported
      await persistAll()
      activeId.value = decisions.value[0]?.id ?? null
      const note = `Berhasil mengimpor ${imported.length} keputusan.`
      flash(note, 'success')
      return { ok: true, message: note }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Berkas cadangan tidak valid'
      flash(`Gagal mengimpor: ${msg}`, 'error')
      return { ok: false, message: msg }
    }
  }

  return {
    decisions,
    activeId,
    searchTerm,
    busy,
    notice,
    activeDecision,
    filteredDecisions,
    activeScenario,
    sortedScenarios,
    totalDecisions,
    openDecisions,
    reviewedDecisions,
    decidedDecisions,
    nextReview,
    flash,
    load,
    createDecision,
    deleteActiveDecision,
    addScenarioToActive,
    removeScenarioFromActive,
    chooseScenario,
    updateScenario,
    addAssumptionToScenario,
    toggleAssumption,
    removeAssumption,
    saveJournal,
    updateDecisionWeights,
    updateReviewDate,
    exportBackup,
    importBackupFile
  }
}
