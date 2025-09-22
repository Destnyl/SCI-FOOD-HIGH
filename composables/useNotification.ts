export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

// Singleton notifications state shared across the app
const _notifications = ref<Notification[]>([])

const addNotification = (notification: Omit<Notification, 'id'>) => {
  const id = Math.random().toString(36).substr(2, 9)
  const newNotification: Notification = {
    id,
    duration: 5000, // 5 seconds default
    persistent: false,
    ...notification,
  }

  _notifications.value.push(newNotification)

  // Auto remove notification after duration (unless persistent)
  if (!newNotification.persistent && newNotification.duration) {
    setTimeout(() => {
      removeNotification(id)
    }, newNotification.duration)
  }

  return id
}

const removeNotification = (id: string) => {
  const index = _notifications.value.findIndex((n) => n.id === id)
  if (index > -1) {
    _notifications.value.splice(index, 1)
  }
}

const clearAll = () => {
  _notifications.value = []
}

// Convenience methods
const success = (title: string, message?: string, options?: Partial<Notification>) => {
  return addNotification({ type: 'success', title, message, ...options })
}

const error = (title: string, message?: string, options?: Partial<Notification>) => {
  return addNotification({ type: 'error', title, message, ...options })
}

const warning = (title: string, message?: string, options?: Partial<Notification>) => {
  return addNotification({ type: 'warning', title, message, ...options })
}

const info = (title: string, message?: string, options?: Partial<Notification>) => {
  return addNotification({ type: 'info', title, message, ...options })
}

export const useNotification = () => {
  return {
    notifications: readonly(_notifications),
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  }
}
