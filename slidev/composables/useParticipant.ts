import { ref, readonly } from 'vue'

const STORAGE_KEY = 'hola-participant'

interface Participant {
  id: string
  name: string
  joinedAt: number
}

// Singleton state - shared across all components
const participant = ref<Participant | null>(null)
const isReady = ref(false)

// Initialize from localStorage
function init() {
  if (typeof window === 'undefined') return

  const stored = localStorage.getItem(STORAGE_KEY)

  if (stored) {
    try {
      participant.value = JSON.parse(stored)
      isReady.value = true
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
}

// Set participant name (creates new or updates existing)
function setName(name: string) {
  const trimmed = name.trim()

  if (!trimmed) return false

  const existing = participant.value

  participant.value = {
    id: existing?.id || crypto.randomUUID(),
    name: trimmed,
    joinedAt: existing?.joinedAt || Date.now(),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(participant.value))
  isReady.value = true

  return true
}

// Clear participant (for testing/reset)
function clear() {
  participant.value = null
  isReady.value = false
  localStorage.removeItem(STORAGE_KEY)
}

// API helper - get headers with participant info
function getParticipantHeaders(): Record<string, string> {
  if (!participant.value) return {}

  return {
    'X-Participant-Id': participant.value.id,
    'X-Participant-Name': encodeURIComponent(participant.value.name),
  }
}

export function useParticipant() {
  // Auto-init on first use
  if (!isReady.value && typeof window !== 'undefined') {
    init()
  }

  return {
    participant: readonly(participant),
    isReady: readonly(isReady),
    setName,
    clear,
    getParticipantHeaders,
  }
}
