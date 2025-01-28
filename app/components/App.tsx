import React, { useState, useEffect, createContext, useContext } from "react";
import AddTodoModal from "./AddTodoModal";
import Sidebar from "./Sidebar";
import "../styles/theme.css";
import "../styles/sidebar.css";
import { Filter } from "../types/filter";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const App = () => {
  const [theme, setTheme] = useState("light");
  const [filter, setFilter] = useState<Filter>({ category: "", priority: "", status: "" });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app-container">
        <Sidebar filter={filter} setFilter={setFilter} completedTasks={0} totalTasks={0} />
        <div className="main-content">
          <AddTodoModal isOpen={true} onClose={() => {}} addTodo={() => {}} />
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;