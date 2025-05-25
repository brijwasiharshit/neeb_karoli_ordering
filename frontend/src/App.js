import React, { createContext, useContext, useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FaShoppingCart } from "react-icons/fa";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "./components/screens/Home";


import { CartProvider, useCart } from "./components/ContextReducer";


import Thanks from "./components/screens/thanks";



import AddItems from "./components/AddItem";
// import AddItemNavbar from "./components/AddItemsNavbar";
import AdminLayout from "./components/screens/AddItemLayout";
// ✅ Create Theme Context for Dark Mode
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <CartProvider>
        <Router>
          <div
            className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}
          >
            
            {/* Page Animations */}
            <div className="page-transition">
              <Routes>
                <Route path="/" element={<Home />} />
        
         
               
                <Route path="/thanks" element={<Thanks />} />
        
         
               
              </Routes>
            </div>
          </div>
        </Router>
      </CartProvider>
    </ThemeContext.Provider>
  );
}

// Floating Cart Button Component



export default App;
