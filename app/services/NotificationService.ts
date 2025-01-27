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

    try {
      const audio = new Audio(sounds[soundType])
      audio.volume = 0.5
      
      // Força o carregamento do áudio
      audio.load()
      
      // Promessa para garantir que o som tocou
      const playPromise = audio.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Som tocado com sucesso')
          })
          .catch(error => {
            console.error('Erro ao tocar som:', error)
          })
      }
    } catch (error) {
      console.error('Erro ao criar áudio:', error)
    }
  }
} 