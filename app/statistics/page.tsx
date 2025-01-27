"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { Todo } from "../types/todo"
import Sidebar from "../components/Sidebar"
import strings from "../constants/strings"
import { supabase } from "../lib/supabase"
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns"

export default function StatisticsPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState({
    category: "all",
    priority: "all",
    status: "all",
  })

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    const { data: user } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from("todos").select("*").eq("user_id", user.user?.id)
      setTodos(data || [])
    }
  }

  // Estatísticas gerais
  const completedTasks = todos.filter((todo) => todo.completed).length
  const totalTasks = todos.length
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0
  const overdueTasksCount = todos.filter(
    (todo) => !todo.completed && isBefore(new Date(todo.dueDate), new Date())
  ).length

  // Dados para o gráfico de status
  const statusData = [
    { name: "A Fazer", value: todos.filter(todo => todo.status === "todo").length },
    { name: "Em Andamento", value: todos.filter(todo => todo.status === "inProgress").length },
    { name: "Concluídas", value: todos.filter(todo => todo.status === "done").length },
  ]

  // Dados para o gráfico de prioridades
  const priorityData = [
    { name: "Alta", value: todos.filter(todo => todo.priority === "high").length },
    { name: "Média", value: todos.filter(todo => todo.priority === "medium").length },
    { name: "Baixa", value: todos.filter(todo => todo.priority === "low").length },
  ]

  // Dados para o gráfico de tarefas por dia
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return {
      date: format(date, "dd/MM"),
      completed: todos.filter(todo => 
        todo.completed && 
        isAfter(new Date(todo.dueDate), startOfDay(date)) &&
        isBefore(new Date(todo.dueDate), endOfDay(date))
      ).length,
      created: todos.filter(todo => 
        isAfter(new Date(todo.createdAt), startOfDay(date)) &&
        isBefore(new Date(todo.createdAt), endOfDay(date))
      ).length
    }
  }).reverse()

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <div className="flex h-screen">
      <Sidebar todos={todos} filter={filter} setFilter={setFilter} />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">{strings.app.estatisticas}</h1>
        
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Atrasadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{overdueTasksCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {todos.filter(todo => todo.status === "inProgress").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de Atividade */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade nos Últimos 7 Dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={last7Days}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="created" name="Criadas" fill="#8884d8" />
                    <Bar dataKey="completed" name="Concluídas" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Status */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Prioridades */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Prioridade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

