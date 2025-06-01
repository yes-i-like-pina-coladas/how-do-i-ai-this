import { getExtensionState, updateExtensionState } from '@/lib/storage'
import { AIApp } from '@/types'
import { isAIWebsite } from '@/lib/utils'

// Create and inject the modal
let modalContainer: HTMLDivElement | null = null
let autoHideTimeout: number | null = null
let userHasInteracted = false

const createModal = async () => {
  console.log('Starting modal creation...')
  
  // Check if modal already exists
  if (modalContainer) {
    console.log('Modal already exists, skipping creation')
    return
  }

  const state = await getExtensionState()
  console.log('Extension state:', state)
  
  // Don't show if disabled
  if (!state.enabled) {
    console.log('Extension is disabled')
    return
  }

  // Don't show if no tools configured
  if (state.apps.length === 0) {
    console.log('No tools configured')
    return
  }

  // Don't show on AI websites
  if (isAIWebsite(window.location.href)) {
    console.log('Current site is an AI website, skipping')
    return
  }

  // Check if we should skip this domain
  const currentDomain = window.location.hostname
  const lastShownDomain = state.lastShownDomain || ''
  const lastShown = state.lastShown || 0
  const now = Date.now()
  
  // If same domain and shown within last 5 minutes, skip
  if (currentDomain === lastShownDomain && (now - lastShown) < 5 * 60 * 1000) {
    console.log('Modal shown recently on this domain, skipping')
    return
  }

  // Reset interaction flag
  userHasInteracted = false

  // Create modal container
  modalContainer = document.createElement('div')
  modalContainer.id = 'ai-prompt-reminder-modal'
  modalContainer.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    left: 0 !important;
    bottom: 0 !important;
    z-index: 2147483647 !important;
    pointer-events: none !important;
    display: flex !important;
    justify-content: flex-end !important;
    align-items: flex-start !important;
    padding: 40px !important;
  `

  // Create shadow DOM for isolation
  const shadowRoot = modalContainer.attachShadow({ mode: 'closed' })
  
  // Detect system theme properly
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDarkMode = state.theme === 'dark' || 
    (state.theme === 'system' && systemPrefersDark)
  
  // Add styles to shadow DOM
  const style = document.createElement('style')
  style.textContent = `
    .modal-container {
      position: relative;
      pointer-events: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    }
    
    .modal-content {
      background: ${isDarkMode ? '#1f2937' : '#ffffff'};
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px ${isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.15)'}, 
                  0 10px 25px -5px ${isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.08)'};
      border: 1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)'};
      width: 320px;
      height: 120px;
      padding: 0;
      position: relative;
      animation: smoothSlideIn 0.8s cubic-bezier(0.23, 1, 0.32, 1);
      overflow: visible;
      backdrop-filter: blur(12px);
      display: flex;
      flex-direction: row;
      margin-top: 0;
    }
    
    @keyframes smoothSlideIn {
      0% { 
        opacity: 0; 
        transform: translateX(60px) translateY(-15px) scale(0.85);
      }
      40% {
        opacity: 0.6;
        transform: translateX(10px) translateY(-5px) scale(0.92);
      }
      70% {
        opacity: 0.9;
        transform: translateX(-2px) translateY(2px) scale(0.98);
      }
      100% { 
        opacity: 1; 
        transform: translateX(0) translateY(0) scale(1); 
      }
    }
    
    .modal-header {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 10;
    }
    
    .close-btn {
      background: ${isDarkMode ? 'rgba(156, 163, 175, 0.1)' : 'rgba(107, 114, 128, 0.1)'};
      border: none;
      color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      transition: all 0.2s ease;
      font-size: 12px;
      line-height: 1;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .close-btn:hover {
      background: ${isDarkMode ? 'rgba(156, 163, 175, 0.15)' : 'rgba(107, 114, 128, 0.15)'};
      color: ${isDarkMode ? '#d1d5db' : '#374151'};
      transform: scale(1.05);
    }
    
    .main-question {
      flex: 1;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      position: relative;
    }
    
    .question-text {
      color: ${isDarkMode ? '#f9fafb' : '#111827'};
      font-size: 18px;
      font-weight: 700;
      line-height: 1.25;
      margin-bottom: 40px;
      letter-spacing: -0.02em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .tools-dropdown {
      position: absolute;
      bottom: 8px;
      left: 24px;
      z-index: 1;
    }
    
    .ai-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2px 6px;
      border-radius: 5px;
      font-size: 8px;
      font-weight: 600;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      width: fit-content;
    }
    
    .ai-icon {
      width: 7px;
      height: 7px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 5px;
      font-weight: bold;
    }
    
    .divider {
      width: 1px;
      background: ${isDarkMode ? 
        'linear-gradient(180deg, transparent, rgba(75, 85, 99, 0.3), transparent)' :
        'linear-gradient(180deg, transparent, #e5e7eb, transparent)'};
      margin: 16px 0;
    }
    
    .tools-section { /* Right-hand section, currently empty but kept for structure */
      padding: 20px 24px 20px 16px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end; /* Align content (like dismiss button via footer) to bottom */
      min-width: 120px; /* Ensures it takes up some space */
    }
    
    .tools-trigger {
      background: none;
      border: none;
      padding: 6px 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 10px;
      color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
      border-radius: 4px;
      text-align: left;
    }
    
    .tools-trigger:hover {
      background: ${isDarkMode ? 'rgba(156, 163, 175, 0.05)' : 'rgba(107, 114, 128, 0.05)'};
      color: ${isDarkMode ? '#d1d5db' : '#374151'};
    }
    
    .tools-trigger-text {
      margin-right: 6px;
    }
    
    .tools-icon {
      font-size: 7px;
      transition: transform 0.2s ease;
    }
    
    .tools-icon.open {
      transform: rotate(180deg);
    }
    
    .tools-content {
      display: none;
      position: absolute;
      top: 100%;
      bottom: auto;
      left: 0;
      right: auto;
      background: ${isDarkMode ? '#1f2937' : '#ffffff'};
      border-radius: 8px;
      box-shadow: 0 8px 16px ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'};
      border: 1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)'};
      margin-top: 4px;
      padding: 8px;
      min-width: 220px;
      z-index: 1000;
      animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .tools-content.open {
      display: block;
    }
    
    @keyframes slideDown {
      from { 
        opacity: 0; 
        transform: translateY(-8px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
    
    .app-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 150px;
      overflow-y: auto;
    }
    
    .app-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      border: 1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.6)'};
      border-radius: 6px;
      background: ${isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(249, 250, 251, 0.5)'};
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .app-item:hover {
      background: ${isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(249, 250, 251, 1)'};
      border-color: ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 1)'};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px ${isDarkMode ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.05)'};
    }
    
    .app-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .app-logo-fallback {
      width: 16px;
      height: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 7px;
      font-weight: bold;
      color: white;
      letter-spacing: 0.5px;
      flex-shrink: 0; /* Prevent shrinking */
    }
    
    .app-logo {
      width: 16px;
      height: 16px;
      border-radius: 3px;
      object-fit: contain;
      flex-shrink: 0; /* Prevent shrinking */
    }
    
    .app-name {
      font-size: 12px;
      font-weight: 500;
      color: ${isDarkMode ? '#f3f4f6' : '#111827'};
    }
    
    .external-icon {
      color: ${isDarkMode ? '#6b7280' : '#9ca3af'};
      font-size: 10px;
      opacity: 0.7;
      transition: all 0.2s ease;
    }
    
    .app-item:hover .external-icon {
      opacity: 1;
      transform: translateX(2px);
    }
    
    .footer {
      position: absolute;
      bottom: 8px;
      right: 24px;
    }
    
    .dismiss-btn {
      background: none;
      border: none;
      color: ${isDarkMode ? '#6b7280' : '#9ca3af'};
      font-size: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 4px 8px;
      border-radius: 4px;
    }
    
    .dismiss-btn:hover {
      color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
      background: ${isDarkMode ? 'rgba(107, 114, 128, 0.05)' : 'rgba(107, 114, 128, 0.05)'};
    }
    
    .empty-state {
      text-align: center;
      padding: 12px;
      color: ${isDarkMode ? '#6b7280' : '#9ca3af'};
      font-size: 10px;
    }
    
    /* Auto-hide after delay */
    .modal-content.auto-hide {
      animation: fadeOutSlideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    @keyframes fadeOutSlideRight {
      from { 
        opacity: 1; 
        transform: translateX(0) scale(1); 
      }
      to { 
        opacity: 0; 
        transform: translateX(40px) scale(0.95);
        pointer-events: none; 
      }
    }
  `
  
  // Create container for modal HTML
  const modalWrapper = document.createElement('div')
  modalWrapper.innerHTML = createModalHTML(state.apps)

  // Add style element first
  shadowRoot.appendChild(style)

  // Add modal HTML after style
  shadowRoot.appendChild(modalWrapper.firstElementChild!)

  // Add to page
  document.body.appendChild(modalContainer)

  // Setup event listeners
  setupEventListeners(shadowRoot)

  // Start auto-hide timer
  startAutoHideTimer(shadowRoot)

  // Update last shown time
  await updateExtensionState(state => ({
    ...state,
    lastShown: Date.now(),
    lastShownDomain: currentDomain
  }))
}

const startAutoHideTimer = (shadowRoot: ShadowRoot) => {
  // Clear any existing timeout
  if (autoHideTimeout) {
    clearTimeout(autoHideTimeout)
  }
  
  // Only start auto-hide if user hasn't interacted
  autoHideTimeout = window.setTimeout(() => {
    if (!userHasInteracted && modalContainer) {
      const content = shadowRoot.querySelector('.modal-content')
      if (content) {
        content.classList.add('auto-hide')
        setTimeout(() => {
          if (modalContainer && !userHasInteracted) {
            modalContainer.remove()
            modalContainer = null
            autoHideTimeout = null
          }
        }, 800) // Animation duration
      }
    }
  }, 20000) // Show for 20 seconds
}

const cancelAutoHide = () => {
  userHasInteracted = true
  if (autoHideTimeout) {
    clearTimeout(autoHideTimeout)
    autoHideTimeout = null
  }
}

const createModalHTML = (apps: AIApp[]): string => {
  const appsHTML = apps.map(app => {
    const faviconUrl = `https://www.google.com/s2/favicons?sz=32&domain_url=${encodeURIComponent(app.url)}`;

    return `
    <button class="app-item" data-url="${app.url}">
      <div class="app-info">
        <img 
          src="${faviconUrl}" 
          class="app-logo" 
          alt="" 
          onerror="this.onerror=null; this.style.display='none'; this.nextSibling.style.display='flex';"
        />
        <div class="app-logo-fallback" style="display: none;">
          ${app.name.substring(0, 2).toUpperCase()}
        </div>
        <span class="app-name">${app.name}</span>
      </div>
      <span class="external-icon">→</span>
    </button>
  `}).join('')

  return `
    <div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close-btn" id="close-modal">×</button>
        </div>
        
        <div class="main-question">
          <h2 class="question-text">How can I do this with AI?</h2>
          <div class="tools-dropdown">
            <button class="tools-trigger" id="tools-toggle">
              <span class="tools-trigger-text">AI Tools (${apps.length})</span>
              <span class="tools-icon" id="tools-icon">▼</span>
            </button>
            <div class="tools-content" id="tools-content">
              ${apps.length === 0 ? 
                '<div class="empty-state">No tools configured</div>' :
                `<div class="app-list">${appsHTML}</div>`
              }
            </div>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="tools-section">
          <!-- Space for future features -->
        </div>
        
        <div class="footer">
          <button class="dismiss-btn" id="dismiss-modal">Dismiss</button>
        </div>
      </div>
    </div>
  `
}

