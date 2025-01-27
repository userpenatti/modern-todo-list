"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckSquare } from "lucide-react"
import { supabase } from "../lib/supabase"
import strings from "../constants/strings"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })
      
      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br p-4">
      <div className="flex flex-col items-center mb-8">
        <CheckSquare className="h-16 w-16 text-purple-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">{strings.app.titulo}</h1>
        <p className="text-gray-600 mt-2">{strings.auth.resetPassword}</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{strings.auth.resetPassword}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder={strings.auth.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder={strings.auth.confirmPassword}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{strings.auth.resetPasswordSuccess}</AlertDescription>
              </Alert>
            )}
            <Button className="w-full" type="submit">
              {strings.auth.resetPassword}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 