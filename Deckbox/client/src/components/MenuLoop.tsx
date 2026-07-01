import React from 'react'
import { Link } from 'react-router-dom'

interface NavLink {
    name: string,
    path: string
}

interface MenuLoopProps {
    navLinks: NavLink[]
    headerName: string;
}

const MenuLoop: React.FC<MenuLoopProps> = ({ headerName,navLinks }) => {
  return (
    <>
    <div className="navigation header">
     {headerName}
    </div>
    <div className="navigation links">
        {navLinks.map((link, index) => (
            <Link
                key={link.path}
                className={` links navigation_link navigation_${link.name.replaceAll(" ", "")}`}
                to={link.path}
            >
                {link.name}
            </Link>
        ))}
        </div>
    </>
  );
};   

export default MenuLoop