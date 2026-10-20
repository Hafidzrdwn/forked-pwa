import { chromium } from 'playwright'

async function runE2ETests() {
  console.log('=== FORKED E2E TEST SUITE STARTING ===')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  const consoleLogs = []
  const pageErrors = []

  page.on('console', msg => {
    const type = msg.type()
    const text = msg.text()
    consoleLogs.push({ type, text })
    if (type === 'error') {
      console.error(`[BROWSER ERROR]: ${text}`)
    }
  })

  page.on('pageerror', err => {
    pageErrors.push(err.message)
    console.error(`[UNCAUGHT PAGE ERROR]: ${err.message}`)
  })

  const results = []
  function recordStep(name, passed, details = '') {
    results.push({ name, passed, details })
    console.log(`${passed ? '✓ PASS' : '✗ FAIL'}: ${name} ${details ? '(' + details + ')' : ''}`)
  }

  try {
    // 1. Initial Load & SEO Meta Tags
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
    const title = await page.title()
    recordStep('App Initial Load', title.includes('Forked'), `Title: ${title}`)

    const appElement = await page.$('#app')
    recordStep('App Mounted to DOM', !!appElement)

    // 2. Language Switcher (ID -> EN -> ID)
    const enBtn = page.locator('button[aria-label="English"]')
    if (await enBtn.isVisible()) {
      await enBtn.click()
      await page.waitForTimeout(300)
      const textEn = await page.textContent('body')
      const hasEnText = textEn.includes('WORKSPACE') || textEn.includes('Overview')
      recordStep('Language Switch to EN', hasEnText)

      const idBtn = page.locator('button[aria-label="Bahasa Indonesia"]')
      await idBtn.click()
      await page.waitForTimeout(300)
      const textId = await page.textContent('body')
      const hasIdText = textId.includes('AREA KERJA') || textId.includes('Ringkasan')
      recordStep('Language Switch to ID', hasIdText)
    }

    // 3. Theme Toggle (Light <-> Dark)
    const themeBtn = page.locator('#theme-toggle-btn')
    recordStep('Theme Toggle Button Exists', await themeBtn.isVisible())
    
    const initialHtmlClass = await page.getAttribute('html', 'class') || ''
    await themeBtn.click()
    await page.waitForTimeout(300)
    const toggledHtmlClass = await page.getAttribute('html', 'class') || ''
    recordStep('Theme Toggle Triggered', initialHtmlClass !== toggledHtmlClass, `Before: "${initialHtmlClass}", After: "${toggledHtmlClass}"`)

    if (!toggledHtmlClass.includes('dark')) {
      await themeBtn.click()
      await page.waitForTimeout(300)
    }

    // 4. Navigation: Overview View (Index 0 in sidebar nav)
    const navOverview = page.locator('aside nav button').nth(0)
    await navOverview.click()
    await page.waitForTimeout(400)
    const overviewHeading = await page.locator('h1').first().textContent()
    recordStep('Navigation to Overview', overviewHeading.includes('Berpikir') || overviewHeading.includes('Think'), `Heading: ${overviewHeading.trim()}`)

    // 5. Navigation: Journal View (Index 2 in sidebar nav)
    const navJournal = page.locator('aside nav button').nth(2)
    await navJournal.click()
    await page.waitForTimeout(400)
    const journalHeading = await page.locator('h1').first().textContent()
    recordStep('Navigation to Journal View', journalHeading.includes('Catatan') || journalHeading.includes('Journal'), `Heading: ${journalHeading.trim()}`)

    // 6. Navigation: Decision Studio View (Index 1 in sidebar nav)
    const navDecisions = page.locator('aside nav button').nth(1)
    await navDecisions.click()
    await page.waitForTimeout(400)
    recordStep('Navigation to Decision Studio', await page.locator('section[aria-label="Decision studio"]').isVisible())

    // 7. Search Filter in Studio Sidebar
    const searchInput = page.locator('aside input[placeholder*="Cari"], aside input[placeholder*="Search"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.fill('Bali')
      await page.waitForTimeout(300)
      const matches = await page.locator('aside button strong:has-text("Bali")').count()
      recordStep('Decision Search Filter', matches > 0, `Matches found: ${matches}`)
      await searchInput.fill('')
      await page.waitForTimeout(300)
    }

    // 8. Create New Decision via Modal
    const newDecisionBtn = page.locator('button:has-text("Tambah Keputusan"), button:has-text("New Decision")').first()
    await newDecisionBtn.click()
    await page.waitForTimeout(400)

    const modalTitle = page.locator('#create-modal-title')
    recordStep('Create Decision Modal Opened', await modalTitle.isVisible())

    // Click template preset (e.g. Startup vs BUMN)
    const templateBtn = page.locator('button:has-text("Startup vs BUMN"), button:has-text("Startup vs Big Corp")').first()
    if (await templateBtn.isVisible()) {
      await templateBtn.click()
      await page.waitForTimeout(200)
    }

    // Customize title and context
    const titleInput = page.locator('form input[placeholder*="contoh:"], form input[placeholder*="e.g."]').first()
    await titleInput.fill('Peluang Bisnis SaaS vs Kerja Korporat')
    
    const contextInput = page.locator('form textarea').first()
    await contextInput.fill('Membandingkan potensi kemandirian dan risiko membangun SaaS sendiri vs stabilitas karier korporat.')

    const submitBtn = page.locator('form button[type="submit"]')
    await submitBtn.click()
    await page.waitForTimeout(600)

    // Check if new decision is active in Studio
    const activeHeader = await page.locator('h2:has-text("Peluang Bisnis SaaS vs Kerja Korporat")').isVisible()
    recordStep('Decision Creation Success', activeHeader, 'Active header displayed')

    // 9. Scenario Cards Rendered & Checked
    const scenarioCards = page.locator('article')
    const countCards = await scenarioCards.count()
    recordStep('Scenario Cards Rendered', countCards >= 2, `Cards count: ${countCards}`)

    // Choose Scenario (Click "Pilih jalan ini" / "Pilih Jalur Ini")
    const chooseBtn = page.locator('article button:has-text("Pilih jalan ini"), article button:has-text("Choose this path")').first()
    if (await chooseBtn.isVisible()) {
      await chooseBtn.click()
      await page.waitForTimeout(400)
      const chosenBadge = page.locator('article button:has-text("Jalan yang kamu pilih"), article button:has-text("Chosen Path")')
      const chosenCount = await chosenBadge.count()
      recordStep('Choose Active Scenario', chosenCount > 0, `Chosen badges: ${chosenCount}`)
    }

    // 10. Add Third Scenario Path
    const addPathBtn = page.locator('button:has-text("Tambah pilihan jalan"), button:has-text("Tambah Jalur"), button:has-text("Add Path")').first()
    if (await addPathBtn.isVisible()) {
      await addPathBtn.click()
      await page.waitForTimeout(300)

      // In DecisionStudioView, the add path form is within section[aria-label="Decision studio"]
      const studioSection = page.locator('section[aria-label="Decision studio"]')
      const pathNameInput = studioSection.locator('form input').first()
      if (await pathNameInput.isVisible()) {
        await pathNameInput.fill('Jalur C : Konsultan Mandiri')
        await page.waitForTimeout(200)
        const submitPathBtn = studioSection.locator('form button[type="submit"]').first()
        await submitPathBtn.click()
        await page.waitForTimeout(500)
      }
      const newCountCards = await page.locator('article').count()
      recordStep('Add Third Scenario Path', newCountCards === countCards + 1, `Total paths: ${newCountCards}`)
    }

    // 11. Assumption Manager (Add, Toggle)
    const addAssumptionBtn = page.locator('section[aria-labelledby="assumptions-heading"] button:has-text("Tambah perkiraan"), button:has-text("Add Assumption")').first()
    if (await addAssumptionBtn.isVisible()) {
      await addAssumptionBtn.click()
      await page.waitForTimeout(300)

      const assumptionForm = page.locator('section[aria-labelledby="assumptions-heading"] form')
      const assumptionTextarea = assumptionForm.locator('textarea').first()
      if (await assumptionTextarea.isVisible()) {
        await assumptionTextarea.fill('Tingkat konversi landing page mencapai minimal 3% dalam 3 bulan')
        await page.waitForTimeout(200)
        const saveAssumptionBtn = assumptionForm.locator('button[type="submit"]').first()
        await saveAssumptionBtn.click()
        await page.waitForTimeout(500)
      }
      const addedText = await page.locator('text=Tingkat konversi landing page').isVisible()
      recordStep('Add Assumption to Scenario', addedText)
    }

    // 12. What-If Simulator (Stress Test & Reactive Sliders)
    const whatIfSection = page.locator('section[aria-labelledby="stress-test-heading"]')
    recordStep('What-If Simulator Section Exists', await whatIfSection.isVisible())
    
    const rangeSliders = whatIfSection.locator('input[type="range"]')
    if (await rangeSliders.count() > 0) {
      await rangeSliders.first().evaluate(el => {
        el.value = '70'
        el.dispatchEvent(new Event('input', { bubbles: true }))
        el.dispatchEvent(new Event('change', { bubbles: true }))
      })
      await page.waitForTimeout(300)
      const resetBtn = whatIfSection.locator('button:has-text("Kembalikan angka asli"), button:has-text("Reset"), button[aria-label="Reset simulation"]')
      const hasReset = await resetBtn.isVisible()
      recordStep('What-If Simulator Reactive Slider', hasReset)
      if (hasReset) {
        await resetBtn.click()
        await page.waitForTimeout(300)
      }
    }

    // 13. Weights Modal
    const weightsBtn = page.locator('button:has-text("Atur bobot"), button:has-text("Bobot"), button:has-text("Weights")').first()
    if (await weightsBtn.isVisible()) {
      await weightsBtn.click()
      await page.waitForTimeout(400)
      const weightsModal = page.locator('div[role="dialog"]')
      recordStep('Weights Modal Opened', await weightsModal.isVisible())

      // Click auto-balance
      const autoBalanceBtn = page.locator('button:has-text("Sesuaikan ke 100%"), button:has-text("Seimbangkan"), button:has-text("Balance")')
      if (await autoBalanceBtn.isVisible()) {
        await autoBalanceBtn.click()
        await page.waitForTimeout(200)
      }

      // Save weights
      const saveWeightsBtn = page.locator('button:has-text("Gunakan bobot ini"), button:has-text("Terapkan Bobot"), button:has-text("Apply")')
      if (await saveWeightsBtn.isVisible()) {
        await saveWeightsBtn.click()
        await page.waitForTimeout(400)
        recordStep('Weights Modal Saved & Closed', !(await weightsModal.isVisible()))
      }
    }

    // 14. Journal Modal (Write & Save Reflection)
    const journalBtn = page.locator('button:has-text("Buka catatan evaluasi"), button:has-text("Tulis Jurnal"), button:has-text("Write Journal")').first()
    if (await journalBtn.isVisible()) {
      await journalBtn.click()
      await page.waitForTimeout(400)
      const journalModal = page.locator('div[role="dialog"]')
      recordStep('Journal Modal Opened', await journalModal.isVisible())

      const reasonTextarea = journalModal.locator('textarea').first()
      if (await reasonTextarea.isVisible()) {
        await reasonTextarea.fill('Memilih jalur mandiri karena potensi pertumbuhan dan kepemilikan aset jangka panjang.')
      }

      const saveJournalBtn = journalModal.locator('button:has-text("Simpan catatan"), button:has-text("Save")').first()
      if (await saveJournalBtn.isVisible()) {
        await saveJournalBtn.click()
        await page.waitForTimeout(400)
        recordStep('Journal Saved & Modal Closed', !(await journalModal.isVisible()))
      }
    }

    // 15. Share Story Modal
    const shareBtn = page.locator('button:has-text("Bagikan Hasil"), button:has-text("Bagikan"), button:has-text("Share")').first()
    if (await shareBtn.isVisible()) {
      await shareBtn.click()
      await page.waitForTimeout(400)
      const shareModal = page.locator('div[role="dialog"]')
      recordStep('Share Story Modal Opened', await shareModal.isVisible())

      const closeBtn = shareModal.locator('button[aria-label="Tutup"], button[aria-label="Close"]').first()
      if (await closeBtn.isVisible()) {
        await closeBtn.click()
        await page.waitForTimeout(300)
        recordStep('Share Story Modal Closed', !(await shareModal.isVisible()))
      }
    }

    // 16. IndexedDB Direct Inspection
    const dbDecisionsCount = await page.evaluate(async () => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open('forked-local', 1)
        req.onsuccess = () => {
          const db = req.result
          const tx = db.transaction('decisions', 'readonly')
          const store = tx.objectStore('decisions')
          const countReq = store.count()
          countReq.onsuccess = () => resolve(countReq.result)
          countReq.onerror = () => reject(countReq.error)
        }
        req.onerror = () => reject(req.error)
      })
    })
    recordStep('IndexedDB Storage Inspection', dbDecisionsCount > 0, `Total decisions stored in IndexedDB: ${dbDecisionsCount}`)

    // 17. Reload Page & Test Local-First Persistence
    console.log('Reloading page to test IndexedDB data persistence...')
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(800)

    // Go to Decision Studio after reload
    await page.locator('aside nav button').nth(1).click()
    await page.waitForTimeout(400)

    // Verify newly created decision is still present after reload
    const persistedTitle = await page.locator('text=Peluang Bisnis SaaS vs Kerja Korporat').first().isVisible()
    recordStep('IndexedDB Persistence After Page Reload', persistedTitle, 'Decision preserved perfectly across session refresh')

    // 18. Check Console & Runtime Health
    const severeConsoleErrors = consoleLogs.filter(l => l.type === 'error' && !l.text.includes('favicon'))
    recordStep('Zero Unhandled Page Errors', pageErrors.length === 0, `Errors: ${pageErrors.length}`)
    recordStep('Zero Critical Console Errors', severeConsoleErrors.length === 0, `Errors: ${severeConsoleErrors.length}`)

  } catch (err) {
    console.error('Test execution exception:', err)
    recordStep('Test Suite Completed Without Exception', false, err.message)
  } finally {
    await browser.close()
    console.log('\n=== FORKED E2E TEST SUMMARY ===')
    const passCount = results.filter(r => r.passed).length
    const failCount = results.filter(r => !r.passed).length
    console.log(`TOTAL: ${results.length} | PASS: ${passCount} | FAIL: ${failCount}`)
    
    process.exit(failCount === 0 ? 0 : 1)
  }
}

runE2ETests()
