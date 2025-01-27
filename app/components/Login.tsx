"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckSquare } from "lucide-react"
import strings from "../constants/strings"
import { signIn } from "../lib/supabase"
import { supabase } from "../lib/supabase"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { data, error } = await signIn(email, password)
    if (error) {
      setError(error.message)
    } else {
      router.push("/")
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Por favor, insira seu e-mail para redefinir a senha")
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      alert(strings.auth.resetPasswordSuccess)
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br p-4">
      <div className="flex flex-col items-center mb-8">
        <CheckSquare className="h-16 w-16 text-purple-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">{strings.app.titulo}</h1>
        <p className="text-gray-600 mt-2">Organize suas tarefas de forma eficiente</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{strings.auth.login}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                placeholder={strings.auth.email}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                placeholder={strings.auth.password}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button className="w-full" type="submit">
              {strings.auth.signIn}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button variant="link" onClick={handleForgotPassword}>
            {strings.auth.forgotPassword}
          </Button>
          <Button variant="link" onClick={() => router.push("/register")}>
            {strings.auth.noAccount} {strings.auth.signUp}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

