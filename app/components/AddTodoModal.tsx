// AddTodoModal.tsx
import { useState } from "react"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!dueDate || !dueTime) {
      setShowError(true)
      return
    }

    const dueDatetime = new Date(`${dueDate}T${dueTime}`)
    
    // Solicitar permissão para notificações
    if (Notification.permission !== "granted") {
      await Notification.requestPermission()
    }

    // Agendar notificação
    const notifyTime = new Date(dueDatetime.getTime() - parseInt(notifyBefore) * 60000)
    if (notifyTime > new Date()) {
      setTimeout(() => {
        new Notification("Lembrete de Tarefa", {
          body: `A tarefa "${title}" vence em ${notifyBefore} minutos!`,
          icon: "/icon.png" // Adicione um ícone para sua aplicação
        })
        // Tocar um som de notificação
        new Audio("/notification.mp3").play() // Adicione um som de notificação
      }, notifyTime.getTime() - new Date().getTime())
    }

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
