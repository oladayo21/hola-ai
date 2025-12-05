<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useParticipant } from '../composables/useParticipant'

const props = defineProps<{
  pollId: string
  question?: string
  options: string[]
  showResults?: boolean
  showVoters?: boolean // Show who voted for each option (presenter view)
}>()

const { participant, isReady: participantReady } = useParticipant()

const votes = ref<Record<string, number>>({})
const voters = ref<Record<string, { name: string; option: string }>>({})
const myVote = ref<string | null>(null)
const loading = ref(true)
const polling = ref<ReturnType<typeof setInterval> | null>(null)

// API base - different for dev vs prod
const API_BASE = import.meta.env.DEV
  ? 'http://localhost:8787'
  : ''

onMounted(() => {
  // Check if already voted (stored locally)
  const storedVote = localStorage.getItem(`poll-vote-${props.pollId}`)

  if (storedVote) {
    myVote.value = storedVote
  }

  // Initial fetch + start polling
  fetchResults()
  polling.value = setInterval(fetchResults, 4000)
})

onUnmounted(() => {
  if (polling.value) clearInterval(polling.value)
})

async function fetchResults() {
  try {
    const res = await fetch(`${API_BASE}/api/poll/${props.pollId}`)
    const data = await res.json()
    votes.value = data.options || {}
    voters.value = data.voters || {}
    loading.value = false
  } catch (e) {
    console.error('Poll fetch error:', e)
    loading.value = false
  }
}

async function vote(option: string) {
  // Don't re-vote for same option
  if (option === myVote.value) return

  // Need participant name
  if (!participant.value?.id) {
    console.warn('No participant identity set')

    return
  }

  try {
    const res = await fetch(`${API_BASE}/api/poll/${props.pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        option,
        voterId: participant.value.id,
        voterName: participant.value.name,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      votes.value = data.options
      voters.value = data.voters || {}
      myVote.value = option
      localStorage.setItem(`poll-vote-${props.pollId}`, option)
    }
  } catch (e) {
    console.error('Vote error:', e)
  }
}

const hasVoted = computed(() => myVote.value !== null)

const totalVotes = computed(() =>
  Object.values(votes.value).reduce((a, b) => a + b, 0)
)

function percentage(option: string): number {
  if (totalVotes.value === 0) return 0

  return Math.round(((votes.value[option] || 0) / totalVotes.value) * 100)
}

// Get list of voter names for an option
function getVotersForOption(option: string): string[] {
  return Object.values(voters.value)
    .filter(v => v.option === option)
    .map(v => v.name)
}
</script>

<template>
  <div class="poll-container">
    <h3 v-if="question" class="poll-question">{{ question }}</h3>

    <div v-if="loading" class="poll-loading">Loading...</div>

    <div v-else-if="!participantReady" class="poll-waiting">
      Bitte gib zuerst deinen Namen ein...
    </div>

    <div v-else class="poll-options">
      <button
        v-for="opt in options"
        :key="opt"
        :class="['poll-option', {
          selected: opt === myVote,
          voted: hasVoted
        }]"
        @click="vote(opt)"
      >
        <span class="poll-option-text">
          {{ opt }}
          <span v-if="opt === myVote" class="poll-checkmark">&#10003;</span>
        </span>
        <span
          v-if="hasVoted || showResults"
          class="poll-option-bar"
          :style="{ width: percentage(opt) + '%' }"
        />
        <span v-if="hasVoted || showResults" class="poll-option-count">
          {{ votes[opt] || 0 }} ({{ percentage(opt) }}%)
        </span>

        <!-- Voter names (presenter view) -->
        <div v-if="showVoters && getVotersForOption(opt).length > 0" class="poll-voters">
          <span v-for="name in getVotersForOption(opt)" :key="name" class="voter-badge">
            {{ name }}
          </span>
        </div>
      </button>
    </div>

    <div class="poll-footer">
      <span v-if="hasVoted || showResults" class="poll-total">
        Gesamt: {{ totalVotes }} Stimmen
      </span>
      <span v-if="hasVoted" class="poll-change-hint">
        Klicke auf eine andere Option um deine Stimme zu andern
      </span>
    </div>
  </div>
</template>

<style scoped>
.poll-container {
  max-width: 600px;
  margin: 1.5rem auto;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.poll-question {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  text-align: center;
}

.poll-loading,
.poll-waiting {
  text-align: center;
  opacity: 0.7;
}

.poll-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.poll-option {
  position: relative;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  color: inherit;
  font-size: 1rem;
  overflow: hidden;
}

.poll-option:hover {
  background: rgba(74, 222, 128, 0.2);
  border-color: #4ade80;
}

.poll-option.selected {
  border-color: #4ade80;
  background: rgba(74, 222, 128, 0.15);
}

.poll-option.voted:not(.selected):hover {
  background: rgba(251, 191, 36, 0.2);
  border-color: #fbbf24;
}

.poll-option-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: rgba(74, 222, 128, 0.3);
  transition: width 0.5s ease;
  z-index: 0;
}

.poll-option.selected .poll-option-bar {
  background: rgba(74, 222, 128, 0.4);
}

.poll-option-text {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.poll-checkmark {
  color: #4ade80;
  font-weight: bold;
}

.poll-option-count {
  position: relative;
  z-index: 1;
  float: right;
  font-weight: bold;
  color: #4ade80;
}

.poll-voters {
  position: relative;
  z-index: 1;
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.voter-badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
}

.poll-footer {
  margin-top: 1rem;
  text-align: center;
}

.poll-total {
  display: block;
  opacity: 0.7;
  font-size: 0.9rem;
}

.poll-change-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.5;
  font-style: italic;
}
</style>
