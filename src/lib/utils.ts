import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AI_WEBSITE_PATTERNS } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Convert a URL pattern with wildcards to a regular expression
 */
function patternToRegex(pattern: string): RegExp {
  return new RegExp(
    pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\//g, '\\/')
  )
}

/**
 * Check if a URL matches any of the AI website patterns
 */
export function isAIWebsite(url: string): boolean {
  try {
    // Parse the URL to get hostname and path
    const urlObj = new URL(url)
    // Convert to pattern format (e.g., *://domain.com/path)
    const urlToMatch = `*://${urlObj.hostname}${urlObj.pathname}`
    
    return AI_WEBSITE_PATTERNS.some(pattern => {
      const regex = patternToRegex(pattern)
      return regex.test(urlToMatch)
    })
  } catch {
    return false
  }
} 