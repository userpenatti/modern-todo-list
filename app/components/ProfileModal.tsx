import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import strings from "../constants/strings"
import { signOut } from "../lib/supabase"
import { useRouter } from "next/navigation"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  loading: boolean
}

export default function ProfileModal({ isOpen, onClose, user, loading }: ProfileModalProps) {
  const router = useRouter()

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{strings.profile.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <strong>{strings.profile.email}:</strong> {user?.email}
          </div>
          {user?.user_metadata?.full_name && (
            <div>
              <strong>{strings.profile.name}:</strong> {user.user_metadata.full_name}
            </div>
          )}
          <div>
            <strong>ID:</strong> {user?.id}
          </div>
          <div>
            <strong>Último login:</strong>{" "}
            {user?.last_sign_in_at && new Date(user.last_sign_in_at).toLocaleString()}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="destructive" onClick={handleSignOut}>
            {strings.auth.logout}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 