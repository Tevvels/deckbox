import React, { useState } from "react"; 
import { Link, useLocation } from "react-router-dom"; 
import "../styles/Navigation.css"; 
import MenuLoop from "../components/MenuLoop.tsx"; 
import ThemeMode from "../components/ThemeMode.jsx";
function Navigation({ onLogout, isLoggedIn }) { 
  const location = useLocation(); 
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  const closeAllMenus = () => { 
    setIsProfileOpen(false); 
    setIsMobileMenuOpen(false); 
  }; 

  const navLinks = [ 
    { name: "Home", path: "/" }, 
    { name: "Players", path: "/players" }, 
    { name: "Public Decks", path: "/publicdecks" },
    (!isLoggedIn ? { name: "Login", path: "/login" }:{name:"", path:""} ), 
  ]; 

  const profilelinks = [ 
    { name: "New Deck", path: "/deck/new" }, 
    { name: "My Decks", path: "/deck" }, 
    { name: "My Profile", path: "/profile" }, 
    { name: "Settings", path: "/settings" }, 
  ]; 

  return ( 
    <div className="navigation_wrapper"> 
      <nav className={`navigation_container`}> 
        {/* FIXED: Changed 'isOpen' to 'isMobileMenuOpen' */}
        <button 
          className={`navigation_hamburger ${isMobileMenuOpen ? "open" : ""}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        > 
          <span className="bar"></span> 
          <span className="bar"></span> 
          <span className="bar"></span> 
        </button> 

        <Link key={"toDashboard"} className="navigation_logo" to="/" onClick={closeAllMenus}> 
          <h1 className="navigation_header">Deckbox</h1> 
        </Link> 

        {/* Desktop Menu Layout */} 
        <div className="navigation_menu-desktop"> 
          <MenuLoop context="navigation_desktop" navLinks={navLinks} headerName={""} /> 
          {isLoggedIn && ( 
            <div className="navigation_user-dropdown"> 
              {/* Profile Icon Button */} 
              <button 
                className="navigation_user-dropdown-button" 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                aria-label="Toggle profile menu" 
              > 
                {/* SVG User Profile Placeholder Icon */} 
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"> 
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/> 
                </svg> 
              </button> 
              {isProfileOpen && ( 
                <div className="navigation_desktop-dropdown-list"> 
                  <MenuLoop context="navigation_user_desktop" navLinks={profilelinks} headerName={""} /> 
                  <button 
                    className="menu_link navigation_desktop-logout" 
                    onClick={() => { onLogout(); closeAllMenus(); }} 
                  > 
                    Logout 
                  </button> 
                </div> 
              )} 
            </div> 
          )} 
        </div> 

        {/* Mobile Flyout Menu */} 
        {/* FIXED: Changed 'isMobileOpen' to 'isMobileMenuOpen' */}
        {isMobileMenuOpen && ( 
          <div className="navigation_menu-mobile"> 
            <div className="navigation_overlay" onClick={closeAllMenus}></div> 
            <div className="navigation_menu-content"> 
              <MenuLoop context="navigation" navLinks={navLinks} headerName={"Navigation"} /> 
              {isLoggedIn ? ( 
                <div className="navigation_user-section"> 
                  <MenuLoop context="navigation_user" navLinks={profilelinks} headerName={"Profile"} /> 
                  <button 
                    className="buttons navigation_button logout" 
                    onClick={() => { onLogout(); closeAllMenus(); }} 
                  > 
                    Logout 
                  </button> 
                </div> 
              ) : ( 
                <Link to="/login" onClick={closeAllMenus}> 
                  <button className="buttons navigation_button login"> Login </button> 
                </Link> 
              )} 
            </div> 
          </div> 
        )} 
      </nav> 
      <ThemeMode />
    </div> 
  ); 
} 

export default Navigation;
