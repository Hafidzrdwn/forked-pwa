import { storeToRefs } from 'pinia'
import { useDecisionStore } from '../stores/decision.store'

export { useDecisionStore }

export function useDecisions() {
  const store = useDecisionStore()
  const refs = storeToRefs(store)

  return {
    // Reactive State & Getters
    decisions: refs.decisions,
    activeId: refs.activeId,
    searchTerm: refs.searchTerm,
    busy: refs.busy,
    notice: refs.notice,
    activeDecision: refs.activeDecision,
    filteredDecisions: refs.filteredDecisions,
    activeScenario: refs.activeScenario,
    sortedScenarios: refs.sortedScenarios,
    totalDecisions: refs.totalDecisions,
    openDecisions: refs.openDecisions,
    reviewedDecisions: refs.reviewedDecisions,
    decidedDecisions: refs.decidedDecisions,
    nextReview: refs.nextReview,

    // Store Actions
    flash: store.flash,
    load: store.load,
    createDecision: store.createDecision,
    deleteActiveDecision: store.deleteActiveDecision,
    addScenarioToActive: store.addScenarioToActive,
    removeScenarioFromActive: store.removeScenarioFromActive,
    chooseScenario: store.chooseScenario,
    updateScenario: store.updateScenario,
    addAssumptionToScenario: store.addAssumptionToScenario,
    toggleAssumption: store.toggleAssumption,
    removeAssumption: store.removeAssumption,
    saveJournal: store.saveJournal,
    updateDecisionWeights: store.updateDecisionWeights,
    updateReviewDate: store.updateReviewDate,
    exportBackup: store.exportBackup,
    importBackupFile: store.importBackupFile
  }
}
