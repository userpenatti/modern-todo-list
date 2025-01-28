import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TodoItem from "./TodoItem"
import type { Todo } from "../types/todo"
import strings from "../constants/strings"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, destination: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskMove }) => {
  const columns = {
    todo: tasks.filter(task => task.status === 'todo'),
    doing: tasks.filter(task => task.status === 'doing'),
    done: tasks.filter(task => task.status === 'done')
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    onTaskMove(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4">
        {Object.entries(columns).map(([columnId, columnTasks]) => (
          <div key={columnId} className="bg-gray-100 p-4 rounded-lg w-80">
            <h2 className="text-lg font-semibold mb-4 capitalize">{columnId}</h2>
            <Droppable droppableId={columnId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[200px]"
                >
                  {columnTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 rounded mb-2 shadow"
                        >
                          {task.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;

