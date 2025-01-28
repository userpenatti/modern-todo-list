import React, { useState, useEffect, createContext, useContext } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import AddTodoModal from "./AddTodoModal";
import "../styles/theme.css";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const App = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div>
        <button onClick={toggleTheme} className="theme-toggle-button">
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
        <AddTodoModal isOpen={true} onClose={() => {}} addTodo={() => {}} />
      </div>
    </ThemeContext.Provider>
  );
};

export default App;