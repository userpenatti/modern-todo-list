import React from "react";
import Link from "next/link";
import { FaSun, FaMoon, FaTasks, FaCalendarAlt, FaCog } from "react-icons/fa";
import { Home, BarChart2 } from "react-feather";
import strings from "../constants/strings"; // Corrigido
import { useTheme } from "./App";
import FilterBar from "./FilterBar";
import { Filter } from "../types/filter";

interface SidebarProps {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  completedTasks: number;
  totalTasks: number;
}

const Sidebar: React.FC<SidebarProps> = ({ filter, setFilter, completedTasks, totalTasks }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="text-xl font-semibold">{strings.app.titulo}</h1>
        <button onClick={toggleTheme} className="theme-toggle-button">
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </div>
      <nav className="sidebar-nav">
        <Link href="/" className="nav-item">
          <Home className="mr-3" size={20} />
          <span>{strings.app.inicio}</span>
        </Link>
        <Link href="/tasks" className="nav-item">
          <FaTasks className="mr-3" size={20} />
          <span>Tarefas</span>
        </Link>
        <Link href="/calendar" className="nav-item">
          <FaCalendarAlt className="mr-3" size={20} />
          <span>Calendário</span>
        </Link>
        <Link href="/analytics" className="nav-item">
          <BarChart2 className="mr-3" size={20} />
          <span>Análise</span>
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
  );
};

export default Sidebar;

