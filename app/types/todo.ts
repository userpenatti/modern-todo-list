export type Category = "personal" | "work" | "shopping" | "other"
export type Priority = "low" | "medium" | "high"
export type Status = "todo" | "inProgress" | "done"

export interface Todo {
  id: string
  title: string
  description: string
  category: Category
  priority: Priority
  dueDate: string
  completed: boolean
  createdAt: string
  status: Status
  user_id: string
  notifyBefore?: number
}

