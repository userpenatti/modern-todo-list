"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Todo } from "../types/todo"
import Sidebar from "../components/Sidebar"
import strings from "../constants/strings"

export default function StatisticsPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState({
    category: "all",
    priority: "all",
    status: "all",
  })

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos")
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
  }, [])

  const completedTasks = todos.filter((todo) => todo.completed).length
  const totalTasks = todos.length
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0

  const categoryCounts = todos.reduce(
    (acc, todo) => {
      acc[todo.category] = (acc[todo.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const priorityCounts = todos.reduce(
    (acc, todo) => {
      acc[todo.priority] = (acc[todo.priority] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="flex h-screen">
      <Sidebar todos={todos} filter={filter} setFilter={setFilter} />
      <div className="flex-1 p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">{strings.app.estatisticas}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{strings.estatisticas.conclusaoTarefas}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {strings.estatisticas.tarefasConcluidas}: {completedTasks}
              </p>
              <p>
                {strings.estatisticas.totalTarefas}: {totalTasks}
              </p>
              <p>
                {strings.estatisticas.taxaConclusao}: {completionRate}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{strings.estatisticas.categorias}</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(categoryCounts).map(([category, count]) => (
                <p key={category}>
                  {strings.categorias[category as keyof typeof strings.categorias]}: {count}
                </p>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{strings.estatisticas.prioridades}</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(priorityCounts).map(([priority, count]) => (
                <p key={priority}>
                  {strings.prioridades[priority as keyof typeof strings.prioridades]}: {count}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

