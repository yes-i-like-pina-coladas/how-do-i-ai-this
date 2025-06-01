import { ExtensionState, DEFAULT_STATE } from '@/types'

export const STORAGE_KEY = 'ai-prompt-reminder-state'

export const getExtensionState = async (): Promise<ExtensionState> => {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY)
    return result[STORAGE_KEY] || DEFAULT_STATE
  } catch (error) {
    console.warn('Failed to get extension state:', error)
    return DEFAULT_STATE
  }
}

export const setExtensionState = async (state: ExtensionState): Promise<void> => {
  try {
    await chrome.storage.sync.set({ [STORAGE_KEY]: state })
  } catch (error) {
    console.error('Failed to save extension state:', error)
  }
}

export const updateExtensionState = async (
  updater: (state: ExtensionState) => ExtensionState
): Promise<void> => {
  const currentState = await getExtensionState()
  const newState = updater(currentState)
  await setExtensionState(newState)
} 