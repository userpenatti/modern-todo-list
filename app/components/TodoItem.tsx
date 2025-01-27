import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, ChevronDown, ChevronUp } from "lucide-react"
import type { Todo } from "../types/todo"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import strings from "../constants/strings"
import EditTodoModal from "./EditTodoModal"

interface TodoItemProps {
  todo: Todo
  updateTodo: (todo: Todo) => void
  deleteTodo: (id: string) => void
}

export default function TodoItem({ todo, updateTodo, deleteTodo }: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const toggleComplete = () => {
    updateTodo({ ...todo, completed: !todo.completed, status: !todo.completed ? "done" : "todo" })
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
              {strings.tarefa.dataVencimento}: {format(new Date(todo.dueDate), "dd/MM/yyyy")}
            </p>
          )}
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

