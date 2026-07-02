import React, {useState} from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navigation.css";
import MenuLoop from "../components/MenuLoop.tsx";

function Navigation({ onLogout, isLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);

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
          className=" navigation_hamburger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <Link key={"toDashboard"} className="navigation_logo" to="/">
          <h1 className="navigation_header">Deckbox</h1>
        </Link>

    <div className="navigation_menu-desktop">
        <MenuLoop context="navigation_desktop" navLinks={navLinks} headerName={""} />
        <MenuLoop context="navigation_user_desktop" navLinks={profilelinks} headerName={""} />
    </div>



          {isOpen && (
            <div className="navigation_menu-mobile">
     <div className="navigation_overlay" onClick={() => setIsOpen(false)}></div>
            <MenuLoop context="navigation" navLinks={navLinks} headerName={"Navigation"} />
           <MenuLoop context="navigation_user" navLinks={profilelinks} headerName={"Profile"} />
          </div>
          )}
            {isLoggedIn ?(  <button
                className="buttons navigation_button logout"
                onClick={() => onLogout()}
              >
                Logout
              </button>
              ):(
                <Link to="/login">
                <button className="buttons navigation_button login">
                  Login
                </button>
              </Link>
              )}
        
      </nav>
    </div>
  );
}

export default Navigation;
