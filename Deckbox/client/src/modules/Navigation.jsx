import React, {useState} from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navigation.css";
import MenuLoop from "../components/MenuLoop.tsx";

function Navigation({ onLogout, isLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Players", path: "/players" },
    { name: "Public Decks", path: "/publicdecks" },
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
        <button
          className={`navigation_hamburger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <Link key={"toDashboard"} className="navigation_logo" to="/" onClick={closeMenu}>
          <h1 className="navigation_header">Deckbox</h1>
        </Link>


{/* the new desktop menu */}
    <div className="navigation_menu-desktop">
        <MenuLoop context="navigation_desktop" navLinks={navLinks} headerName={""} />
        <div className="navigation_user-dropdown">
          <button className="navigation_user-dropdown-button" onClick={() => setIsOpen(!isOpen)}> Profile Options </button>
          {isOpen && (
            
            <MenuLoop context="navigation_user_desktop" navLinks={profilelinks} headerName={""} />

          )}
        </div>
    </div>


{/* the mobile menu */}
          {isOpen && (
            <div className="navigation_menu-mobile">
     <div className="navigation_overlay" onClick={closeMenu}></div>
     <div className="navigation_menu-content">
            <MenuLoop context="navigation" navLinks={navLinks} headerName={"Navigation"} />
           {isLoggedIn ? (
            <div className="navigation_user-section">
             <MenuLoop context="navigation_user" navLinks={profilelinks} headerName={"Profile"} />
             <button
                className="buttons navigation_button logout"  
                onClick={() => {
                  onLogout();
                  closeMenu();
                }}
              >
                Logout
              </button>
              </div>
              ) : (
                <Link to="/login" onClick={closeMenu}>
                <button className="buttons navigation_button login">
                  Login
                </button>
              </Link>
              )}

              </div>
          </div>
          )}

      </nav>
    </div>
  );
}

export default Navigation;
