<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { X, ArrowRight, Lightbulb, AlertCircle, Sparkles } from 'lucide-vue-next'
import { useI18n } from '../../i18n'
import { CreateDecisionInputSchema } from '../../schemas/decision.schema'

const emit = defineEmits<{
  (e: 'create', payload: { title: string; context: string; pathAName?: string; pathBName?: string }): void
  (e: 'close'): void
}>()

const { t } = useI18n()

const title = ref('')
const context = ref('')
const pathAName = ref('')
const pathBName = ref('')
const touched = ref(false)
const selectedTemplate = ref<string | null>(null)

interface PresetTemplate {
  id: string
  label: string
  desc: string
  title: string
  context: string
  pathAName: string
  pathBName: string
}

const templates = computed<PresetTemplate[]>(() => [
  {
    id: 'career',
    label: t.value.createModal.templateCareer,
    desc: t.value.createModal.templateCareerDesc,
    title: t.value.createModal.templateCareerTitle,
    context: t.value.createModal.templateCareerContext,
    pathAName: t.value.createModal.templateCareerPathA,
    pathBName: t.value.createModal.templateCareerPathB
  },
  {
    id: 'study',
    label: t.value.createModal.templateStudy,
    desc: t.value.createModal.templateStudyDesc,
    title: t.value.createModal.templateStudyTitle,
    context: t.value.createModal.templateStudyContext,
    pathAName: t.value.createModal.templateStudyPathA,
    pathBName: t.value.createModal.templateStudyPathB
  },
  {
    id: 'freelance',
    label: t.value.createModal.templateFreelance,
    desc: t.value.createModal.templateFreelanceDesc,
    title: t.value.createModal.templateFreelanceTitle,
    context: t.value.createModal.templateFreelanceContext,
    pathAName: t.value.createModal.templateFreelancePathA,
    pathBName: t.value.createModal.templateFreelancePathB
  },
  {
    id: 'housing',
    label: t.value.createModal.templateHousing,
    desc: t.value.createModal.templateHousingDesc,
    title: t.value.createModal.templateHousingTitle,
    context: t.value.createModal.templateHousingContext,
    pathAName: t.value.createModal.templateHousingPathA,
    pathBName: t.value.createModal.templateHousingPathB
  }
])

function applyTemplate(tpl: PresetTemplate) {
  selectedTemplate.value = tpl.id
  title.value = tpl.title
  context.value = tpl.context
  pathAName.value = tpl.pathAName
  pathBName.value = tpl.pathBName
  touched.value = false
}

const validationResult = computed(() => {
  return CreateDecisionInputSchema.safeParse({
    title: title.value,
    context: context.value,
    pathAName: pathAName.value,
    pathBName: pathBName.value
  })
})

const titleError = computed(() => {
  if (!touched.value || validationResult.value.success) return ''
  const err = validationResult.value.error.format().title
  return err?._errors[0] ?? ''
})

const isValid = computed(() => validationResult.value.success)

