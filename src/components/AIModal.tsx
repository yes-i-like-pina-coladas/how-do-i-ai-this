import React, { useState } from 'react'
import { AIApp } from '@/types'
import { getLogoPath } from '@/lib/logos'
import { ChevronDown, ChevronUp, X, ExternalLink } from 'lucide-react'

interface AIModalProps {
  apps: AIApp[]
  onClose: () => void
}

export const AIModal: React.FC<AIModalProps> = ({ apps, onClose }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

  const handleAppClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">AI</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">AI Suggestion</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main message */}
        <div className="mb-6">
          <p className="text-gray-700 text-base leading-relaxed">
            How can I do this with AI?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Consider using AI tools to enhance your workflow
          </p>
        </div>

        {/* Accordion */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="accordion-trigger px-4"
          >
            <span className="text-sm font-medium text-gray-700">
              AI Tools ({apps.length})
            </span>
            {isAccordionOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {isAccordionOpen && (
            <div className="accordion-content px-4 animate-slide-down">
              {apps.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500">
                  No AI tools configured
                </div>
              ) : (
                <div className="grid gap-2">
                  {apps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => handleAppClick(app.url)}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex items-center justify-center">
                          <img
                            src={getLogoPath(app.logoKey)}
                            alt={app.name}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              // Fallback to text if image fails to load
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              const fallback = document.createElement('div')
                              fallback.className = 'w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-600'
                              fallback.textContent = app.name.substring(0, 2).toUpperCase()
                              target.parentNode?.appendChild(fallback)
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {app.name}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
} 