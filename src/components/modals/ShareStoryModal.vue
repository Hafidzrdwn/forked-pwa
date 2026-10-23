<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { X, Download, Share2, Copy, Check, Smartphone, Square } from '../common/AppIcons'
import type { Decision, Scenario } from '../../types'
import { scoreScenario, formatRupiah } from '../../services/scoring'
import { useI18n } from '../../i18n'

const props = defineProps<{
  decision: Decision
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t, locale, interpolate } = useI18n()

type CardFormat = 'story' | 'feed'
const format = ref<CardFormat>('story')
const canvasRef = ref<HTMLCanvasElement | null>(null)
const copied = ref(false)
const downloaded = ref(false)
const sharing = ref(false)

const chosenScenario = computed<Scenario>(() => {
  if (props.decision.selectedScenarioId) {
    const found = props.decision.scenarios.find(s => s.id === props.decision.selectedScenarioId)
    if (found) return found
  }
  const scored = [...props.decision.scenarios].sort((a, b) => {
    return scoreScenario(b, props.decision.weights).total - scoreScenario(a, props.decision.weights).total
  })
  return scored[0] || props.decision.scenarios[0]
})

const alternativeScenarios = computed<Scenario[]>(() => {
  const others = props.decision.scenarios.filter(s => s.id !== chosenScenario.value.id)
  return format.value === 'feed' ? others.slice(0, 1) : others.slice(0, 2)
})

/* ------------------------------------------------------------------ */
/* Canvas helpers                                                      */
/* ------------------------------------------------------------------ */

