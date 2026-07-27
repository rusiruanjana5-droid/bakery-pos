import { useEffect, useRef } from 'react'

/**
 * Custom hook to trap focus within a modal/container
 * Ensures keyboard navigation stays within the modal when it's open
 */
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Store the element that had focus before the modal opened
    previousActiveElement.current = document.activeElement as HTMLElement

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

    // Focus the first element
    if (firstFocusable) {
      firstFocusable.focus()
    }

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      // If shift + tab on first element, move to last
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault()
        lastFocusable?.focus()
      }
      // If tab on last element, move to first
      else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault()
        firstFocusable?.focus()
      }
    }

    container.addEventListener('keydown', handleTab)

    // Cleanup: restore focus to previous element
    return () => {
      container.removeEventListener('keydown', handleTab)
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isActive, containerRef])
}

/**
 * Custom hook to auto-focus a specific element when a condition is met
 */
export function useAutoFocus(
  isActive: boolean,
  elementRef: React.RefObject<HTMLElement | null>,
  delay: number = 100
) {
  useEffect(() => {
    if (!isActive || !elementRef.current) return

    const timer = setTimeout(() => {
      elementRef.current?.focus()
      // Select all text if it's an input
      if (elementRef.current instanceof HTMLInputElement) {
        elementRef.current.select()
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [isActive, elementRef, delay])
}
