"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import strings from "../constants/strings"
import { getCurrentUser, signOut, supabase } from "../lib/supabase"

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        const { data, error } = await supabase.from("profiles").select("*").eq("id", currentUser.id).single()
        if (data) setProfile(data)
      } else {
        router.push("/login")
      }
    }
    fetchUserAndProfile()
  }, [router])

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      router.push("/login")
    }
  }

  if (!user || !profile) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{strings.profile.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>{strings.profile.email}:</strong> {user.email}
        </p>
        <p>
          <strong>{strings.profile.name}:</strong> {profile.full_name || "N/A"}
        </p>
        <p>
          <strong>{strings.profile.username}:</strong> {profile.username || "N/A"}
        </p>
        <p>
          <strong>{strings.profile.website}:</strong> {profile.website || "N/A"}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignOut}>{strings.auth.logout}</Button>
      </CardFooter>
    </Card>
  )
}

