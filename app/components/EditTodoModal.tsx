// EditTodoModal.tsx
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Todo, Category, Priority } from "../types/todo"
import strings from "../constants/strings"

interface EditTodoModalProps {
  isOpen: boolean
  onClose: () => void
  todo: Todo
  updateTodo: (todo: Todo) => void
}

export default function EditTodoModal({ isOpen, onClose, todo, updateTodo }: EditTodoModalProps) {
  const [title, setTitle] = useState(todo.title)
  const [description, setDescription] = useState(todo.description)
  const [category, setCategory] = useState<Category>(todo.category)
  const [priority, setPriority] = useState<Priority>(todo.priority)
  const [dueDate, setDueDate] = useState(todo.dueDate || "")
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    setTitle(todo.title)
    setDescription(todo.description)
    setCategory(todo.category)
    setPriority(todo.priority)
    setDueDate(todo.dueDate || "")
    setShowError(false)
  }, [todo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!dueDate) {
      setShowError(true)
      return
    }

    updateTodo({
      ...todo,
      title,
      description,
      category,
      priority,
      dueDate,
    })
    setShowError(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{strings.app.editarTarefa}</DialogTitle>
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
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value)
              setShowError(false)
            }}
            placeholder={strings.tarefa.dataVencimento}
            className={showError ? "border-red-500" : ""}
            required
          />
          <Button type="submit">{strings.app.salvar}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}