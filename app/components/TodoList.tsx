"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Plus, List, Columns, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import TodoItem from "./TodoItem"
import AddTodoModal from "./AddTodoModal"
import Sidebar from "./Sidebar"
import KanbanBoard from "./KanbanBoard"
import type { Todo } from "../types/todo"
import strings from "../constants/strings"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"

export default function TodoList({ userId }: { userId: string }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [filter, setFilter] = useState({
    category: "all",
    priority: "all",
    status: "all",
  })
  const [view, setView] = useState<"list" | "kanban">("list")
  const router = useRouter()

  useEffect(() => {
    fetchTodos()
  }, []) // Removed userId from dependencies

  useEffect(() => {
    applyFilters()
  }, [todos, filter])

  const fetchTodos = async () => {
    const { data, error } = await supabase.from("todos").select("*").eq("user_id", userId)
    if (error) {
      console.error("Error fetching todos:", error)
    } else {
      setTodos(data || [])
    }
  }

  const applyFilters = () => {
    let filtered = todos

    if (filter.category !== "all") {
      filtered = filtered.filter((todo) => todo.category === filter.category)
    }

    if (filter.priority !== "all") {
      filtered = filtered.filter((todo) => todo.priority === filter.priority)
    }

    if (filter.status !== "all") {
      filtered = filtered.filter((todo) => (filter.status === "completed" ? todo.completed : !todo.completed))
    }

    setFilteredTodos(filtered)
  }

  const addTodo = async (todo: Omit<Todo, "id" | "user_id">) => {
    const newTodo = { 
      ...todo, 
      id: uuidv4(), 
      status: "todo" as const,
      user_id: userId 
    }
    
    const { data, error } = await supabase.from("todos").insert([newTodo])
    if (error) {
      console.error("Error adding todo:", error)
    } else {
      setTodos([...todos, newTodo])
    }
    setIsAddModalOpen(false)
  }

  const updateTodo = async (updatedTodo: Todo) => {
    const { data, error } = await supabase
      .from("todos")
      .update(updatedTodo)
      .eq("id", updatedTodo.id)
      .eq("user_id", userId)
    if (error) {
      console.error("Error updating todo:", error)
    } else {
      setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)))
    }
  }

  const deleteTodo = async (id: string) => {
    const { data, error } = await supabase.from("todos").delete().eq("id", id).eq("user_id", userId)
    if (error) {
      console.error("Error deleting todo:", error)
    } else {
      setTodos(todos.filter((todo) => todo.id !== id))
    }
  }

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-purple-100 to-purple-300">
      <Sidebar todos={todos} filter={filter} setFilter={setFilter} />
      <div className="flex-1 flex flex-col min-h-0 border-l bg-white">
        <div className="p-4 border-b">
          <div className="flex justify-end items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setView("list")} title={strings.app.visualizacaoLista}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setView("kanban")} title={strings.app.visualizacaoKanban}>
                <Columns className="h-4 w-4" />
              </Button>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> {strings.app.adicionarTarefa}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => router.push('/profile')} 
                title={strings.profile.title}
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto min-h-0">
          {view === "list" ? (
            <div className="w-full max-w-7xl mx-auto px-4">
              <Card>
                <CardContent className="p-0">
                  {filteredTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} updateTodo={updateTodo} deleteTodo={deleteTodo} />
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <KanbanBoard 
              todos={filteredTodos} 
              updateTodo={updateTodo} 
              deleteTodo={deleteTodo}
              onAddTodo={() => setIsAddModalOpen(true)}
            />
          )}
        </div>

        <AddTodoModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} addTodo={addTodo} />
      </div>
    </div>
  )
}

