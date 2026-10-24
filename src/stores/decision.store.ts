import { defineStore } from 'pinia'
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
} from '../services/storage'
import { DEFAULT_WEIGHTS, normalizeWeights, scoreScenario } from '../services/scoring'
import { parseBackupText } from '../services/validation'
import { useToast } from '../composables/useToast'
import { useConfirm } from '../composables/useConfirm'

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

export const useDecisionStore = defineStore('decision', () => {
  const decisions = ref<Decision[]>([])
  const activeId = ref<string | null>(null)
  const searchTerm = ref('')
  const busy = ref(true)
  const notice = ref('')

  const toast = useToast()
  const { confirm: confirmDialog } = useConfirm()

  const activeDecision = computed(() => decisions.value.find(d => d.id === activeId.value) ?? null)

  const filteredDecisions = computed(() => {
    const term = searchTerm.value.trim().toLowerCase()
    if (!term) return decisions.value
    return decisions.value.filter(
      d =>
        d.title.toLowerCase().includes(term) ||
        d.context.toLowerCase().includes(term) ||
        d.scenarios.some(s => s.name.toLowerCase().includes(term))
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

  function makeDecision(
    title: string,
    context = '',
    pathAName = '',
    pathBName = ''
  ): Decision {
    const finalPathA = pathAName.trim() || 'Pilihan A'
    const finalPathB = pathBName.trim() || 'Pilihan B'
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
        makeScenario(finalPathA, 5000000, 1500000, 20, 60, 30),
        makeScenario(finalPathB, 6000000, 2000000, 30, 75, 50)
      ],
      journal: { reason: '', expectedOutcome: '', actualOutcome: '', reflection: '' }
    }
  }

  async function persist(decision: Decision): Promise<void> {
    try {
      await idbPutDecision(decision)
    } catch (err) {
      console.error('Failed to save to IndexedDB:', err)
      flash('Peringatan: Gagal menyimpan data ke IndexedDB.', 'error')
    }
  }

  async function persistAll(): Promise<void> {
    try {
      await idbReplaceAllDecisions(decisions.value)
    } catch (err) {
      console.error('Failed to replace decisions in IndexedDB:', err)
      flash('Peringatan: Gagal memperbarui seluruh data di IndexedDB.', 'error')
    }
  }

  function createSampleSeeds(): Decision[] {
    const seed1 = makeDecision(
      'Pindah ke Bali atau Tetap di Jakarta?',
      'Tawaran kerja remote dengan gaji sama, tapi biaya hidup dan jaringan pertemanan berubah.'
    )
    seed1.scenarios[0].name = 'Jalur A : Tetap di Jakarta (Aman & Stabil)'
    seed1.scenarios[0].monthlyIncome = 15000000
    seed1.scenarios[0].monthlyCost = 8000000
    seed1.scenarios[0].hoursPerWeek = 40
    seed1.scenarios[0].growth = 60
    seed1.scenarios[0].risk = 25
    seed1.scenarios[0].assumptions = [
      {
        id: uid(),
        text: 'Biaya sewa kos di Jakarta stabil selama 1 tahun',
        confidence: 85,
        checked: true,
        kind: 'fact'
      },
      {
        id: uid(),
        text: 'Peluang promosi di kantor saat ini terbuka dalam 6 bulan',
        confidence: 50,
        checked: false,
        kind: 'estimate'
      }
    ]

    seed1.scenarios[1].name = 'Jalur B : Pindah ke Bali (Gaya Hidup & Bertumbuh)'
    seed1.scenarios[1].monthlyIncome = 15000000
    seed1.scenarios[1].monthlyCost = 10500000
    seed1.scenarios[1].hoursPerWeek = 35
    seed1.scenarios[1].growth = 80
    seed1.scenarios[1].risk = 55
    seed1.scenarios[1].assumptions = [
      {
        id: uid(),
        text: 'Bisa fokus hidup sehat dan olahraga di pagi hari',
        confidence: 75,
        checked: false,
        kind: 'assumption'
      },
      {
        id: uid(),
        text: 'Koneksi internet di tempat tinggal Bali cukup stabil untuk video call',
        confidence: 65,
        checked: false,
        kind: 'assumption'
      }
    ]

    const seed2 = makeDecision(
      'Magang atau fokus freelance?',
      'Pilihan antara pengalaman terstruktur di korporat atau fleksibilitas membangun klien mandiri.'
    )
    seed2.scenarios[0].name = 'Jalur A : Magang di Tech Company'
    seed2.scenarios[0].monthlyIncome = 4000000
    seed2.scenarios[0].monthlyCost = 2500000
    seed2.scenarios[0].hoursPerWeek = 45
    seed2.scenarios[0].growth = 85
    seed2.scenarios[0].risk = 20

    seed2.scenarios[1].name = 'Jalur B : Full-time Freelancer'
    seed2.scenarios[1].monthlyIncome = 7000000
    seed2.scenarios[1].monthlyCost = 2000000
    seed2.scenarios[1].hoursPerWeek = 30
    seed2.scenarios[1].growth = 70
    seed2.scenarios[1].risk = 60

    return [seed1, seed2]
  }

  async function loadSampleTemplates(): Promise<void> {
    const seeds = createSampleSeeds()
    decisions.value = [...decisions.value, ...seeds]
    activeId.value = seeds[0].id
    await persistAll()
    if (typeof window !== 'undefined') {
      localStorage.setItem('forked_initialized', 'true')
    }
    flash('2 contoh keputusan berhasil dimuat', 'success')
  }

  async function load(): Promise<void> {
    busy.value = true
    try {
      const stored = await idbGetAllDecisions()
      const hasInitialized = typeof window !== 'undefined' && localStorage.getItem('forked_initialized')

      if (stored.length) {
        decisions.value = stored
        if (typeof window !== 'undefined') {
          localStorage.setItem('forked_initialized', 'true')
        }
      } else if (!hasInitialized) {
        const seeds = createSampleSeeds()
        decisions.value = seeds
        await persistAll()
        if (typeof window !== 'undefined') {
          localStorage.setItem('forked_initialized', 'true')
        }
      } else {
        decisions.value = []
      }

      if (!activeId.value && decisions.value.length) {
        activeId.value = decisions.value[0].id
      }
    } catch (err) {
      console.error('Failed to load decisions from IndexedDB:', err)
      flash('Gagal membaca data dari perangkat.', 'error')
    } finally {
      busy.value = false
    }
  }

  async function updateDecisionDetails(id: string, title: string, context: string): Promise<boolean> {
    const d = decisions.value.find(item => item.id === id)
    if (!d) return false
    d.title = title.trim()
    d.context = context.trim()
    await persist(d)
    flash('Keputusan berhasil diperbarui', 'success')
    return true
  }

  async function duplicateDecision(id: string): Promise<Decision | null> {
    const source = decisions.value.find(item => item.id === id)
    if (!source) return null
    const cloned: Decision = {
      ...JSON.parse(JSON.stringify(source)),
      id: uid(),
      title: `Salinan - ${source.title}`,
      createdAt: today(),
      status: 'exploring',
      selectedScenarioId: null
    }
    cloned.scenarios = cloned.scenarios.map(s => ({
      ...s,
      id: uid(),
      assumptions: (s.assumptions || []).map(a => ({
        ...a,
        id: uid(),
        checked: false
      }))
    }))
    decisions.value.unshift(cloned)
    activeId.value = cloned.id
    await persist(cloned)
    flash(`Keputusan "${source.title}" berhasil diduplikat`, 'success')
    return cloned
  }

  async function deleteMultipleDecisions(ids: string[]): Promise<void> {
    if (!ids.length) return
    const count = ids.length
    decisions.value = decisions.value.filter(d => !ids.includes(d.id))
    for (const id of ids) {
      try {
        await idbDeleteDecision(id)
      } catch (err) {
        console.error('Failed to delete decision from IDB:', err)
      }
    }
    if (!decisions.value.some(d => d.id === activeId.value)) {
      activeId.value = decisions.value[0]?.id ?? null
    }
    flash(`${count} keputusan berhasil dihapus`, 'info')
  }

  async function createDecision(
    title: string,
    context = '',
    pathAName = '',
    pathBName = ''
  ): Promise<Decision> {
    const d = makeDecision(title, context, pathAName, pathBName)
    decisions.value.unshift(d)
    activeId.value = d.id
    await persist(d)
    flash(`Keputusan "${title}" berhasil dibuat`, 'success')
    return d
  }

  async function deleteActiveDecision(): Promise<void> {
    if (!activeDecision.value) return
    const id = activeDecision.value.id
    const title = activeDecision.value.title
    const idx = decisions.value.findIndex(d => d.id === id)
    if (idx !== -1) {
      decisions.value.splice(idx, 1)
    }
    try {
      await idbDeleteDecision(id)
    } catch (err) {
      console.error('Failed to delete from IndexedDB:', err)
    }
    activeId.value = decisions.value[0]?.id ?? null
    flash(`Keputusan "${title}" telah dihapus`, 'info')
  }

  async function addScenarioToActive(
    name: string,
    income = 5000000,
    cost = 1000000,
    hours = 20,
    growth = 70,
    risk = 35
  ): Promise<Scenario | null> {
    if (!activeDecision.value) return null
    const s = makeScenario(name, income, cost, hours, growth, risk)
    activeDecision.value.scenarios.push(s)
    await persist(activeDecision.value)
    flash(`Pilihan "${name}" ditambahkan`, 'success')
    return s
  }

  async function removeScenarioFromActive(scenarioId: string): Promise<boolean> {
    if (!activeDecision.value) return false
    if (activeDecision.value.scenarios.length <= 2) {
      flash('Setiap keputusan memerlukan minimal 2 pilihan jalan', 'warning')
      return false
    }
    const idx = activeDecision.value.scenarios.findIndex(s => s.id === scenarioId)
    if (idx === -1) return false
    activeDecision.value.scenarios.splice(idx, 1)
    if (activeDecision.value.selectedScenarioId === scenarioId) {
      activeDecision.value.selectedScenarioId = null
    }
    await persist(activeDecision.value)
    flash('Pilihan jalan dihapus', 'info')
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
    const item: Assumption = {
      id: uid(),
      text: text.trim(),
      confidence,
      checked: false,
      kind
    }
    scenario.assumptions.push(item)
    await persist(activeDecision.value)
    flash('Perkiraan ditambahkan', 'success')
  }

  async function toggleAssumption(scenarioId: string, assumptionId: string): Promise<void> {
    if (!activeDecision.value) return
    const scenario = activeDecision.value.scenarios.find(s => s.id === scenarioId)
    if (!scenario) return
    const item = scenario.assumptions.find(a => a.id === assumptionId)
    if (!item) return
    item.checked = !item.checked
    await persist(activeDecision.value)
  }

  async function removeAssumption(scenarioId: string, assumptionId: string): Promise<void> {
    if (!activeDecision.value) return
    const scenario = activeDecision.value.scenarios.find(s => s.id === scenarioId)
    if (!scenario) return
    const idx = scenario.assumptions.findIndex(a => a.id === assumptionId)
    if (idx !== -1) {
      scenario.assumptions.splice(idx, 1)
      await persist(activeDecision.value)
      flash('Perkiraan dihapus', 'info')
    }
  }

  async function saveJournal(
    decisionId: string,
    journal: DecisionJournal,
    status: DecisionStatus
  ): Promise<void> {
    const d = decisions.value.find(item => item.id === decisionId)
    if (!d) return
    d.journal = {
      ...journal,
      lastReviewedAt: today()
    }
    d.status = status
    await persist(d)
    flash('Catatan evaluasi disimpan', 'success')
  }

  async function updateDecisionWeights(
    decisionId: string,
    rawWeights: ScoringWeights
  ): Promise<void> {
    const d = decisions.value.find(item => item.id === decisionId)
    if (!d) return
    d.weights = normalizeWeights(rawWeights)
    await persist(d)
    flash('Bobot penilaian diperbarui', 'success')
  }

  async function updateReviewDate(decisionId: string, reviewDate: string): Promise<void> {
    const d = decisions.value.find(item => item.id === decisionId)
    if (!d) return
    d.reviewDate = reviewDate
    await persist(d)
    flash('Jadwal evaluasi diperbarui', 'success')
  }

  async function exportBackup(): Promise<void> {
    const filename = `forked-backup-${today()}.json`
    const data = {
      app: 'Forked',
      version: 1,
      exportedAt: new Date().toISOString(),
      decisions: JSON.parse(JSON.stringify(decisions.value))
    }
    const jsonString = JSON.stringify(data, null, 2)

    if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: 'Berkas Cadangan Forked (JSON)',
              accept: { 'application/json': ['.json'] }
            }
          ]
        })
        const writable = await handle.createWritable()
        await writable.write(jsonString)
        await writable.close()
        flash(`Berkas "${filename}" berhasil disimpan ke laptopmu.`, 'success')
        return
      } catch (err: any) {
        if (err && err.name === 'AbortError') {
          return
        }
      }
    }

    const blob = new Blob([jsonString], {
      type: 'application/json;charset=utf-8'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = filename
    a.setAttribute('download', filename)
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 2000)
    flash(`Berkas "${filename}" diunduh ke folder Downloads laptopmu.`, 'success')
  }

  async function copyBackupToClipboard(): Promise<boolean> {
    try {
      const data = {
        app: 'Forked',
        version: 1,
        exportedAt: new Date().toISOString(),
        decisions: JSON.parse(JSON.stringify(decisions.value))
      }
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      flash('Data cadangan (JSON) berhasil disalin ke clipboard.', 'success')
      return true
    } catch {
      flash('Gagal menyalin ke clipboard. Gunakan tombol Simpan File Cadangan.', 'error')
      return false
    }
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
    loadSampleTemplates,
    createDecision,
    updateDecisionDetails,
    duplicateDecision,
    deleteActiveDecision,
    deleteMultipleDecisions,
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
    copyBackupToClipboard,
    importBackupFile
  }
})
