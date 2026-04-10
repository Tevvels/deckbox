import React from 'react'
import { Link,useLocation } from 'react-router-dom';
import '../styles/Navigation.css'

function Navigation({onLogout}) {
  
  const location = useLocation();

  const navLinks = [
    {name: 'Dashboard', path:'/'},
    {name: 'Players', path:'/players'},
    {name: 'My Decks', path:'/deck'},
    {name: 'Public Decks',path:'/publicdecks'},
    {name: 'New Deck',path:'/deck/new'},
  ];

  const profilelinks = [
    {name: 'My Profile', path:'/profile'},
    {name: 'Settings', path:'/settings'},
  ]

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className='navigion'>

    <nav className={`navigation_container`}>
        <Link key={'toDashboard'} className='navigation_logo' to="/">
          <h1 className='navigation_header'>Deckbox</h1>
        </Link>
    {navLinks.map((link)=>(
      location.pathname !== link.path && (
        <Link
        key={link.path}
        className={` links navigation_link navigation_${link.name.replaceAll(" ","")}`}
        to={link.path}
        >{link.name}</Link>
      )
    ))}
      <div className='navigation_profile'>
        <button className='buttons navigation_button navigation_hamburger' onClick={()=>setIsOpen(!isOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {isOpen && (
          <div className='navigation_profile-dropdown'> 
            {profilelinks.map((link)=>(
              location.pathname !== link.path && (
                <Link
                key={link.path}
                className={` links navigation_link navigation_${link.name.replaceAll(" ","")}`}
                to={link.path}
                >{link.name}</Link>
              )
            ))}
      <button className='buttons navigation_button' onClick={()=>onLogout()}>Logout</button>
          </div>
        )}
      </div>



      </nav>
    </div> 
  )
}

export default Navigation