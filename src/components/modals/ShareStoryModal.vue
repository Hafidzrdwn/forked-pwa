<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { X, Download, Share2, Copy, Check, Smartphone, Square, Sparkles } from 'lucide-vue-next'
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

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 4
): number {
  const words = text.split(' ')
  let line = ''
  let linesCount = 0
  let currentY = y

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width

    if (testWidth > maxWidth && n > 0) {
      linesCount++
      if (linesCount >= maxLines) {
        ctx.fillText(line.trim(), x, currentY)
        return currentY + lineHeight
      }
      ctx.fillText(line.trim(), x, currentY)
      line = words[n] + ' '
      currentY += lineHeight
    } else {
      line = testLine
    }
  }

  if (line.trim().length > 0) {
    ctx.fillText(line.trim(), x, currentY)
    currentY += lineHeight
  }

  return currentY
}

function renderCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const isStory = format.value === 'story'
  const W = 1080
  const H = isStory ? 1920 : 1080
  canvas.width = W
  canvas.height = H

  const bgGradient = ctx.createLinearGradient(0, 0, W, H)
  bgGradient.addColorStop(0, '#060a12')
  bgGradient.addColorStop(0.5, '#0b1220')
  bgGradient.addColorStop(1, '#050811')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, W, H)

  const radialTop = ctx.createRadialGradient(W - 80, 80, 20, W - 80, 80, 650)
  radialTop.addColorStop(0, 'rgba(16, 185, 129, 0.22)')
  radialTop.addColorStop(1, 'rgba(16, 185, 129, 0)')
  ctx.fillStyle = radialTop
  ctx.fillRect(0, 0, W, H)

  const radialBottom = ctx.createRadialGradient(80, H - 80, 20, 80, H - 80, 700)
  radialBottom.addColorStop(0, 'rgba(6, 182, 212, 0.16)')
  radialBottom.addColorStop(1, 'rgba(6, 182, 212, 0)')
  ctx.fillStyle = radialBottom
  ctx.fillRect(0, 0, W, H)

  const pad = isStory ? 56 : 40
  const cardW = W - pad * 2
  const cardH = H - pad * 2
  const cardX = pad
  const cardY = pad

  roundRect(ctx, cardX, cardY, cardW, cardH, 36)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.72)'
  ctx.fill()
  ctx.lineWidth = 1.5
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.stroke()

  let cursorY = cardY + (isStory ? 64 : 48)

  const brandX = cardX + 44
  drawBrandLogo(ctx, brandX, cursorY - 20, 46)

  ctx.font = 'bold 26px Manrope, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('FORKED', brandX + 58, cursorY + 11)

  ctx.font = 'bold 13px sans-serif'
  ctx.fillStyle = '#10b981'
  ctx.fillText(t.value.nav.brandSubtitle, brandX + 180, cursorY + 9)

  const dateFormatted = new Intl.DateTimeFormat(locale.value === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${props.decision.createdAt}T12:00:00`))
  ctx.font = 'bold 14px sans-serif'
  const dateW = ctx.measureText(dateFormatted).width + 32
  const dateX = cardX + cardW - dateW - 44
  roundRect(ctx, dateX, cursorY - 18, dateW, 38, 19)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)'
  ctx.fill()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
  ctx.fillText(dateFormatted, dateX + 16, cursorY + 6)

  cursorY += isStory ? 92 : 64

  ctx.font = 'bold 15px sans-serif'
  ctx.fillStyle = '#10b981'
  ctx.fillText(t.value.shareModal.eyebrow, cardX + 44, cursorY)

  cursorY += 36
  const isLongTitle = props.decision.title.length > 55
  ctx.font = isStory
    ? isLongTitle ? 'extrabold 36px Manrope, sans-serif' : 'extrabold 42px Manrope, sans-serif'
    : isLongTitle ? 'extrabold 26px Manrope, sans-serif' : 'extrabold 30px Manrope, sans-serif'
  ctx.fillStyle = '#ffffff'
  cursorY = wrapText(
    ctx,
    props.decision.title,
    cardX + 44,
    cursorY,
    cardW - 88,
    isStory ? (isLongTitle ? 48 : 54) : (isLongTitle ? 36 : 40),
    isStory ? 3 : 2
  )

  if (props.decision.context) {
    cursorY += 6
    ctx.font = 'italic 18px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
    cursorY = wrapText(ctx, `"${props.decision.context}"`, cardX + 44, cursorY, cardW - 88, 26, isStory ? 2 : 1)
  }

  cursorY += isStory ? 38 : 22

  const chosen = chosenScenario.value
  const chosenScore = scoreScenario(chosen, props.decision.weights)
  const chosenNet = chosen.monthlyIncome - chosen.monthlyCost

  const heroBoxH = isStory ? 315 : 200
  const heroBoxX = cardX + 44
  const heroBoxW = cardW - 88

  roundRect(ctx, heroBoxX, cursorY, heroBoxW, heroBoxH, 24)
  const heroGradient = ctx.createLinearGradient(heroBoxX, cursorY, heroBoxX + heroBoxW, cursorY + heroBoxH)
  heroGradient.addColorStop(0, 'rgba(16, 185, 129, 0.16)')
  heroGradient.addColorStop(1, 'rgba(6, 182, 212, 0.08)')
  ctx.fillStyle = heroGradient
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = '#10b981'
  ctx.stroke()

  const badgeX = heroBoxX + 24
  const badgeY = cursorY + 32
  const badgeText = `★  ${props.decision.selectedScenarioId ? t.value.shareModal.badgeChosen : t.value.shareModal.badgeExploring}`
  ctx.font = 'bold 13px sans-serif'
  const badgeWidth = ctx.measureText(badgeText).width + 26
  roundRect(ctx, badgeX, badgeY - 14, badgeWidth, 30, 15)
  ctx.fillStyle = '#10b981'
  ctx.fill()
  ctx.fillStyle = '#060a12'
  ctx.fillText(badgeText, badgeX + 13, badgeY + 6)

  const scoreText = `${chosenScore.total}/100 ${t.value.shareModal.badgeScore}`
  ctx.font = 'bold 18px sans-serif'
  ctx.fillStyle = '#10b981'
  const scoreWidth = ctx.measureText(scoreText).width
  ctx.fillText(scoreText, heroBoxX + heroBoxW - scoreWidth - 24, badgeY + 6)

  ctx.font = isStory ? 'extrabold 30px Manrope, sans-serif' : 'extrabold 22px Manrope, sans-serif'
  ctx.fillStyle = '#ffffff'
  const maxPathTitleW = heroBoxW - 48
  wrapText(ctx, chosen.name, heroBoxX + 24, cursorY + (isStory ? 104 : 76), maxPathTitleW, isStory ? 36 : 28, isStory ? 2 : 1)

  const metricsY = cursorY + (isStory ? 194 : 126)
  const pillGap = 12
  const pillW = (heroBoxW - 48 - pillGap * 2) / 3
  const pillH = isStory ? 74 : 48

  const metricsData = [
    { label: t.value.shareModal.badgeScore, val: `${chosenScore.total} pts` },
    { label: t.value.shareModal.badgeNet, val: formatRupiah(chosenNet) },
    { label: t.value.shareModal.badgeTime, val: `${chosen.hoursPerWeek} ${t.value.common.hrs}` }
  ]

  for (let i = 0; i < 3; i++) {
    const px = heroBoxX + 24 + i * (pillW + pillGap)
    roundRect(ctx, px, metricsY, pillW, pillH, 14)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
    ctx.fill()

    ctx.font = '11px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
    ctx.fillText(metricsData[i].label, px + 14, metricsY + (isStory ? 26 : 18))

    const valStr = metricsData[i].val
    ctx.font = valStr.length > 12
      ? 'bold 14px sans-serif'
      : isStory ? 'bold 18px sans-serif' : 'bold 15px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(valStr, px + 14, metricsY + (isStory ? 54 : 37))
  }

  cursorY += heroBoxH + (isStory ? 36 : 20)

  if (alternativeScenarios.value.length > 0) {
    ctx.beginPath()
    ctx.moveTo(cardX + 44, cursorY + 10)
    ctx.lineTo(cardX + cardW / 2 - 35, cursorY + 10)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    ctx.stroke()

    roundRect(ctx, cardX + cardW / 2 - 25, cursorY - 3, 50, 26, 13)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.fill()
    ctx.font = 'bold 11px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fillText(t.value.shareModal.versus, cardX + cardW / 2 - 9, cursorY + 14)

    ctx.beginPath()
    ctx.moveTo(cardX + cardW / 2 + 35, cursorY + 10)
    ctx.lineTo(cardX + cardW - 44, cursorY + 10)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    ctx.stroke()

    cursorY += 32

    for (const alt of alternativeScenarios.value) {
      const altScore = scoreScenario(alt, props.decision.weights)
      const altNet = alt.monthlyIncome - alt.monthlyCost
      const altH = isStory ? 86 : 64

      roundRect(ctx, cardX + 44, cursorY, cardW - 88, altH, 16)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.fill()
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
      ctx.stroke()

      const altScoreText = `${altScore.total}/100`
      ctx.font = 'bold 17px sans-serif'
      const altScoreW = ctx.measureText(altScoreText).width
      const altScoreX = cardX + cardW - 44 - 24 - altScoreW
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.fillText(altScoreText, altScoreX, cursorY + (isStory ? 50 : 38))

      const maxAltNameW = altScoreX - (cardX + 44 + 24) - 16
      ctx.font = 'bold 17px Manrope, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
      wrapText(ctx, alt.name, cardX + 44 + 24, cursorY + (isStory ? 36 : 28), maxAltNameW, isStory ? 24 : 20, 1)

      ctx.font = '13.5px sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.fillText(`${formatRupiah(altNet)} · ${alt.hoursPerWeek} ${t.value.common.hrs}`, cardX + 44 + 24, cursorY + (isStory ? 66 : 50))

      cursorY += altH + 12
    }
  }

  const ctaH = isStory ? 180 : 120
  const ctaY = cardY + cardH - ctaH - (isStory ? 36 : 20)
  const ctaX = cardX + 44
  const ctaW = cardW - 88

  roundRect(ctx, ctaX, ctaY, ctaW, ctaH, 20)
  const ctaGradient = ctx.createLinearGradient(ctaX, ctaY, ctaX + ctaW, ctaY + ctaH)
  ctaGradient.addColorStop(0, 'rgba(16, 185, 129, 0.12)')
  ctaGradient.addColorStop(1, 'rgba(15, 23, 42, 0.85)')
  ctx.fillStyle = ctaGradient
  ctx.fill()
  ctx.lineWidth = 1.5
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)'
  ctx.stroke()

  ctx.font = 'bold 15px Manrope, sans-serif'
  const btnText = t.value.shareModal.ctaUrl
  const btnW = ctx.measureText(btnText).width + 36
  const btnH = isStory ? 44 : 38
  const btnX = ctaX + ctaW - btnW - 24
  const btnY = ctaY + (ctaH - btnH) / 2
  roundRect(ctx, btnX, btnY, btnW, btnH, 12)
  ctx.fillStyle = '#10b981'
  ctx.fill()
  ctx.font = 'bold 15px Manrope, sans-serif'
  ctx.fillStyle = '#060a12'
  ctx.fillText(btnText, btnX + 18, btnY + (btnH / 2) + 5)

  const maxCtaTextW = btnX - ctaX - 40
  ctx.font = isStory ? 'bold 21px Manrope, sans-serif' : 'bold 17px Manrope, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(t.value.shareModal.ctaTitle, ctaX + 24, ctaY + (isStory ? 52 : 44))

  ctx.font = isStory ? '15px sans-serif' : '13px sans-serif'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  wrapText(ctx, t.value.shareModal.ctaSubtitle, ctaX + 24, ctaY + (isStory ? 88 : 72), maxCtaTextW, isStory ? 22 : 18, 2)

  if (isStory) {
    ctx.font = '12px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.fillText('100% Client-side · Tanpa Akun · Data Milikmu', ctaX + 24, ctaY + 138)
  }
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
    url: window.location.origin
  })

  try {
    if (navigator.share) {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          await navigator.share({
            title: props.decision.title,
            text: shareText,
            url: window.location.origin
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
            url: window.location.origin
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
    url: window.location.origin
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
  nextTick(() => renderCanvas())
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    class="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-6"
    role="dialog"
    aria-modal="true"
    aria-labelledby="share-modal-title"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-2xl max-h-[92vh] flex flex-col bg-surface border border-border rounded-2xl shadow-2xl text-fg overflow-hidden">
      <div class="p-4 md:p-5 border-b border-border flex items-center justify-between gap-4">
        <div>
          <div class="text-[11px] font-bold tracking-wider uppercase text-primary mb-1 flex items-center gap-1.5">
            <Sparkles :size="13" />
            {{ t.shareModal.eyebrow }}
          </div>
          <h2 id="share-modal-title" class="font-display font-bold text-lg md:text-xl text-fg m-0">
            {{ t.shareModal.title }}
          </h2>
        </div>
        <button
          type="button"
          class="w-8 h-8 rounded-xl border border-border bg-surface text-fg-muted hover:text-fg hover:bg-canvas-subtle grid place-items-center transition-colors cursor-pointer"
          :aria-label="t.common.close"
          @click="emit('close')"
        >
          <X :size="17" />
        </button>
      </div>

      <div class="p-4 md:p-5 overflow-y-auto flex-1 flex flex-col items-center">
        <div class="inline-flex items-center gap-1.5 p-1 bg-canvas-subtle border border-border rounded-xl mb-4">
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
              format === 'story' ? 'bg-primary text-white shadow-2xs' : 'text-fg-muted hover:text-fg'
            ]"
            @click="format = 'story'"
          >
            <Smartphone :size="13" />
            {{ t.shareModal.formatStory }}
          </button>
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
              format === 'feed' ? 'bg-primary text-white shadow-2xs' : 'text-fg-muted hover:text-fg'
            ]"
            @click="format = 'feed'"
          >
            <Square :size="13" />
            {{ t.shareModal.formatFeed }}
          </button>
        </div>

        <div class="w-full flex justify-center py-2 bg-canvas-subtle/50 rounded-2xl border border-border p-3">
          <canvas
            ref="canvasRef"
            class="max-h-[50vh] w-auto max-w-full rounded-xl shadow-2xl border border-border/80 object-contain"
          />
        </div>

        <p class="text-xs text-fg-muted text-center mt-3 max-w-md">
          {{ t.shareModal.intro }}
        </p>
      </div>

      <div class="p-4 md:p-5 border-t border-border bg-canvas-subtle flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-fg-muted hover:text-fg cursor-pointer transition-colors"
          @click="copyTextSummary"
        >
          <Check v-if="copied" :size="14" class="text-primary" />
          <Copy v-else :size="14" />
          {{ copied ? t.shareModal.copiedNotice : t.shareModal.copySummary }}
        </button>

        <div class="flex items-center gap-2 ml-auto">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-fg hover:bg-canvas transition-colors cursor-pointer shadow-xs"
            @click="shareNative"
          >
            <Share2 :size="14" />
            {{ t.shareModal.shareNative }}
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors cursor-pointer shadow-xs"
            @click="downloadImage"
          >
            <Check v-if="downloaded" :size="14" />
            <Download v-else :size="14" />
            {{ downloaded ? t.shareModal.downloadedNotice : t.shareModal.downloadPng }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
