<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useParticipant } from '../composables/useParticipant'

const props = defineProps<{
  sessionId: string
  isPresenter?: boolean // Presenter can dismiss/answer questions
}>()

interface Question {
  id: string
  text: string
  authorId: string
  authorName: string
  timestamp: number
  upvotes: number
  upvotedBy: string[]
  answered?: boolean
}

const { participant, isReady: participantReady } = useParticipant()

const questions = ref<Question[]>([])
const newQuestion = ref('')
const loading = ref(true)
const submitting = ref(false)
const polling = ref<ReturnType<typeof setInterval> | null>(null)

const API_BASE = import.meta.env.DEV
  ? 'http://localhost:8787'
  : ''

onMounted(() => {
  fetchQuestions()
  polling.value = setInterval(fetchQuestions, 3000)
})

onUnmounted(() => {
  if (polling.value) clearInterval(polling.value)
})

async function fetchQuestions() {
  try {
    const res = await fetch(`${API_BASE}/api/questions/${props.sessionId}`)
    const data = await res.json()
    questions.value = data.questions || []
    loading.value = false
  } catch (e) {
    console.error('Questions fetch error:', e)
    loading.value = false
  }
}

async function submitQuestion() {
  if (!newQuestion.value.trim() || !participant.value) return

  submitting.value = true

  try {
    const res = await fetch(`${API_BASE}/api/questions/${props.sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: newQuestion.value.trim(),
        authorId: participant.value.id,
        authorName: participant.value.name,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      questions.value = data.questions || []
      newQuestion.value = ''
    }
  } catch (e) {
    console.error('Submit question error:', e)
  } finally {
    submitting.value = false
  }
}

async function upvoteQuestion(questionId: string) {
  if (!participant.value) return

  try {
    const res = await fetch(`${API_BASE}/api/questions/${props.sessionId}/${questionId}/upvote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voterId: participant.value.id,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      questions.value = data.questions || []
    }
  } catch (e) {
    console.error('Upvote error:', e)
  }
}

async function markAnswered(questionId: string) {
  if (!props.isPresenter) return

  try {
    const res = await fetch(`${API_BASE}/api/questions/${props.sessionId}/${questionId}/answer`, {
      method: 'POST',
    })

    if (res.ok) {
      const data = await res.json()
      questions.value = data.questions || []
    }
  } catch (e) {
    console.error('Mark answered error:', e)
  }
}

async function dismissQuestion(questionId: string) {
  if (!props.isPresenter) return

  try {
    const res = await fetch(`${API_BASE}/api/questions/${props.sessionId}/${questionId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      const data = await res.json()
      questions.value = data.questions || []
    }
  } catch (e) {
    console.error('Dismiss error:', e)
  }
}

// Sort: unanswered first, then by upvotes
const sortedQuestions = computed(() => {
  return [...questions.value]
    .filter(q => !q.answered || props.isPresenter)
    .sort((a, b) => {
      if (a.answered !== b.answered) return a.answered ? 1 : -1

      return b.upvotes - a.upvotes
    })
})

function hasUpvoted(question: Question): boolean {
  return participant.value ? question.upvotedBy.includes(participant.value.id) : false
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)

  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="questions-container">
    <h3 class="questions-title">Live Fragen</h3>

    <!-- Submit form -->
    <div v-if="participantReady" class="question-form">
      <textarea
        v-model="newQuestion"
        placeholder="Stelle eine Frage..."
        class="question-input"
        rows="2"
        maxlength="500"
        @keydown.ctrl.enter="submitQuestion"
      />
      <button
        class="submit-btn"
        :disabled="!newQuestion.trim() || submitting"
        @click="submitQuestion"
      >
        {{ submitting ? 'Senden...' : 'Frage stellen' }}
      </button>
    </div>
    <div v-else class="questions-waiting">
      Bitte gib zuerst deinen Namen ein...
    </div>

    <!-- Questions list -->
    <div v-if="loading" class="questions-loading">Loading...</div>

    <div v-else-if="sortedQuestions.length === 0" class="questions-empty">
      Noch keine Fragen. Sei der Erste!
    </div>

    <div v-else class="questions-list">
      <div
        v-for="q in sortedQuestions"
        :key="q.id"
        :class="['question-item', { answered: q.answered }]"
      >
        <div class="question-vote">
          <button
            :class="['upvote-btn', { upvoted: hasUpvoted(q) }]"
            @click="upvoteQuestion(q.id)"
            :disabled="!participantReady"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          </button>
          <span class="upvote-count">{{ q.upvotes }}</span>
        </div>

        <div class="question-content">
          <p class="question-text">{{ q.text }}</p>
          <div class="question-meta">
            <span class="question-author">{{ q.authorName }}</span>
            <span class="question-time">{{ formatTime(q.timestamp) }}</span>
            <span v-if="q.answered" class="question-badge answered">Beantwortet</span>
          </div>
        </div>

        <!-- Presenter controls -->
        <div v-if="isPresenter" class="presenter-controls">
          <button
            v-if="!q.answered"
            class="control-btn answer"
            @click="markAnswered(q.id)"
            title="Als beantwortet markieren"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </button>
          <button
            class="control-btn dismiss"
            @click="dismissQuestion(q.id)"
            title="Frage entfernen"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="questions-footer">
      <span class="questions-count">{{ questions.filter(q => !q.answered).length }} offene Fragen</span>
    </div>
  </div>
</template>

<style scoped>
.questions-container {
  max-width: 600px;
  margin: 1rem auto;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.questions-title {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  text-align: center;
}

.question-form {
  margin-bottom: 1.5rem;
}

.question-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
  resize: none;
  transition: all 0.2s;
}

.question-input:focus {
  outline: none;
  border-color: #60a5fa;
  background: rgba(96, 165, 250, 0.1);
}

.question-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.submit-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  background: #60a5fa;
  color: #000;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #3b82f6;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.questions-waiting,
.questions-loading,
.questions-empty {
  text-align: center;
  opacity: 0.6;
  padding: 1rem;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.question-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.2s;
}

.question-item.answered {
  opacity: 0.5;
}

.question-vote {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.upvote-btn {
  padding: 0.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
}

.upvote-btn:hover:not(:disabled) {
  background: rgba(251, 191, 36, 0.2);
  border-color: #fbbf24;
  color: #fbbf24;
}

.upvote-btn.upvoted {
  background: rgba(251, 191, 36, 0.3);
  border-color: #fbbf24;
  color: #fbbf24;
}

.upvote-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upvote-count {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.question-content {
  flex: 1;
  min-width: 0;
}

.question-text {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.question-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.question-author {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.question-badge {
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
}

.question-badge.answered {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

.presenter-controls {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.control-btn {
  padding: 0.35rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn.answer:hover {
  background: rgba(74, 222, 128, 0.2);
  border-color: #4ade80;
  color: #4ade80;
}

.control-btn.dismiss:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #ef4444;
}

.questions-footer {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}
</style>