function handleSubmit() {
  touched.value = true
  if (!isValid.value) return
  emit('create', {
    title: title.value.trim(),
    context: context.value.trim(),
    pathAName: pathAName.value.trim(),
    pathBName: pathBName.value.trim()
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="create-modal-title" @click.self="emit('close')">
    <form class="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-2xl p-6 shadow-2xl text-fg" @submit.prevent="handleSubmit">
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="text-[11px] font-bold tracking-wider uppercase text-primary mb-1">{{ t.createModal.eyebrow }}</div>
          <h2 id="create-modal-title" class="font-display font-extrabold text-2xl tracking-tight text-fg my-1">{{ t.createModal.title }}</h2>
        </div>
        <button type="button" class="w-9 h-9 rounded-xl border border-border bg-surface text-fg-muted hover:text-fg hover:bg-canvas-subtle grid place-items-center transition-colors cursor-pointer" :aria-label="t.common.close" @click="emit('close')">
          <X :size="19" />
        </button>
      </div>

      <p class="text-xs text-fg-muted leading-relaxed my-3 mb-4">{{ t.createModal.intro }}</p>

      <div class="mb-5 p-3.5 bg-canvas-subtle border border-border rounded-xl">
        <div class="flex items-center gap-1.5 text-xs font-bold text-fg mb-1">
          <Sparkles :size="14" class="text-primary" />
          <span>{{ t.createModal.templatesLabel }}</span>
        </div>
        <p class="text-[11px] text-fg-muted mb-2.5">{{ t.createModal.templatesHelper }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            v-for="tpl in templates"
            :key="tpl.id"
            type="button"
            :class="[
              'p-2.5 rounded-lg border text-left transition-all cursor-pointer',
              selectedTemplate === tpl.id
                ? 'bg-primary-soft border-primary text-primary shadow-2xs'
                : 'bg-surface border-border hover:border-primary/50 text-fg'
            ]"
            @click="applyTemplate(tpl)"
          >
            <div class="text-xs font-bold">{{ tpl.label }}</div>
            <div class="text-[10.5px] text-fg-muted truncate mt-0.5">{{ tpl.desc }}</div>
          </button>
        </div>
      </div>

      <label class="block text-xs font-bold text-fg mb-4">
        {{ t.createModal.titleLabel }}
        <input
          v-model="title"
          autofocus
          :class="[
            'w-full mt-1.5 border rounded-xl bg-surface text-fg px-3.5 py-2 text-sm outline-none transition-all',
            titleError ? 'border-danger ring-2 ring-danger/20' : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
          ]"
          :placeholder="t.createModal.titlePlaceholder"
          @blur="touched = true"
        />
        <div v-if="titleError" class="flex items-center gap-1 text-danger text-xs font-semibold mt-1">
          <AlertCircle :size="14" />
          <span>{{ titleError }}</span>
        </div>
      </label>

      <label class="block text-xs font-bold text-fg mb-4">
        <div class="flex justify-between items-baseline mb-1.5">
          <span>{{ t.createModal.contextLabel }}</span>
          <small :class="['text-[11px]', context.length > 500 ? 'text-danger font-bold' : 'text-fg-subtle']">
            {{ context.length }}/500
          </small>
        </div>
        <textarea
          v-model="context"
          rows="3"
          maxlength="500"
          class="w-full border border-border rounded-xl bg-surface text-fg p-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          :placeholder="t.createModal.contextPlaceholder"
        />
      </label>

      <div class="bg-canvas-subtle border border-border rounded-xl p-3.5 mb-4">
        <div class="text-[11px] font-bold tracking-wider uppercase text-fg-subtle mb-1">
          {{ t.createModal.pathsSectionTitle }}
        </div>
        <p class="text-[11.5px] text-fg-muted mb-3 leading-relaxed">
          {{ t.createModal.pathsSectionDesc }}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label class="block text-xs font-bold text-fg">
            {{ t.createModal.pathALabel }}
            <input
              v-model="pathAName"
              class="w-full mt-1 border border-border rounded-xl bg-surface text-fg px-3 py-1.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-fg-subtle"
              :placeholder="t.createModal.pathAPlaceholder"
            />
          </label>
          <label class="block text-xs font-bold text-fg">
            {{ t.createModal.pathBLabel }}
            <input
              v-model="pathBName"
              class="w-full mt-1 border border-border rounded-xl bg-surface text-fg px-3 py-1.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-fg-subtle"
              :placeholder="t.createModal.pathBPlaceholder"
            />
          </label>
        </div>
      </div>

      <div class="flex items-center gap-2.5 bg-primary-soft text-primary rounded-xl p-3 text-xs leading-relaxed mb-6">
        <Lightbulb :size="18" class="shrink-0" />
        <span>{{ t.createModal.tip }}</span>
      </div>

      <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
        <button type="button" class="px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg cursor-pointer" @click="emit('close')">
          {{ t.common.cancel }}
        </button>
        <button class="inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50" type="submit" :disabled="!isValid">
          {{ t.createModal.submit }} <ArrowRight :size="16" />
        </button>
      </div>
    </form>
  </div>
</template>