const FONT_DISPLAY = 'Manrope, sans-serif'
const FONT_BODY = '"DM Sans", sans-serif'

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawBrandLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save()
  const s = size / 48
  ctx.translate(x, y)
  ctx.scale(s, s)

  const grad = ctx.createLinearGradient(6, 4, 42, 44)
  grad.addColorStop(0, '#347852')
  grad.addColorStop(0.5, '#245d3e')
  grad.addColorStop(1, '#143b27')

  roundRect(ctx, 2, 2, 44, 44, 14)
  ctx.fillStyle = grad
  ctx.fill()

  const path1 = new Path2D('M24 38V25C24 20 15 19 15 13V9')
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 3.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke(path1)

  const path2 = new Path2D('M24 27C24 20 33 19 33 13V9')
  ctx.strokeStyle = '#A7DEC0'
  ctx.lineWidth = 3.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke(path2)

  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(24, 27, 3.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#245d3e'
  ctx.beginPath()
  ctx.arc(24, 27, 1.4, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(15, 9, 3, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#A7DEC0'
  ctx.beginPath()
  ctx.arc(33, 9, 3.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#143b27'
  ctx.beginPath()
  ctx.arc(33, 9, 1.5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#A7DEC0'
  ctx.beginPath()
  ctx.arc(24, 38, 2.2, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

function setFont(ctx: CanvasRenderingContext2D, weight: number, size: number, family: string) {
  ctx.font = `${weight} ${size}px ${family}`
}

/** Potong teks + "…" sampai muat di maxWidth (font harus sudah di-set). */
function truncateWithEllipsis(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  let s = text
  while (s.length > 0 && ctx.measureText(`${s}…`).width > maxWidth) s = s.slice(0, -1)
  return `${s.trimEnd()}…`
}

/** Pecah teks menjadi baris-baris (maks maxLines), baris terakhir diberi "…" jika terpotong. */
function computeLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const all: string[] = []
  let line = ''

  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (line && ctx.measureText(test).width > maxWidth) {
      all.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) all.push(line)

  const lines = all.slice(0, maxLines)
  if (all.length > maxLines && lines.length > 0) {
    const last = lines[lines.length - 1]
    lines[lines.length - 1] = truncateWithEllipsis(ctx, last, maxWidth)
  }

  // kata tunggal yang terlalu panjang
  return lines.map(l => (ctx.measureText(l).width > maxWidth ? truncateWithEllipsis(ctx, l, maxWidth) : l))
}

function drawLines(ctx: CanvasRenderingContext2D, lines: string[], x: number, y: number, lineHeight: number): number {
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight))
  return y + lines.length * lineHeight
}

/** Kecilkan font sampai teks muat di maxWidth. Mengembalikan ukuran akhir. */
function fitFont(
  ctx: CanvasRenderingContext2D,
  weight: number,
  size: number,
  family: string,
  text: string,
  maxWidth: number,
  minSize: number
): number {
  let s = size
  setFont(ctx, weight, s, family)
  while (s > minSize && ctx.measureText(text).width > maxWidth) {
    s -= 2
    setFont(ctx, weight, s, family)
  }
  return s
}

function hLine(ctx: CanvasRenderingContext2D, x1: number, x2: number, y: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(x1, y, x2 - x1, 2)
}

/* ------------------------------------------------------------------ */
/* Render kartu                                                        */
/*                                                                     */
/* Hierarki:  pertanyaan (redup) → jawaban (besar) → skor (aksen)      */
/*            → 2 metrik utama → pembanding (ringkas) → footer         */
/* ------------------------------------------------------------------ */

function renderCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const isStory = format.value === 'story'
  const v = (story: number, feed: number) => (isStory ? story : feed)

  const W = 1080
  const H = isStory ? 1920 : 1080
  canvas.width = W
  canvas.height = H
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'

  const WHITE = '#FFFFFF'
  const SOFT = 'rgba(255, 255, 255, 0.72)'
  const MUTED = 'rgba(255, 255, 255, 0.55)'
  const LINE = 'rgba(255, 255, 255, 0.12)'
  const ACCENT = '#34D399'

  const isId = locale.value === 'id'
  const chosen = chosenScenario.value
  const chosenScore = scoreScenario(chosen, props.decision.weights)
  const chosenNet = chosen.monthlyIncome - chosen.monthlyCost
  const isChosen = !!props.decision.selectedScenarioId
  const alts = alternativeScenarios.value
  const hasAlt = alts.length > 0

  // ---- Background: satu warna solid + satu cahaya halus ----
  ctx.fillStyle = '#0a0e0c'
  ctx.fillRect(0, 0, W, H)

  const glow = ctx.createRadialGradient(W, 0, 0, W, 0, isStory ? 1100 : 760)
  glow.addColorStop(0, 'rgba(52, 211, 153, 0.15)')
  glow.addColorStop(1, 'rgba(52, 211, 153, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // ---- Grid dasar ----
  // Story: sisakan area aman atas/bawah agar tidak tertutup UI Instagram.
  const padX = v(88, 64)
  const contentW = W - padX * 2
  const right = padX + contentW
  let y = v(120, 60)

  // ---- 1. Header: logo + nama brand (kiri), tanggal (kanan) ----
  const logo = v(60, 48)
  drawBrandLogo(ctx, padX, y, logo)

  ctx.textBaseline = 'middle'
  setFont(ctx, 800, v(36, 28), FONT_DISPLAY)
  ctx.fillStyle = WHITE
  ctx.fillText('FORKED', padX + logo + v(20, 16), y + logo / 2 + 1)

  const dateFormatted = new Intl.DateTimeFormat(isId ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${props.decision.createdAt}T12:00:00`))

  setFont(ctx, 600, v(26, 20), FONT_BODY)
  ctx.fillStyle = MUTED
  ctx.textAlign = 'right'
  ctx.fillText(dateFormatted, right, y + logo / 2 + 1)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  y += logo + v(100, 56)

  // ---- 2. Pertanyaan keputusan (redup, ukuran sedang) ----
  const titleLong = props.decision.title.length > v(60, 50)
  const titleSize = titleLong ? v(44, 32) : v(52, 38)
  const titleLH = Math.round(titleSize * 1.18)
  setFont(ctx, 700, titleSize, FONT_DISPLAY)
  ctx.fillStyle = SOFT
  const titleLines = computeLines(ctx, props.decision.title, contentW, v(3, 2))
  y = drawLines(ctx, titleLines, padX, y, titleLH)

  const contextText = (props.decision.context ?? '').trim()
  if (contextText) {
    const ctxMaxH = v(240, 110)
    const ctxMinSize = v(24, 18)
    let ctxSize = v(30, 22)
    let ctxLines: string[] = []

    for (; ;) {
      setFont(ctx, 500, ctxSize, FONT_BODY)
      ctxLines = computeLines(ctx, contextText, contentW, Infinity)
      if (ctxLines.length * Math.round(ctxSize * 1.4) <= ctxMaxH || ctxSize <= ctxMinSize) break
      ctxSize -= 2
    }

    y += v(20, 12)
    ctx.fillStyle = MUTED
    y = drawLines(ctx, ctxLines, padX, y, Math.round(ctxSize * 1.4))
  }
  y += v(56, 28)

  // ---- 3. Footer (posisi dihitung dulu agar konten mengisi sisa ruang) ----
  const footerH = v(56, 44)
  const footerY = H - v(150, 48) - footerH
  const contentBottom = footerY - v(56, 28)

  // ---- 4. Ukuran blok pembanding ----
  const altRowH = v(96, 72)
  const altHeaderH = v(48, 36)
  const altGap = v(48, 28)
  const altSectionH = hasAlt ? altHeaderH + alts.length * altRowH : 0

  // ---- 5. Hero: jawaban terpilih ----
  const heroTop = y
  const heroBottom = contentBottom - altSectionH - (hasAlt ? altGap : 0)

  const badgeH = v(32, 26)

  const nameSize = v(76, 44)
  const nameLH = v(88, 52)
  setFont(ctx, 800, nameSize, FONT_DISPLAY)
  const nameLines = computeLines(ctx, chosen.name, contentW, v(3, 2))
  const nameH = nameLines.length * nameLH

  const scoreLabelSize = v(24, 20)
  const scoreNumSize = v(150, 88)
  const scoreNumBox = Math.round(scoreNumSize * 0.82)
  const barH = v(12, 8)
  const scoreH = scoreLabelSize + v(14, 10) + scoreNumBox + v(24, 14) + barH

  const metricsH = v(122, 86)

  const blocksTotal = badgeH + nameH + scoreH + metricsH
  const gapMin = v(28, 16)
  const gapMax = v(64, 40)

  const heroH = Math.max(heroBottom - heroTop, blocksTotal + gapMin * 3)
  const gap = Math.min(gapMax, (heroH - blocksTotal) / 3)
  const offset = Math.max(0, (heroH - blocksTotal - gap * 3) / 2)

  let cy = heroTop + offset

  // 5a. Status (titik + teks, tanpa pill)
  const statusText = isChosen ? t.value.shareModal.badgeChosen : t.value.shareModal.badgeExploring
  const dot = v(14, 11)
  ctx.fillStyle = isChosen ? ACCENT : MUTED
  ctx.beginPath()
  ctx.arc(padX + dot / 2, cy + badgeH / 2, dot / 2, 0, Math.PI * 2)
  ctx.fill()

  ctx.textBaseline = 'middle'
  setFont(ctx, 700, v(26, 20), FONT_BODY)
  ctx.fillStyle = isChosen ? ACCENT : MUTED
  ctx.fillText(statusText, padX + dot + v(14, 10), cy + badgeH / 2 + 1)
  ctx.textBaseline = 'top'
  cy += badgeH + gap

  // 5b. Nama pilihan (elemen teks terbesar)
  setFont(ctx, 800, nameSize, FONT_DISPLAY)
  ctx.fillStyle = WHITE
  drawLines(ctx, nameLines, padX, cy, nameLH)
  cy += nameH + gap

  // 5c. Skor kecocokan (satu-satunya elemen beraksen)
  setFont(ctx, 600, scoreLabelSize, FONT_BODY)
  ctx.fillStyle = MUTED
  ctx.fillText(isId ? 'Skor kecocokan' : 'Fit score', padX, cy)

  const numTop = cy + scoreLabelSize + v(14, 10)
  const numBaseline = numTop + scoreNumSize * 0.78
  const scoreNum = `${chosenScore.total}`

  ctx.textBaseline = 'alphabetic'
  setFont(ctx, 800, scoreNumSize, FONT_DISPLAY)
  ctx.fillStyle = ACCENT
  ctx.fillText(scoreNum, padX, numBaseline)
  const scoreNumW = ctx.measureText(scoreNum).width

  setFont(ctx, 700, v(40, 26), FONT_DISPLAY)
  ctx.fillStyle = MUTED
  ctx.fillText('/100', padX + scoreNumW + v(12, 8), numBaseline)
  ctx.textBaseline = 'top'

  const barY = numTop + scoreNumBox + v(24, 14)
  const pct = Math.max(0, Math.min(100, chosenScore.total)) / 100
  roundRect(ctx, padX, barY, contentW, barH, barH / 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.10)'
  ctx.fill()

  const fillW = Math.max(barH, contentW * pct)
  const barGrad = ctx.createLinearGradient(padX, 0, padX + fillW, 0)
  barGrad.addColorStop(0, '#34D399')
  barGrad.addColorStop(1, '#A7F3D0')
  roundRect(ctx, padX, barY, fillW, barH, barH / 2)
  ctx.fillStyle = barGrad
  ctx.fill()

  cy += scoreH + gap

  // 5d. Dua metrik utama (tanpa kotak, dipisah garis tipis)
  hLine(ctx, padX, right, cy, LINE)

  const colW = contentW / 2
  const colPad = v(36, 24)
  const metricTop = cy + v(32, 20)
  const labelSize = v(24, 20)
  const valueTop = metricTop + labelSize + v(14, 10)

  const netVal = formatRupiah(chosenNet)
  const timeVal = `${chosen.hoursPerWeek} ${t.value.common.hrs} / ${isId ? 'mgg' : 'wk'}`
  const metrics = [
    { label: t.value.shareModal.badgeNet, val: netVal, x: padX, maxW: colW - colPad, color: chosenNet < 0 ? '#F87171' : WHITE },
    { label: t.value.shareModal.badgeTime, val: timeVal, x: padX + colW + colPad, maxW: colW - colPad, color: WHITE }
  ]

  for (const m of metrics) {
    setFont(ctx, 600, labelSize, FONT_BODY)
    ctx.fillStyle = MUTED
    ctx.fillText(m.label, m.x, metricTop)

    fitFont(ctx, 800, v(52, 36), FONT_DISPLAY, m.val, m.maxW, v(30, 22))
    ctx.fillStyle = m.color
    ctx.fillText(m.val, m.x, valueTop)
  }

  ctx.fillStyle = LINE
  ctx.fillRect(padX + colW, metricTop, 2, cy + metricsH - metricTop)

  // ---- 6. Pembanding: hanya nama + skor ----
  if (hasAlt) {
    let ay = heroTop + heroH + altGap

    setFont(ctx, 600, v(24, 20), FONT_BODY)
    ctx.fillStyle = MUTED
    ctx.fillText(isId ? 'Dibandingkan opsi lain' : 'Compared with alternatives', padX, ay)
    ay += altHeaderH

    for (const alt of alts) {
      const altScore = scoreScenario(alt, props.decision.weights).total
      hLine(ctx, padX, right, ay, LINE)

      const midY = ay + altRowH / 2 + 1
      ctx.textBaseline = 'middle'

      // skor di kanan: "72" + "/100"
      setFont(ctx, 700, v(22, 16), FONT_DISPLAY)
      const subW = ctx.measureText('/100').width
      setFont(ctx, 800, v(40, 28), FONT_DISPLAY)
      const numStr = `${altScore}`
      const numW = ctx.measureText(numStr).width
      const scoreLeft = right - subW - numW - v(8, 6)

      ctx.fillStyle = WHITE
      ctx.fillText(numStr, scoreLeft, midY)
      setFont(ctx, 700, v(22, 16), FONT_DISPLAY)
      ctx.fillStyle = MUTED
      ctx.fillText('/100', right - subW, midY)

      // nama di kiri
      setFont(ctx, 700, v(32, 24), FONT_DISPLAY)
      ctx.fillStyle = SOFT
      const [altName] = computeLines(ctx, alt.name, scoreLeft - padX - v(32, 20), 1)
      ctx.fillText(altName ?? '', padX, midY)

      ctx.textBaseline = 'top'
      ay += altRowH
    }
  }

  // ---- 7. Footer: tanpa kotak, hanya garis tipis ----
  hLine(ctx, padX, right, footerY - v(28, 14), LINE)

  const fMid = footerY + footerH / 2 + 1
  const fLogo = v(40, 32)
  drawBrandLogo(ctx, padX, footerY + footerH / 2 - fLogo / 2, fLogo)

  ctx.textBaseline = 'middle'
  setFont(ctx, 800, v(26, 20), FONT_DISPLAY)
  ctx.fillStyle = WHITE
  ctx.fillText('FORKED', padX + fLogo + v(16, 12), fMid)

  setFont(ctx, 700, v(24, 18), FONT_BODY)
  ctx.fillStyle = MUTED
  ctx.textAlign = 'right'
  ctx.fillText('forked.hafidzrdwn.dev', right, fMid)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
}

async function downloadImage() {
  const canvas = canvasRef.value
  if (!canvas) return

  const rawTitle = props.decision.title.trim().toLowerCase()
  const cleanTitle = rawTitle.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'keputusan'
  const filename = `forked-${cleanTitle}-${format.value}.png`

  if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: 'PNG Image (*.png)',
            accept: { 'image/png': ['.png'] }
          }
        ]
      })
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (blob) {
        const writable = await handle.createWritable()
        await writable.write(blob)
        await writable.close()
        downloaded.value = true
        setTimeout(() => { downloaded.value = false }, 3000)
        return
      }
    } catch (err: any) {
      if (err && err.name === 'AbortError') {
        return
      }
    }
  }

  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.style.position = 'fixed'
  link.style.left = '-9999px'
  link.style.top = '-9999px'
  link.href = dataUrl
  link.setAttribute('download', filename)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    if (link.parentNode) {
      link.parentNode.removeChild(link)
    }
  }, 600)

  downloaded.value = true
  setTimeout(() => { downloaded.value = false }, 3000)
}

function getShareUrl(): string {
  if (typeof window === 'undefined') return 'https://forked.hafidzrdwn.dev'
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'https://forked.hafidzrdwn.dev'
  }
  return window.location.origin
}

async function shareNative() {
  const canvas = canvasRef.value
  if (!canvas) return
  sharing.value = true

  const chosen = chosenScenario.value
  const score = scoreScenario(chosen, props.decision.weights).total
  const shareText = interpolate(t.value.shareModal.shareTextTemplate, {
    title: props.decision.title,
    chosen: chosen.name,
    score: score,
    url: getShareUrl()
  })

  try {
    if (navigator.share) {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          await navigator.share({
            title: props.decision.title,
            text: shareText,
            url: getShareUrl()
          })
          sharing.value = false
          return
        }

        const file = new File([blob], `forked-decision-${format.value}.png`, { type: 'image/png' })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: props.decision.title,
            text: shareText,
            files: [file]
          })
        } else {
          await navigator.share({
            title: props.decision.title,
            text: shareText,
            url: getShareUrl()
          })
        }
        sharing.value = false
      }, 'image/png')
    } else {
      await navigator.clipboard.writeText(shareText)
      copied.value = true
      setTimeout(() => { copied.value = false }, 2500)
      sharing.value = false
    }
  } catch {
    sharing.value = false
  }
}

async function copyTextSummary() {
  const chosen = chosenScenario.value
  const score = scoreScenario(chosen, props.decision.weights).total
  const shareText = interpolate(t.value.shareModal.shareTextTemplate, {
    title: props.decision.title,
    chosen: chosen.name,
    score: score,
    url: getShareUrl()
  })

  await navigator.clipboard.writeText(shareText)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2500)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

watch(format, () => {
  nextTick(() => renderCanvas())
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  if (typeof document !== 'undefined' && document.fonts) {
    document.fonts.ready.then(() => renderCanvas())
  }
  nextTick(() => renderCanvas())
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-6" role="dialog"
    aria-modal="true" aria-labelledby="share-modal-title" @click.self="emit('close')">
    <div
      class="w-full max-w-2xl max-h-[92vh] flex flex-col bg-surface border border-border rounded-2xl shadow-2xl text-fg overflow-hidden">
      <div class="p-4 md:p-5 border-b border-border flex items-center justify-between gap-4">
        <div>
          <h2 id="share-modal-title" class="font-display font-bold text-lg md:text-xl text-fg m-0">
            {{ t.shareModal.title }}
          </h2>
        </div>
        <button type="button"
          class="w-8 h-8 rounded-xl border border-border bg-surface text-fg-muted hover:text-fg hover:bg-canvas-subtle grid place-items-center transition-colors cursor-pointer"
          :aria-label="t.common.close" @click="emit('close')">
          <X :size="17" />
        </button>
      </div>

      <div class="p-4 md:p-5 overflow-y-auto flex-1 flex flex-col items-center">
        <div class="inline-flex items-center gap-1.5 p-1 bg-canvas-subtle border border-border rounded-xl mb-4">
          <button type="button" :class="[
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
            format === 'story' ? 'bg-primary text-white shadow-2xs' : 'text-fg-muted hover:text-fg'
          ]" @click="format = 'story'">
            <Smartphone :size="13" />
            {{ t.shareModal.formatStory }}
          </button>
          <button type="button" :class="[
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
            format === 'feed' ? 'bg-primary text-white shadow-2xs' : 'text-fg-muted hover:text-fg'
          ]" @click="format = 'feed'">
            <Square :size="13" />
            {{ t.shareModal.formatFeed }}
          </button>
        </div>

        <div class="w-full flex justify-center py-2 bg-canvas-subtle/50 rounded-2xl border border-border p-3">
          <canvas ref="canvasRef"
            class="max-h-[50vh] w-auto max-w-full rounded-xl shadow-2xl border border-border/80 object-contain" />
        </div>

        <p class="text-xs text-fg-muted text-center mt-3 max-w-md">
          {{ t.shareModal.intro }}
        </p>
      </div>

      <div class="p-4 md:p-5 border-t border-border bg-canvas-subtle flex flex-wrap items-center justify-between gap-3">
        <button type="button"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-fg-muted hover:text-fg cursor-pointer transition-colors"
          @click="copyTextSummary">
          <Check v-if="copied" :size="14" class="text-primary" />
          <Copy v-else :size="14" />
          {{ copied ? t.shareModal.copiedNotice : t.shareModal.copySummary }}
        </button>

        <div class="flex items-center gap-2 ml-auto">
          <button type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-fg hover:bg-canvas transition-colors cursor-pointer shadow-xs"
            @click="shareNative">
            <Share2 :size="14" />
            {{ t.shareModal.shareNative }}
          </button>
          <button type="button"
            class="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors cursor-pointer shadow-xs"
            @click="downloadImage">
            <Check v-if="downloaded" :size="14" />
            <Download v-else :size="14" />
            {{ downloaded ? t.shareModal.downloadedNotice : t.shareModal.downloadPng }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>