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
import ProfileModal from "./ProfileModal"
import { useAuth } from "../context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const { user, loading } = useAuth()
  const [userAvatar, setUserAvatar] = useState<string | null>(null)

  useEffect(() => {
    fetchTodos()
  }, []) // Removed userId from dependencies

  useEffect(() => {
    applyFilters()
  }, [todos, filter])

  useEffect(() => {
    const subscription = supabase
      .channel('todos_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'todos' 
      }, () => {
        fetchTodos()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (!user?.id) return
      
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('user_id', user.id)
        .single()

      if (data?.avatar_url) {
        setUserAvatar(data.avatar_url)
      }
    }

    fetchUserAvatar()
  }, [user])

  const fetchTodos = async () => {
    try {
      // Buscar tarefas com subtarefas em uma única query
      const { data: todos, error: todosError } = await supabase
        .from("todos")
        .select(`
          *,
          subtasks (*)
        `)
        .eq("user_id", userId)

      if (todosError) throw todosError

      setTodos(todos || [])
    } catch (error) {
      console.error("Error fetching todos:", error)
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
    try {
      const { error } = await supabase
        .from("todos")
        .update({
          title: updatedTodo.title,
          description: updatedTodo.description,
          category: updatedTodo.category,
          priority: updatedTodo.priority,
          dueDate: updatedTodo.dueDate,
          completed: updatedTodo.completed,
          status: updatedTodo.status
        })
        .eq("id", updatedTodo.id)
        .eq("user_id", userId)

      if (error) throw error

      setTodos(todos.map((todo) => 
        todo.id === updatedTodo.id 
          ? { ...todo, ...updatedTodo }
          : todo
      ))
    } catch (error) {
      console.error("Error updating todo:", error)
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
                variant="ghost" 
                size="icon" 
                onClick={() => setIsProfileModalOpen(true)}
                title={strings.profile.title}
                className="p-0 h-8 w-8"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatar || ""} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
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
        <ProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          loading={loading}
        />
      </div>
    </div>
  )
}

