import React from 'react'
import { Link } from 'react-router-dom';
import '../styles/Navigation.css'


function Navigation({onLogout}) {
  return (
    <div className='Navigation'>
    <div className={`Navigation_Container`}>
      <Link className='Navigation_Link Navigation_Link-Home' to="/">DashBoard</Link>
      <Link className='Navigation_Link Navigation_Link-Player' to ="/players"> Player Tracker </Link>
      <Link className='Navigation_Link Navigation_Link-Deck'  to ="/deck/"> My Decks </Link>
      <Link className='Navigation_Link Navigation_Link-Public' to ="/publicdecks">See other decks</Link>
      <Link className='Navigation_Link Navigation_Link-Create' to ='/deck/new'> Create Deck </Link>
      <button onClick={()=>onLogout()}>Logout</button>

      </div>
    </div> 
  )
}

export default Navigation