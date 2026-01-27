import React from 'react'
import { Link } from 'react-router-dom';
import '../styles/Navigation.css'


function Navigation() {
  return (
    <>
    <div>Navigation</div>
      <Link to ="/players"> Player Tracker </Link>
      <Link to ="/deck/"> My Decks </Link>
      <Link to ="/publicdecks">See other decks</Link>
      <Link className='CreateDeck' to ='/deck/new'> Create Deck </Link>
      
    </> 
  )
}

export default Navigation