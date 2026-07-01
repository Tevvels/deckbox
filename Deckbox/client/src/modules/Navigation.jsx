import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navigation.css";
import MenuLoop from "../components/MenuLoop.tsx";

function Navigation({ onLogout }) {
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Players", path: "/players" },
    { name: "Public Decks", path: "/publicdecks" },
  ];
  
  const profilelinks = [
    { name: "New Deck", path: "/deck/new" },
    { name: "My Decks", path: "/deck" },
    { name: "My Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="navigion">
      <nav className={`navigation_container`}>
        <Link key={"toDashboard"} className="navigation_logo" to="/">
          <h1 className="navigation_header">Deckbox</h1>
        </Link>
        {/* {navLinks.map(
          (link) =>
            location.pathname !== link.path && (
              <Link
                key={link.path}
                className={` links navigation_link-desktop navigation_${link.name.replaceAll(" ", "")}`}
                to={link.path}
              >
                {link.name}
              </Link>
            ),
        )} */}
        <MenuLoop navLinks={navLinks} headerName={"Navigation"} />
        <div className="navigation_profile">
          <button
            className="buttons navigation_button navigation_hamburger"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          {isOpen && (
            // <div className="navigation_profile-dropdown">
            //   {navLinks.map(
            //     (link) =>
            //       location.pathname !== link.path && (
            //         <Link
            //           key={link.path}
            //           className={` links navigation_link navigation_${link.name.replaceAll(" ", "")}`}
            //           to={link.path}
            //         >
            //           {link.name}
            //         </Link>
            //       ),
            //   )}
            //   {profilelinks.map(
            //     (link) =>
            //       location.pathname !== link.path && (
            //         <Link
            //           key={link.path}
            //           className={` links navigation_link navigation_${link.name.replaceAll(" ", "")}`}
            //           to={link.path}
            //         >
            //           {link.name}
            //         </Link>
            //       ),
            //   )}
            // </div>
           <MenuLoop navLinks={profilelinks} headerName={"Profile"} />
          )}
              <button
                className="buttons navigation_button logout"
                onClick={() => onLogout()}
              >
                Logout
              </button>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
