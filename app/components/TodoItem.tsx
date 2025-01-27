import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, ChevronDown, ChevronUp } from "lucide-react"
import type { Todo, Status } from "../types/todo"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import strings from "../constants/strings"
import EditTodoModal from "./EditTodoModal"
import SubtaskList from "./SubtaskList"
import { supabase } from "../lib/supabase"
import { NotificationService } from '../services/NotificationService'

interface TodoItemProps {
  todo: Todo
  updateTodo: (todo: Todo) => void
  deleteTodo: (id: string) => void
}

export default function TodoItem({ todo, updateTodo, deleteTodo }: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const toggleComplete = async () => {
    try {
      const newStatus: Status = !todo.completed ? "done" : "todo"
      const updatedTodo = { 
        ...todo, 
        completed: !todo.completed, 
        status: newStatus
      }
      
      // Primeiro atualiza no banco
      const { error } = await supabase
        .from("todos")
        .update({ 
          completed: updatedTodo.completed,
          status: updatedTodo.status
        })
        .eq("id", todo.id)
      
      if (error) throw error

      // Se estiver marcando como concluído, toca o som
      if (updatedTodo.completed) {
        NotificationService.playSound('complete')
      }

      // Se sucesso, atualiza na UI
      updateTodo(updatedTodo)
    } catch (error) {
      console.error("Error toggling todo:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className={`p-4 border-b last:border-b-0 ${todo.completed ? "bg-gray-100" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox checked={todo.completed} onCheckedChange={toggleComplete} />
          <span className={`font-medium ${todo.completed ? "line-through text-gray-500" : ""}`}>
            {todo.title}
          </span>
          <Badge className={getPriorityColor(todo.priority)}>
            {strings.prioridades[todo.priority as keyof typeof strings.prioridades]}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-2 text-sm text-gray-600">
          <p>{todo.description}</p>
          {todo.dueDate && (
            <p className="mt-1">
              <strong>Prazo:</strong> {format(new Date(todo.dueDate), "dd/MM/yyyy HH:mm")}
            </p>
          )}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Subtarefas</h4>
            <SubtaskList
              todoId={todo.id}
              userId={todo.user_id}
              subtasks={todo.subtasks || []}
              onSubtasksChange={(subtasks) => 
                updateTodo({ ...todo, subtasks })
              }
            />
          </div>
        </div>
      )}
      <EditTodoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        todo={todo}
        updateTodo={updateTodo}
      />
    </div>
  )
}

