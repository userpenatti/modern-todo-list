import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Todo, Category, Priority } from "../types/todo"
import { Label } from "@/components/ui/label";
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
  const [category, setCategory] = useState<Category>("personal")
  const [priority, setPriority] = useState<Priority>("medium")
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("")
  const [recurrence, setRecurrence] = useState<string>("none");
  const [showError, setShowError] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)

  // Remover useEffect e timeoutIds se não estiver usando notificações

  const scheduleRecurringTask = (title: string, dueDate: Date, recurrence: string) => {
    let interval: number;

    switch (recurrence) {
      case "daily":
        interval = 24 * 60 * 60 * 1000; // 1 dia
        break;
      case "weekly":
        interval = 7 * 24 * 60 * 60 * 1000; // 1 semana
        break;
      case "monthly":
        interval = 30 * 24 * 60 * 60 * 1000; // 1 mês (aproximado)
        break;
      default:
        return;
    }

    setInterval(() => {
      addTodo({
        title,
        description: "",
        category: "personal",
        priority: "medium",
        dueDate: new Date(dueDate.getTime() + interval).toISOString(),
        createdAt: new Date().toISOString(),
        completed: false,
        status: "todo"
      });
    }, interval);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dueDate || !dueTime) {
      setShowError(true);
      return;
    }

    const dueDatetime = new Date(`${dueDate}T${dueTime}`);

    addTodo({
      title,
      description,
      category,
      priority,
      dueDate: dueDatetime.toISOString(),
      completed: false,
      createdAt: new Date().toISOString(),
      status: "todo"
    });

    setTitle("");
    setDescription("");
    setCategory("personal");
    setPriority("medium");
    setDueDate("");
    setDueTime("");
    setRecurrence("none");
    setShowError(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Tarefa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {showError && (
            <Alert variant="destructive">
              <AlertDescription>Por favor, preencha todos os campos</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Pessoal</SelectItem>
                <SelectItem value="work">Trabalho</SelectItem>
                <SelectItem value="shopping">Compras</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="dueTime">Hora de Vencimento</Label>
            <Input
              id="dueTime"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="recurrence">Recorrência</Label>
            <Select value={recurrence} onValueChange={(value: string) => setRecurrence(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Recorrência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                <SelectItem value="daily">Diária</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Adicionar Tarefa</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