const setupEventListeners = (shadowRoot: ShadowRoot) => {
  // Close modal
  const closeBtn = shadowRoot.getElementById('close-modal')
  const dismissBtn = shadowRoot.getElementById('dismiss-modal')

  const closeModal = () => {
    cancelAutoHide()
    if (modalContainer) {
      const content = shadowRoot.querySelector('.modal-content') as HTMLElement
      if (content) {
        content.style.animation = 'fadeOutSlideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }
      setTimeout(() => {
        if (modalContainer) {
          modalContainer.remove()
          modalContainer = null
        }
      }, 300)
    }
  }

  closeBtn?.addEventListener('click', () => {
    cancelAutoHide()
    closeModal()
  })
  dismissBtn?.addEventListener('click', () => {
    cancelAutoHide()
    closeModal()
  })

  // Tools toggle
  const toolsToggle = shadowRoot.getElementById('tools-toggle')
  const toolsContent = shadowRoot.getElementById('tools-content')
  const toolsIcon = shadowRoot.getElementById('tools-icon')

  toolsToggle?.addEventListener('click', (e) => {
    e.preventDefault()
    cancelAutoHide()
    const isOpen = toolsContent?.classList.contains('open')
    if (isOpen) {
      toolsContent?.classList.remove('open')
      toolsIcon?.classList.remove('open')
      if (toolsIcon) toolsIcon.textContent = '▼'
    } else {
      toolsContent?.classList.add('open')
      toolsIcon?.classList.add('open')
      if (toolsIcon) toolsIcon.textContent = '▲'
    }
  })

  // App clicks
  const appItems = shadowRoot.querySelectorAll('.app-item')
  appItems.forEach(item => {
    item.addEventListener('click', () => {
      cancelAutoHide()
      const url = item.getAttribute('data-url')
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
        closeModal()
      }
    })
  })

  // Handle mouse interactions to cancel auto-hide
  const modalContent = shadowRoot.querySelector('.modal-content')
  modalContent?.addEventListener('mouseenter', () => {
    cancelAutoHide()
    modalContent.classList.remove('auto-hide')
  })

  // Handle any click within modal as interaction
  modalContent?.addEventListener('click', (e) => {
    cancelAutoHide()
    e.stopPropagation()
  })

  // Handle hover interactions
  modalContent?.addEventListener('mousemove', () => {
    if (!userHasInteracted) {
      cancelAutoHide()
    }
  })
}

// Initialize content script
const init = () => {
  console.log('Initializing content script...')
  
  // Show modal on page load (after a short delay to let page settle)
  setTimeout(async () => {
    console.log('Attempting to create modal...')
    try {
      await createModal()
    } catch (error) {
      console.error('Error creating modal:', error)
    }
  }, 1500)

  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes) => {
    console.log('Storage changes detected:', changes)
    if (changes['ai-prompt-reminder-state']) {
      // State changed, potentially update modal
      const newState = changes['ai-prompt-reminder-state'].newValue
      console.log('New extension state:', newState)
      if (!newState?.enabled && modalContainer) {
        console.log('Extension disabled, removing modal')
        modalContainer.remove()
        modalContainer = null
      }
    }
  })
}

// Only run on main frames (not iframes)
if (window === window.top) {
  console.log('Content script loaded in main frame')
  init()
} else {
  console.log('Content script loaded in iframe, skipping initialization')
} 