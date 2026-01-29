<template>
  <div
    class="v-html-content-with-obfuscated-email"
    ref="containerRef"
    v-html="processedContent"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick, watch } from 'vue'

const props = defineProps<{
  textHtmlContent: string
}>()

const containerRef = ref<HTMLElement | null>(null)

const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
const mailtoRegex = /href=["']mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})["']/g
const telRegex = /(?<![0-9])(\+?[0-9]{1,4}[\s.\-()]?(?:[0-9][\s.\-()]?){6,14}[0-9])(?![0-9])/g
const teltoRegex = /href=["']tel:([+0-9][\s.\-()0-9]{6,20})["']/g

function encodeString(email: string): string {
  return btoa(email)
}

function obfuscateEmailText(text: string): string {
  return text
    .replace(emailRegex, (match) => {
      const encoded = encodeString(match)
      return `<span class="obfusc-m" data-encoded-m="${encoded}">[email protégé]</span>`
    })
}
function obfuscateMailLinks(html: string): string {
  return html
    .replace(mailtoRegex, (match, email) => {
      console.log('match', match)
      const encoded = encodeString(email)
      console.log('encoded', encoded)
      return `href="#" data-mto-encoded="${encoded}"`
    })
}

function obfuscateTelText(text: string): string {
  return text
    .replace(telRegex, (match) => {
      const encoded = encodeString(match)
      return `<span class="obfusc-t" data-encoded-t="${encoded}">[téléphone protégé]</span>`
    })
}

function obfuscateTelLinks(html: string): string {
  return html
    .replace(teltoRegex, (match, tel) => {
      const encoded = encodeString(tel)
      return `href="#" data-tto-encoded="${encoded}"`
    })
}

const processedContent = computed(() => {
  let content = props.textHtmlContent
  console.log('content', content)
  content = obfuscateMailLinks(content)
  console.log('content', content)
  content = obfuscateEmailText(content)
  content = obfuscateTelText(content)
  content = obfuscateTelLinks(content)
  return content
})

function decodeAndReplaceEmails() {
  if (!containerRef.value) return

  const obfuscatedSpans = containerRef.value.querySelectorAll('.obfusc-m')
  obfuscatedSpans.forEach((span) => {
    const encoded = span.getAttribute('data-encoded-m')
    if (encoded) {
      try {
        span.textContent = atob(encoded)
      } catch (e) {
        // Keep placeholder if decoding fails
      }
    }
  })

  const mailtoLinks = containerRef.value.querySelectorAll('[data-mto-encoded]')
  mailtoLinks.forEach((link) => {
    const encoded = link.getAttribute('data-mto-encoded')
    if (encoded) {
      try {
        const decoded = atob(encoded)
        link.setAttribute('href', `mailto:${decoded}`)
        link.removeAttribute('data-mto-encoded')
      } catch (e) {
        // Keep # href if decoding fails
      }
    }
  })
}

function decodeAndReplaceTels() {
  if (!containerRef.value) return

  const obfuscatedSpans = containerRef.value.querySelectorAll('.obfusc-t')
  obfuscatedSpans.forEach((span) => {
    const encoded = span.getAttribute('data-encoded-t')
    if (encoded) {
      try {
        span.textContent = atob(encoded)
      } catch (e) {
        // Keep placeholder if decoding fails
      }
    }
  })

  const telLinks = containerRef.value.querySelectorAll('[data-tto-encoded]')
  telLinks.forEach((link) => {
    const encoded = link.getAttribute('data-tto-encoded')
    if (encoded) {
      try {
        const decoded = atob(encoded)
        link.setAttribute('href', `tel:${decoded}`)
        link.removeAttribute('data-tto-encoded')
      } catch (e) {
        // Keep # href if decoding fails
      }
    }
  })
}

function decodeAll() {
  decodeAndReplaceEmails()
  decodeAndReplaceTels()
}

onMounted(() => {
  nextTick(() => {
    window.setTimeout(() => decodeAll(), 1_000)
  })
})

watch(() => props.textHtmlContent, () => {
  nextTick(() => {
    window.setTimeout(() => decodeAll(), 1_000)
  })
})
</script>

<style lang="scss" scoped>
.v-html-content-with-obfuscated-email {
  :deep(.obfusc-m) {
    // Style identique au texte environnant
  }
}
</style>
