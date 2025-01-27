import { useEffect, useRef } from 'react'
import { NotificationService } from '../services/NotificationService'

export function useNotifications(todos: any[]) {
  // Usar ref para controlar quais notificações já foram enviadas
  const notifiedTodos = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Solicita permissão assim que o componente montar
    NotificationService.requestPermission()

    const checkNotifications = () => {
      const now = new Date()

      todos.forEach(todo => {
        // Ignora se já foi notificado ou está completo
        if (notifiedTodos.current.has(todo.id) || todo.completed || !todo.dueDate || !todo.notifyBefore) return

        const dueDate = new Date(todo.dueDate)
        const notifyTime = new Date(dueDate.getTime() - (todo.notifyBefore * 60 * 1000))
        
        // Calcula a diferença em minutos
        const diffInMinutes = (notifyTime.getTime() - now.getTime()) / (1000 * 60)

        // Se estamos dentro do minuto de notificação (com margem de 30 segundos)
        if (diffInMinutes <= 1 && diffInMinutes >= -0.5) {
          console.log('Enviando notificação para:', todo.title)
          console.log('Hora atual:', now)
          console.log('Hora da notificação:', notifyTime)
          
          NotificationService.showNotification(
            `Lembrete: ${todo.title}`,
            {
              body: `A tarefa "${todo.title}" vence em ${todo.notifyBefore} minutos!`,
              icon: '/icon.png',
              badge: '/badge.png'
            }
          )
          
          // Toca o som
          NotificationService.playSound('notification')
          
          // Marca como notificado
          notifiedTodos.current.add(todo.id)
        }
      })
    }

    // Verifica a cada 15 segundos
    const interval = setInterval(checkNotifications, 15000)

    return () => clearInterval(interval)
  }, [todos])
} 