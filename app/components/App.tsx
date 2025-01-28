import React, { useState, useEffect, createContext, useContext } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
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
        <Sidebar todos={[]} filter={filter} setFilter={setFilter} />
        <div className="main-content">
          <button onClick={toggleTheme} className="theme-toggle-button">
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          <AddTodoModal isOpen={true} onClose={() => {}} addTodo={() => {}} />
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;