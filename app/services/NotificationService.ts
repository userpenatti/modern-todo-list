export class NotificationService {
  static async requestPermission() {
    if (!("Notification" in window)) {
      console.log("Este navegador não suporta notificações desktop")
      return false
    }

    if (Notification.permission === "granted") {
      return true
    }

    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  static async showNotification(title: string, options?: NotificationOptions) {
    if (await this.requestPermission()) {
      return new Notification(title, options)
    }
  }

  static playSound(soundType: 'notification' | 'complete' = 'notification') {
    const sounds = {
      notification: '/sounds/notification.wav',
      complete: '/sounds/complete.wav'
    }

    const audio = new Audio(sounds[soundType])
    audio.volume = 0.5
    audio.play().catch(error => console.error('Erro ao tocar som:', error))
  }
} 