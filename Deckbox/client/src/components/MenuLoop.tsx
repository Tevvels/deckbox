import React from 'react'
import { Link } from 'react-router-dom'

interface NavLink {
    name: string,
    path: string
}

interface MenuLoopProps {
    navLinks: NavLink[]
    headerName: string;
    context?: string;

}

const MenuLoop: React.FC<MenuLoopProps> = ({ context,headerName,navLinks }) => {
  return (
    <div className={`menu_${context} menu_container`}>
    <div className={`menu_${context} menu_header`}>
     {headerName}
    </div>
    <div className=" menu_links">
        {navLinks.map((link, index) => (
            <Link
                key={link.path}
                className={` menu_link menu_${link.name.replaceAll(" ", "")}`}
                to={link.path}
            >
                {link.name}
            </Link>
        ))}
        </div>
    </div>
  );
};   

export default MenuLoop