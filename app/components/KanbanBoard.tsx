import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TodoItem from "./TodoItem"
import type { Todo } from "../types/todo"
import strings from "../constants/strings"

interface KanbanBoardProps {
  todos: Todo[]
  updateTodo: (todo: Todo) => void
  deleteTodo: (id: string) => void
}

export default function KanbanBoard({ todos, updateTodo, deleteTodo }: KanbanBoardProps) {
  const columns = [
    { id: "todo", title: strings.kanban.aFazer },
    { id: "inProgress", title: strings.kanban.emAndamento },
    { id: "done", title: strings.kanban.concluidas },
  ]

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const todo = todos.find((t) => t.id === draggableId)
    if (!todo) return

    let newStatus: "todo" | "inProgress" | "done"
    switch (destination.droppableId) {
      case "inProgress":
        newStatus = "inProgress"
        break
      case "done":
        newStatus = "done"
        break
      default:
        newStatus = "todo"
    }

    updateTodo({ ...todo, status: newStatus, completed: newStatus === "done" })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-1 min-w-[300px]">
            <Card>
              <CardHeader>
                <CardTitle>{column.title}</CardTitle>
              </CardHeader>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <CardContent {...provided.droppableProps} ref={provided.innerRef} className="min-h-[200px]">
                    {todos
                      .filter((todo) => {
                        if (column.id === "done") return todo.completed
                        if (column.id === "inProgress") return !todo.completed && todo.status === "inProgress"
                        return !todo.completed && (!todo.status || todo.status === "todo")
                      })
                      .map((todo, index) => (
                        <Draggable key={todo.id} draggableId={todo.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2"
                            >
                              <TodoItem todo={todo} updateTodo={updateTodo} deleteTodo={deleteTodo} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </CardContent>
                )}
              </Droppable>
            </Card>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}

