// AddTodoModal.tsx
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Todo, Category, Priority } from "../types/todo"
import strings from "../constants/strings"
import { format } from "date-fns"

interface AddTodoModalProps {
  isOpen: boolean
  onClose: () => void
  addTodo: (todo: Omit<Todo, "id" | "user_id">) => void
}

export default function AddTodoModal({ isOpen, onClose, addTodo }: AddTodoModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<Category>("work")
  const [priority, setPriority] = useState<Priority>("medium")
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("")
  const [notifyBefore, setNotifyBefore] = useState("30")
  const [showError, setShowError] = useState(false)

  const scheduleNotification = async (title: string, dueDate: Date, notifyMinutes: number) => {
    if (!("Notification" in window)) {
      console.log("Este navegador não suporta notificações desktop")
      return
    }

    try {
      const permission = await Notification.requestPermission()
      if (permission !== "granted") return

      const notifyTime = new Date(dueDate.getTime() - notifyMinutes * 60000)
      const now = new Date()

      if (notifyTime > now) {
        const timeoutId = setTimeout(async () => {
          try {
            // Criar notificação
            const notification = new Notification("Lembrete de Tarefa", {
              body: `A tarefa "${title}" vence em ${notifyMinutes} ${notifyMinutes === 1 ? 'minuto' : 'minutos'}!`,
              icon: "/icon.png",
              silent: true // Desabilita o som padrão do navegador
            })

            // Tocar som personalizado
            const audio = new Audio("/notification.mp3")
            await audio.play()

            // Registrar no console para debug
            console.log(`Notificação enviada para tarefa "${title}" - ${new Date().toLocaleString()}`)
          } catch (error) {
            console.error("Erro ao enviar notificação:", error)
          }
        }, notifyTime.getTime() - now.getTime())

        // Armazenar o ID do timeout para possível cancelamento futuro
        return timeoutId
      }
    } catch (error) {
      console.error("Erro ao agendar notificação:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!dueDate || !dueTime) {
      setShowError(true)
      return
    }

    const dueDatetime = new Date(`${dueDate}T${dueTime}`)
    
    // Agendar múltiplas notificações
    const notifyTimes = [1, 15, 30, 60, 1440] // 1min, 15min, 30min, 1h, 1dia
    const timeoutIds = await Promise.all(
      notifyTimes.map(minutes => scheduleNotification(title, dueDatetime, minutes))
    )

    // Armazenar os IDs dos timeouts no localStorage para persistência
    const storedNotifications = JSON.parse(localStorage.getItem('taskNotifications') || '{}')
    storedNotifications[title] = {
      timeoutIds,
      dueDate: dueDatetime.toISOString()
    }
    localStorage.setItem('taskNotifications', JSON.stringify(storedNotifications))

    addTodo({
      title,
      description,
      category,
      priority,
      dueDate: dueDatetime.toISOString(),
      completed: false,
      createdAt: new Date().toISOString(),
      status: "todo",
    })
    
    setTitle("")
    setDescription("")
    setCategory("personal")
    setPriority("medium")
    setDueDate("")
    setDueTime("")
    setShowError(false)
  }

  useEffect(() => {
    // Verificar permissão de notificação ao montar o componente
    if ("Notification" in window) {
      Notification.requestPermission()
    }

    // Verificar notificações armazenadas
    const storedNotifications = JSON.parse(localStorage.getItem('taskNotifications') || '{}')
    const now = new Date()

    Object.entries(storedNotifications).forEach(([title, data]: [string, any]) => {
      const dueDate = new Date(data.dueDate)
      if (dueDate > now) {
        // Reagendar notificações para tarefas ainda não vencidas
        const notifyTimes = [1, 15, 30, 60, 1440]
        notifyTimes.forEach(minutes => {
          scheduleNotification(title, dueDate, minutes)
        })
      }
    })
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{strings.app.adicionarTarefa}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {showError && (
            <Alert variant="destructive">
              <AlertDescription>
                Por favor, preencha a data de vencimento
              </AlertDescription>
            </Alert>
          )}
          <Input
            placeholder={strings.tarefa.titulo}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder={strings.tarefa.descricao}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
            <SelectTrigger>
              <SelectValue placeholder={strings.tarefa.categoria} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">{strings.categorias.pessoal}</SelectItem>
              <SelectItem value="work">{strings.categorias.trabalho}</SelectItem>
              <SelectItem value="shopping">{strings.categorias.compras}</SelectItem>
              <SelectItem value="other">{strings.categorias.outro}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
            <SelectTrigger>
              <SelectValue placeholder={strings.tarefa.prioridade} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">{strings.prioridades.baixa}</SelectItem>
              <SelectItem value="medium">{strings.prioridades.media}</SelectItem>
              <SelectItem value="high">{strings.prioridades.alta}</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value)
                  setShowError(false)
                }}
                className={showError ? "border-red-500" : ""}
                required
              />
            </div>
            <div className="flex-1">
              <Input
                type="time"
                value={dueTime}
                onChange={(e) => {
                  setDueTime(e.target.value)
                  setShowError(false)
                }}
                className={showError ? "border-red-500" : ""}
                required
              />
            </div>
          </div>
          <Select value={notifyBefore} onValueChange={setNotifyBefore}>
            <SelectTrigger>
              <SelectValue placeholder="Notificar antes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 minuto antes</SelectItem>
              <SelectItem value="15">15 minutos antes</SelectItem>
              <SelectItem value="30">30 minutos antes</SelectItem>
              <SelectItem value="60">1 hora antes</SelectItem>
              <SelectItem value="1440">1 dia antes</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">{strings.app.adicionarTarefa}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

console.log('Environment:', process.env.NODE_ENV);
