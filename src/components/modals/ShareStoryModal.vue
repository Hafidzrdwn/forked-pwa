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
  return props.decision.scenarios.filter(s => s.id !== chosenScenario.value.id).slice(0, 2)
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
        ctx.fillText(line.trim() + '…', x, currentY)
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
  bgGradient.addColorStop(0.5, '#0a101f')
  bgGradient.addColorStop(1, '#050811')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, W, H)

  const radialTop = ctx.createRadialGradient(W - 100, 100, 20, W - 100, 100, 600)
  radialTop.addColorStop(0, 'rgba(16, 185, 129, 0.22)')
  radialTop.addColorStop(1, 'rgba(16, 185, 129, 0)')
  ctx.fillStyle = radialTop
  ctx.fillRect(0, 0, W, H)

  const radialBottom = ctx.createRadialGradient(100, H - 100, 20, 100, H - 100, 700)
  radialBottom.addColorStop(0, 'rgba(6, 182, 212, 0.16)')
  radialBottom.addColorStop(1, 'rgba(6, 182, 212, 0)')
  ctx.fillStyle = radialBottom
  ctx.fillRect(0, 0, W, H)

  const pad = 64
  const cardW = W - pad * 2
  const cardH = H - pad * 2
  const cardX = pad
  const cardY = pad

  roundRect(ctx, cardX, cardY, cardW, cardH, 40)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)'
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.stroke()

  let cursorY = cardY + 70

  const brandX = cardX + 60
  roundRect(ctx, brandX, cursorY - 18, 44, 44, 12)
  ctx.fillStyle = '#10b981'
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(brandX + 15, cursorY + 4, 4, 0, Math.PI * 2)
  ctx.arc(brandX + 29, cursorY - 2, 4, 0, Math.PI * 2)
  ctx.arc(brandX + 29, cursorY + 10, 4, 0, Math.PI * 2)
  ctx.fill()

  ctx.font = 'bold 28px Manrope, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('FORKED', brandX + 58, cursorY + 12)

  ctx.font = 'bold 15px sans-serif'
  ctx.fillStyle = '#10b981'
  ctx.letterSpacing = '2px'
  ctx.fillText(t.value.nav.brandSubtitle, brandX + 185, cursorY + 11)

  roundRect(ctx, cardX + cardW - 250, cursorY - 18, 190, 40, 20)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
  ctx.fill()
  ctx.font = 'bold 14px sans-serif'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.letterSpacing = '0px'
  const dateFormatted = new Intl.DateTimeFormat(locale.value === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${props.decision.createdAt}T12:00:00`))
  ctx.fillText(dateFormatted, cardX + cardW - 230, cursorY + 7)

  cursorY += isStory ? 100 : 75

  ctx.font = 'bold 16px sans-serif'
  ctx.fillStyle = '#10b981'
  ctx.letterSpacing = '2px'
  ctx.fillText(t.value.shareModal.eyebrow, cardX + 60, cursorY)

  cursorY += 42
  ctx.font = isStory ? 'extrabold 46px Manrope, sans-serif' : 'extrabold 36px Manrope, sans-serif'
  ctx.fillStyle = '#ffffff'
  cursorY = wrapText(ctx, props.decision.title, cardX + 60, cursorY, cardW - 120, isStory ? 60 : 48, isStory ? 3 : 2)

  if (props.decision.context) {
    cursorY += 8
    ctx.font = 'italic 20px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    cursorY = wrapText(ctx, `"${props.decision.context}"`, cardX + 60, cursorY, cardW - 120, 30, 2)
  }

  cursorY += isStory ? 45 : 30

  const chosen = chosenScenario.value
  const chosenScore = scoreScenario(chosen, props.decision.weights)
  const chosenNet = chosen.monthlyIncome - chosen.monthlyCost

  const heroBoxH = isStory ? 330 : 220
  const heroBoxX = cardX + 50
  const heroBoxW = cardW - 100

  roundRect(ctx, heroBoxX, cursorY, heroBoxW, heroBoxH, 28)
  const heroGradient = ctx.createLinearGradient(heroBoxX, cursorY, heroBoxX + heroBoxW, cursorY + heroBoxH)
  heroGradient.addColorStop(0, 'rgba(16, 185, 129, 0.16)')
  heroGradient.addColorStop(1, 'rgba(6, 182, 212, 0.08)')
  ctx.fillStyle = heroGradient
  ctx.fill()
  ctx.lineWidth = 2.5
  ctx.strokeStyle = '#10b981'
  ctx.stroke()

  const badgeX = heroBoxX + 32
  const badgeY = cursorY + 36
  roundRect(ctx, badgeX, badgeY - 14, 180, 32, 16)
  ctx.fillStyle = '#10b981'
  ctx.fill()
  ctx.font = 'bold 14px sans-serif'
  ctx.fillStyle = '#060a12'
  ctx.fillText(`★  ${props.decision.selectedScenarioId ? t.value.shareModal.badgeChosen : t.value.shareModal.badgeExploring}`, badgeX + 16, badgeY + 7)

  ctx.font = 'bold 20px sans-serif'
  ctx.fillStyle = '#10b981'
  ctx.fillText(`${chosenScore.total}/100 ${t.value.shareModal.badgeScore}`, heroBoxX + heroBoxW - 170, badgeY + 7)

  ctx.font = isStory ? 'extrabold 36px Manrope, sans-serif' : 'extrabold 28px Manrope, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(chosen.name, heroBoxX + 32, cursorY + (isStory ? 120 : 90))

  const metricsY = cursorY + (isStory ? 190 : 138)
  const pillW = (heroBoxW - 64 - 24) / 3

  const metricsData = [
    { label: t.value.shareModal.badgeScore, val: `${chosenScore.total} pts` },
    { label: t.value.shareModal.badgeNet, val: formatRupiah(chosenNet) },
    { label: t.value.shareModal.badgeTime, val: `${chosen.hoursPerWeek} hrs` }
  ]

  for (let i = 0; i < 3; i++) {
    const px = heroBoxX + 32 + i * (pillW + 12)
    roundRect(ctx, px, metricsY, pillW, isStory ? 80 : 54, 16)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
    ctx.fill()

    ctx.font = '13px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
    ctx.fillText(metricsData[i].label, px + 16, metricsY + (isStory ? 30 : 22))

    ctx.font = 'bold 18px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(metricsData[i].val, px + 16, metricsY + (isStory ? 60 : 42))
  }

  cursorY += heroBoxH + (isStory ? 40 : 25)

  if (alternativeScenarios.value.length > 0) {
    ctx.beginPath()
    ctx.moveTo(cardX + 60, cursorY + 10)
    ctx.lineTo(cardX + cardW / 2 - 40, cursorY + 10)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    ctx.stroke()

    roundRect(ctx, cardX + cardW / 2 - 30, cursorY - 4, 60, 28, 14)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.fill()
    ctx.font = 'bold 12px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fillText(t.value.shareModal.versus, cardX + cardW / 2 - 10, cursorY + 15)

    ctx.beginPath()
    ctx.moveTo(cardX + cardW / 2 + 40, cursorY + 10)
    ctx.lineTo(cardX + cardW - 60, cursorY + 10)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    ctx.stroke()

    cursorY += 36

    for (const alt of alternativeScenarios.value) {
      const altScore = scoreScenario(alt, props.decision.weights)
      const altNet = alt.monthlyIncome - alt.monthlyCost
      const altH = isStory ? 84 : 64

      roundRect(ctx, cardX + 50, cursorY, cardW - 100, altH, 18)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.fill()
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
      ctx.stroke()

      ctx.font = 'bold 20px Manrope, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
      ctx.fillText(alt.name, cardX + 80, cursorY + (isStory ? 42 : 36))

      ctx.font = '15px sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.fillText(`${formatRupiah(altNet)} · ${alt.hoursPerWeek} jam`, cardX + 80, cursorY + (isStory ? 68 : 54))

      ctx.font = 'bold 18px sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
      ctx.fillText(`${altScore.total}/100`, cardX + cardW - 170, cursorY + (isStory ? 50 : 38))

      cursorY += altH + 14
    }
  }

  const ctaH = isStory ? 200 : 140
  const ctaY = cardY + cardH - ctaH - 40
  const ctaX = cardX + 50
  const ctaW = cardW - 100

  roundRect(ctx, ctaX, ctaY, ctaW, ctaH, 24)
  const ctaGradient = ctx.createLinearGradient(ctaX, ctaY, ctaX + ctaW, ctaY + ctaH)
  ctaGradient.addColorStop(0, 'rgba(16, 185, 129, 0.12)')
  ctaGradient.addColorStop(1, 'rgba(15, 23, 42, 0.8)')
  ctx.fillStyle = ctaGradient
  ctx.fill()
  ctx.lineWidth = 1.5
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)'
  ctx.stroke()

  ctx.font = 'bold 20px Manrope, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(t.value.shareModal.ctaTitle, ctaX + 36, ctaY + (isStory ? 55 : 44))

  ctx.font = '16px sans-serif'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.fillText(t.value.shareModal.ctaSubtitle, ctaX + 36, ctaY + (isStory ? 92 : 72))

  roundRect(ctx, ctaX + ctaW - 200, ctaY + (isStory ? 55 : 35), 160, 48, 14)
  ctx.fillStyle = '#10b981'
  ctx.fill()

  ctx.font = 'bold 17px Manrope, sans-serif'
  ctx.fillStyle = '#060a12'
  ctx.fillText(t.value.shareModal.ctaUrl, ctaX + ctaW - 165, ctaY + (isStory ? 85 : 65))

  if (isStory) {
    ctx.font = '13px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
    ctx.fillText('100% Client-side · Bebas Akun · Privasi Lokal Terjaga', ctaX + 36, ctaY + 155)
  }
}

function downloadImage() {
  const canvas = canvasRef.value
  if (!canvas) return
  const link = document.createElement('a')
  link.download = `forked-${props.decision.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${format.value}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
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
      })
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
            <Download :size="14" />
            {{ t.shareModal.downloadPng }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
