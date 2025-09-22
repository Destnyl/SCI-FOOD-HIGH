export interface NotificationOptions {
  duration?: number
  persistent?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export class NotificationManager {
  private container: HTMLElement | null = null
  private notifications: Map<string, HTMLElement> = new Map()

  private getOrCreateContainer(position: string = 'top-right'): HTMLElement {
    if (!this.container) {
      this.container = document.createElement('div')
      this.container.id = 'notification-container'
      
      const positionClasses = {
        'top-right': 'fixed top-4 right-4 z-50 max-w-sm w-full space-y-2',
        'top-left': 'fixed top-4 left-4 z-50 max-w-sm w-full space-y-2',
        'bottom-right': 'fixed bottom-4 right-4 z-50 max-w-sm w-full space-y-2',
        'bottom-left': 'fixed bottom-4 left-4 z-50 max-w-sm w-full space-y-2',
        'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full space-y-2',
        'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full space-y-2'
      }
      
      this.container.className = positionClasses[position as keyof typeof positionClasses] || positionClasses['top-right']
      document.body.appendChild(this.container)
    }
    return this.container
  }

  private createNotification(
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string,
    options: NotificationOptions = {}
  ): HTMLElement {
    const { duration = 5000, persistent = false } = options
    const id = Math.random().toString(36).substr(2, 9)

    const notification = document.createElement('div')
    notification.setAttribute('data-id', id)
    notification.className = 'transform transition-all duration-300 ease-in-out pointer-events-auto opacity-0 translate-x-full scale-90'

    const colors = {
      success: {
        bg: 'bg-green-50/95 border-l-green-400',
        icon: 'text-green-400',
        title: 'text-green-800',
        message: 'text-green-700',
        close: 'text-green-600 hover:bg-green-100'
      },
      error: {
        bg: 'bg-red-50/95 border-l-red-400',
        icon: 'text-red-400',
        title: 'text-red-800',
        message: 'text-red-700',
        close: 'text-red-600 hover:bg-red-100'
      },
      warning: {
        bg: 'bg-yellow-50/95 border-l-yellow-400',
        icon: 'text-yellow-400',
        title: 'text-yellow-800',
        message: 'text-yellow-700',
        close: 'text-yellow-600 hover:bg-yellow-100'
      },
      info: {
        bg: 'bg-blue-50/95 border-l-blue-400',
        icon: 'text-blue-400',
        title: 'text-blue-800',
        message: 'text-blue-700',
        close: 'text-blue-600 hover:bg-blue-100'
      }
    }

    const icons = {
      success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>',
      error: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>',
      warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>',
      info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
    }

    const color = colors[type]

    notification.innerHTML = `
      <div class="border-l-4 ${color.bg} backdrop-blur-sm">
        <div class="flex items-start gap-3 p-4 rounded-lg shadow-lg">
          <div class="flex-shrink-0 mt-0.5">
            <svg class="w-5 h-5 ${color.icon}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              ${icons[type]}
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm ${color.title}">${title}</p>
            ${message ? `<p class="text-sm opacity-90 mt-1 ${color.message}">${message}</p>` : ''}
          </div>
          <button class="flex-shrink-0 p-1 rounded-full transition-colors duration-200 ${color.close}" data-close="${id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    `

    // Add click handler for close button
    const closeBtn = notification.querySelector(`[data-close="${id}"]`)
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.removeNotification(id))
    }

    this.notifications.set(id, notification)

    // Add to container
    const container = this.getOrCreateContainer()
    container.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.className = 'transform transition-all duration-300 ease-in-out pointer-events-auto opacity-100 translate-x-0 scale-100'
    }, 10)

    // Auto remove if not persistent
    if (!persistent && duration > 0) {
      setTimeout(() => {
        this.removeNotification(id)
      }, duration)
    }

    return notification
  }

  private removeNotification(id: string): void {
    const notification = this.notifications.get(id)
    if (!notification) return

    // Animate out
    notification.className = 'transform transition-all duration-300 ease-in-out pointer-events-auto opacity-0 translate-x-full scale-90'

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
      this.notifications.delete(id)
    }, 300)
  }

  success(title: string, message?: string, options?: NotificationOptions): void {
    this.createNotification('success', title, message, options)
  }

  error(title: string, message?: string, options?: NotificationOptions): void {
    this.createNotification('error', title, message, options)
  }

  warning(title: string, message?: string, options?: NotificationOptions): void {
    this.createNotification('warning', title, message, options)
  }

  info(title: string, message?: string, options?: NotificationOptions): void {
    this.createNotification('info', title, message, options)
  }

  clear(): void {
    this.notifications.forEach((_, id) => this.removeNotification(id))
  }
}

// Create global instance
export const notify = new NotificationManager()

// Convenience functions
export const showSuccess = (title: string, message?: string, options?: NotificationOptions) => {
  notify.success(title, message, options)
}

export const notifyError = (title: string, message?: string, options?: NotificationOptions) => {
  notify.error(title, message, options)
}

export const showWarning = (title: string, message?: string, options?: NotificationOptions) => {
  notify.warning(title, message, options)
}

export const showInfo = (title: string, message?: string, options?: NotificationOptions) => {
  notify.info(title, message, options)
}
