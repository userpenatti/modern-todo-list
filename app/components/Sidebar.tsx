import Link from "next/link"
import { Home, BarChart2, ChevronLeft, ChevronRight, User, HelpCircle } from "lucide-react"
import FilterBar from "./FilterBar"
import UserProfileSection from "./UserProfileSection"
import type { Todo } from "../types/todo"
import strings from "../constants/strings"
import { useAuth } from "../context/AuthContext"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import HelpModal from "./HelpModal"
import React from "react"
import { FaHome, FaTasks, FaCalendarAlt, FaCog } from "react-icons/fa"
import { Filter } from "../types/filter"

interface SidebarProps {
  todos: Todo[]
  filter: Filter
  setFilter: (filter: Filter) => void
}

export default function Sidebar({ todos, filter, setFilter }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const completedTasks = todos.filter((todo) => todo.completed).length
  const totalTasks = todos.length

  return (
    <div className="relative">
      <div className={cn("h-screen bg-gray-100 transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0"
      )}>
        <div className={cn("p-4 flex flex-col h-full", !isOpen && "hidden")}>
          <div className="flex items-center justify-between mb-6 rounded-lg p-2">
            <h2 className="text-xl font-bold">{strings.app.titulo}</h2>
          </div>

          <nav className="mb-4">
            <Link href="/" className="flex items-center mb-2 text-gray-700 hover:text-gray-900">
              <Home className="mr-2" size={20} />
              {strings.app.inicio}
            </Link>
            <Link href="/statistics" className="flex items-center mb-2 text-gray-700 hover:text-gray-900">
              <BarChart2 className="mr-2" size={20} />
              {strings.app.estatisticas}
            </Link>
          </nav>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">{strings.app.estatisticasRapidas}</h3>
            <p>
              {strings.app.concluidas}: {completedTasks}/{totalTasks}
            </p>
          </div>
          <div className="mb-4 flex-grow">
            <h3 className="font-semibold mb-2">{strings.app.filtros}</h3>
            <FilterBar filter={filter} setFilter={setFilter} />
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-10 top-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {/* Botão de ajuda no final da sidebar */}
      <div className="absolute bottom-4 left-4 opacity-50 hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsHelpOpen(true)}
          className="h-8 w-8"
          title="Ajuda"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>

      <HelpModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  )
}

