import React from 'react'
import { Link,useLocation } from 'react-router-dom';
import '../styles/Navigation.css'





function Navigation({onLogout}) {
  
  const location = useLocation();
  const navigationLocations = [
    {pathname:"Home",path:"/"},
    {pathname: 'My Decks',path:"/deck/"},
  
    {pathname: 'Public Decks',path :"/publicdecks"},
    {pathname: 'Play a Game',Path:'/deck/new'}
  ]
  
  
  return (
    <div className='Navigation'>
    <div className={`Navigation_Container`}>
      {
        navigationLocations.filter((nav)=> nav.path !== location.pathname).map((nav)=>(
          <Link 
          key={nav.path} 
          className={`Navigation_Link Navigation_Link-${location.name}`}
          to={nav.path} >
          {nav.pathname}
          </Link>

        ))
      }
      <button onClick={()=>onLogout()}>Logout</button>

      </div>
    </div> 
  )
}

export default Navigation