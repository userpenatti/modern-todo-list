import { useEffect } from 'react'
import { NotificationService } from '../services/NotificationService'

export function useNotifications(todos: any[]) {
  useEffect(() => {
    // Solicita permissão assim que o componente montar
    NotificationService.requestPermission()

    const checkNotifications = () => {
      const now = new Date()

      todos.forEach(todo => {
        if (todo.completed || !todo.dueDate || !todo.notifyBefore) return

        const dueDate = new Date(todo.dueDate)
        const notifyTime = new Date(dueDate.getTime() - (todo.notifyBefore * 60 * 1000))

        if (Math.abs(now.getTime() - notifyTime.getTime()) < 30000) { // 30 segundos de margem
          NotificationService.showNotification(
            `Lembrete: ${todo.title}`,
            {
              body: `A tarefa "${todo.title}" vence em ${todo.notifyBefore} minutos!`,
              icon: '/icon.png',
              badge: '/badge.png'
            }
          )
          NotificationService.playSound('notification')
        }
      })
    }

    // Verifica a cada 30 segundos
    const interval = setInterval(checkNotifications, 30000)

    return () => clearInterval(interval)
  }, [todos])
} 