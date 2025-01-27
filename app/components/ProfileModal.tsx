import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User } from "lucide-react"
import strings from "../constants/strings"
import { signOut, supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"

interface ProfileData {
  username: string
  full_name: string
  website: string
  avatar_url: string
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  loading: boolean
}

export default function ProfileModal({ isOpen, onClose, user, loading }: ProfileModalProps) {
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    full_name: "",
    website: "",
    avatar_url: ""
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      setProfileData({
        username: data.username || user.email,
        full_name: data.full_name || "",
        website: data.website || "",
        avatar_url: data.avatar_url || ""
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]
    setAvatarFile(file)

    // Preview imediato
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileData(prev => ({ ...prev, avatar_url: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null

    const fileExt = avatarFile.name.split('.').pop()
    const filePath = `${userId}/avatar.${fileExt}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Error uploading avatar:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      let avatarUrl = profileData.avatar_url
      if (avatarFile) {
        const newAvatarUrl = await uploadAvatar(user.id)
        if (newAvatarUrl) avatarUrl = newAvatarUrl
      }

      const updates = {
        user_id: user.id,
        username: profileData.username,
        full_name: profileData.full_name,
        website: profileData.website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updates)

      if (error) throw error

      setSuccess("Perfil atualizado com sucesso!")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{strings.profile.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{strings.profile.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileData.avatar_url} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full max-w-xs"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Nome de usuário</Label>
            <Input
              id="username"
              value={profileData.username}
              onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input
              id="fullName"
              value={profileData.full_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={profileData.website}
              onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleSignOut} type="button">
              {strings.auth.logout}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 