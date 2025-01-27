"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import TodoList from "./components/TodoList"
import { getCurrentUser } from "./lib/supabase"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
      if (!currentUser) {
        router.push("/login")
      }
    }
    checkUser()
  }, [router])

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return null // Não renderiza nada se não houver usuário (será redirecionado)
  }

  return (
    <TodoList userId={user.id} />
  )
}

