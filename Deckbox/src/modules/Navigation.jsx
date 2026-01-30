import React from 'react'
import { Link,useLocation } from 'react-router-dom';
import '../styles/Navigation.css'

function Navigation({onLogout}) {
  
  const location = useLocation();
  console.log(location);

  const navLinks = [
    {name: 'Dashboard', path:'/'},
    {name: 'Players', path:'/players'},
    {name: 'My Decks', path:'/deck'},
    {name: 'Public Decks',path:'/publicdecks'},
    {name: 'New Deck',path:'/deck/new'},
  ];
  console.log(navLinks)
  return (
    <div className='Navigation'>
    <nav className={`Navigation_Container`}>
    {navLinks.map((link)=>(
      location.pathname !== link.path && (
        <Link
        key={link.path}
        className='Navigation_Link'
        to={link.path}
        >{link.name}</Link>
      )
    ))}


      <button onClick={()=>onLogout()}>Logout</button>

      </nav>
    </div> 
  )
}

export default Navigation