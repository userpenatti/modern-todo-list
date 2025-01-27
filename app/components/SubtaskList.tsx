import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { Subtask } from "../types/todo"
import { supabase } from "../lib/supabase"

interface SubtaskListProps {
  todoId: string
  userId: string
  subtasks: Subtask[]
  onSubtasksChange: (subtasks: Subtask[]) => void
}

export default function SubtaskList({ todoId, userId, subtasks, onSubtasksChange }: SubtaskListProps) {
  const [newSubtask, setNewSubtask] = useState("")

  const addSubtask = async () => {
    if (!newSubtask.trim()) return

    try {
      const newSubtaskData = {
        todo_id: todoId,
        title: newSubtask.trim(),
        completed: false,
        user_id: userId
      }

      const { data, error } = await supabase
        .from("subtasks")
        .insert([newSubtaskData])
        .select()
        .single()

      if (error) throw error

      onSubtasksChange([...subtasks, data])
      setNewSubtask("")
    } catch (error) {
      console.error("Error adding subtask:", error)
    }
  }

  const toggleSubtask = async (subtask: Subtask) => {
    try {
      const { error } = await supabase
        .from("subtasks")
        .update({ completed: !subtask.completed })
        .eq("id", subtask.id)

      if (error) throw error

      onSubtasksChange(
        subtasks.map(st => 
          st.id === subtask.id 
            ? { ...st, completed: !st.completed }
            : st
        )
      )
    } catch (error) {
      console.error("Error updating subtask:", error)
    }
  }

  const deleteSubtask = async (id: string) => {
    const { error } = await supabase
      .from("subtasks")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting subtask:", error)
      return
    }

    onSubtasksChange(subtasks.filter(st => st.id !== id))
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Adicionar subtarefa"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addSubtask()}
        />
        <Button size="icon" onClick={addSubtask}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-2">
            <Checkbox
              checked={subtask.completed}
              onCheckedChange={() => toggleSubtask(subtask)}
            />
            <span className={subtask.completed ? "line-through text-gray-500" : ""}>
              {subtask.title}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => deleteSubtask(subtask.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
} 