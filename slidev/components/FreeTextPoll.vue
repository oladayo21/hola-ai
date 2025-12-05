<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useParticipant } from '../composables/useParticipant'

const props = defineProps<{
  pollId: string
  question: string
  placeholder?: string
  maxLength?: number
  showResponses?: boolean // Show all responses (presenter view)
}>()

interface Response {
  id: string
  text: string
  authorId: string
  authorName: string
  timestamp: number
}

const { participant, isReady: participantReady } = useParticipant()

const responses = ref<Response[]>([])
const myResponse = ref('')
const hasSubmitted = ref(false)
const loading = ref(true)
const submitting = ref(false)
const polling = ref<ReturnType<typeof setInterval> | null>(null)

const API_BASE = import.meta.env.DEV
  ? 'http://localhost:8787'
  : ''

const maxLen = computed(() => props.maxLength || 500)

onMounted(() => {
  // Check if already submitted
  const stored = localStorage.getItem(`freetext-${props.pollId}`)

  if (stored) {
    myResponse.value = stored
    hasSubmitted.value = true
  }

  fetchResponses()
  polling.value = setInterval(fetchResponses, 4000)
})

onUnmounted(() => {
  if (polling.value) clearInterval(polling.value)
})

async function fetchResponses() {
  try {
    const res = await fetch(`${API_BASE}/api/freetext/${props.pollId}`)
    const data = await res.json()
    responses.value = data.responses || []
    loading.value = false
  } catch (e) {
    console.error('Freetext fetch error:', e)
    loading.value = false
  }
}

async function submitResponse() {
  if (!myResponse.value.trim() || !participant.value) return

  submitting.value = true

  try {
    const res = await fetch(`${API_BASE}/api/freetext/${props.pollId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: myResponse.value.trim(),
        authorId: participant.value.id,
        authorName: participant.value.name,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      responses.value = data.responses || []
      hasSubmitted.value = true
      localStorage.setItem(`freetext-${props.pollId}`, myResponse.value.trim())
    }
  } catch (e) {
    console.error('Submit freetext error:', e)
  } finally {
    submitting.value = false
  }
}

function editResponse() {
  hasSubmitted.value = false
}

const responseCount = computed(() => responses.value.length)
</script>

<template>
  <div class="freetext-container">
    <h3 class="freetext-question">{{ question }}</h3>

    <div v-if="!participantReady" class="freetext-waiting">
      Bitte gib zuerst deinen Namen ein...
    </div>

    <!-- Submit form -->
    <div v-else-if="!hasSubmitted" class="freetext-form">
      <textarea
        v-model="myResponse"
        :placeholder="placeholder || 'Deine Antwort...'"
        class="freetext-input"
        rows="3"
        :maxlength="maxLen"
      />
      <div class="freetext-actions">
        <span class="char-count">{{ myResponse.length }}/{{ maxLen }}</span>
        <button
          class="submit-btn"
          :disabled="!myResponse.trim() || submitting"
          @click="submitResponse"
        >
          {{ submitting ? 'Senden...' : 'Absenden' }}
        </button>
      </div>
    </div>

    <!-- Submitted state -->
    <div v-else class="freetext-submitted">
      <div class="submitted-box">
        <p class="submitted-text">{{ myResponse }}</p>
        <button class="edit-btn" @click="editResponse">Bearbeiten</button>
      </div>
      <p class="submitted-hint">Deine Antwort wurde gespeichert</p>
    </div>

    <!-- Stats -->
    <div class="freetext-stats">
      <span>{{ responseCount }} Antworten</span>
    </div>

    <!-- Responses list (presenter view) -->
    <div v-if="showResponses && responses.length > 0" class="responses-list">
      <h4 class="responses-title">Alle Antworten:</h4>
      <div
        v-for="r in responses"
        :key="r.id"
        class="response-item"
      >
        <p class="response-text">{{ r.text }}</p>
        <span class="response-author">- {{ r.authorName }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.freetext-container {
  max-width: 600px;
  margin: 1.5rem auto;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.freetext-question {
  margin: 0 0 1.5rem;
  font-size: 1.1rem;
  text-align: center;
}

.freetext-waiting {
  text-align: center;
  opacity: 0.6;
  padding: 1rem;
}

.freetext-form {
  margin-bottom: 1rem;
}

.freetext-input {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
  resize: none;
  transition: all 0.2s;
}

.freetext-input:focus {
  outline: none;
  border-color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
}

.freetext-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.freetext-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.char-count {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.submit-btn {
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  background: #a78bfa;
  color: #000;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #8b5cf6;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.freetext-submitted {
  text-align: center;
}

.submitted-box {
  padding: 1rem;
  background: rgba(167, 139, 250, 0.1);
  border: 2px solid rgba(167, 139, 250, 0.3);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.submitted-text {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  line-height: 1.4;
}

.edit-btn {
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  border-color: #a78bfa;
  color: #a78bfa;
}

.submitted-hint {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.freetext-stats {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.responses-list {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.responses-title {
  font-size: 0.9rem;
  margin: 0 0 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.response-item {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.response-text {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
  line-height: 1.4;
}

.response-author {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}
</style>
