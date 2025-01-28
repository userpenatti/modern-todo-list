export type Category = "personal" | "work" | "shopping" | "other"
export type Priority = "low" | "medium" | "high"
export type Status = "todo" | "inProgress" | "done"

export interface Subtask {
  id: string
  todo_id: string
  title: string
  completed: boolean
  created_at: string
  user_id: string
}

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  status: Status;
}

