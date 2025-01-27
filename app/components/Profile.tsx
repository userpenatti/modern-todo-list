"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import strings from "../constants/strings"
import { getCurrentUser, signOut, supabase } from "../lib/supabase"

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndProfile()
  }, [router])

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-purple-300">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{strings.profile.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{strings.profile.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>{strings.profile.email}:</strong> {user.email}
          </div>
          {user.user_metadata?.full_name && (
            <div>
              <strong>{strings.profile.name}:</strong> {user.user_metadata.full_name}
            </div>
          )}
          <div>
            <strong>ID:</strong> {user.id}
          </div>
          <div>
            <strong>Último login:</strong>{" "}
            {new Date(user.last_sign_in_at).toLocaleString()}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            Voltar
          </Button>
          <Button variant="destructive" onClick={handleSignOut}>
            {strings.auth.logout}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

