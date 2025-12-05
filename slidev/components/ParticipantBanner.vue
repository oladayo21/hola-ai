<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useParticipant } from '../composables/useParticipant'

const { participant, isReady, setName } = useParticipant()

const nameInput = ref('')
const showPrompt = ref(false)
const isEditing = ref(false)

onMounted(() => {
  // Show prompt if no name set
  if (!isReady.value || !participant.value) {
    showPrompt.value = true
  }
})

function handleSubmit() {
  if (setName(nameInput.value)) {
    showPrompt.value = false
    isEditing.value = false
  }
}

function startEdit() {
  nameInput.value = participant.value?.name || ''
  isEditing.value = true
  showPrompt.value = true
}

const displayName = computed(() => participant.value?.name || '')
</script>

<template>
  <!-- Overlay modal for name entry -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showPrompt" class="participant-overlay">
        <div class="participant-modal">
          <div class="modal-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>

          <h2 class="modal-title">Willkommen zum Workshop!</h2>
          <p class="modal-subtitle">
            {{ isEditing ? 'Name andern:' : 'Wie heisst du?' }}
          </p>

          <form @submit.prevent="handleSubmit" class="name-form">
            <input
              v-model="nameInput"
              type="text"
              placeholder="Dein Name..."
              class="name-input"
              autofocus
              maxlength="50"
            />
            <button type="submit" class="submit-btn" :disabled="!nameInput.trim()">
              {{ isEditing ? 'Speichern' : 'Beitreten' }}
            </button>
          </form>

          <p class="modal-hint">
            Dein Name wird bei Abstimmungen und Fragen angezeigt
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Persistent banner showing current participant -->
  <Transition name="slide">
    <div v-if="isReady && displayName && !showPrompt" class="participant-banner" @click="startEdit">
      <span class="banner-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </span>
      <span class="banner-name">{{ displayName }}</span>
      <span class="banner-edit">bearbeiten</span>
    </div>
  </Transition>
</template>

<style scoped>
.participant-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.participant-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-icon {
  color: #4ade80;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #fff;
}

.modal-subtitle {
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 1.5rem;
}

.name-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.name-input {
  padding: 1rem 1.25rem;
  font-size: 1.1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  text-align: center;
  transition: all 0.2s;
}

.name-input:focus {
  outline: none;
  border-color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
}

.name-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.submit-btn {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  background: #4ade80;
  color: #000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #22c55e;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-hint {
  margin: 1.5rem 0 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

/* Persistent banner */
.participant-banner {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  background: rgba(26, 26, 46, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 100;
}

.participant-banner:hover {
  background: rgba(26, 26, 46, 1);
  border-color: rgba(74, 222, 128, 0.3);
}

.banner-icon {
  color: #4ade80;
  display: flex;
}

.banner-name {
  color: #fff;
  font-weight: 500;
}

.banner-edit {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  margin-left: 0.25rem;
}

.participant-banner:hover .banner-edit {
  color: #4ade80;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
