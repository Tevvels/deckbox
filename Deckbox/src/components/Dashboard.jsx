import Storage from '../modules/Storage'
import Navigation from '../modules/Navigation'
import PublicDeckDisplay from './PublicDeckDisplay'
import '../styles/Dashboard.css';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import Gradient from '../modules/Gradient';

// Dashboard component
function Dashboard({x,y}) {

 const positions = useMemo(()=>{
    return Array.from({length:5},()=>({
      x:Math.floor(Math.random() * 100),
      y:Math.floor(Math.random() * 100)
    }))
  },[])
  
  return (
  
    <div className='dashboard'>
      <Gradient className='dashboard_container-header'>
       <h1 className='header dashboard_header'> Welcome to Deckbox Dashboard </h1>
      </Gradient>
      <Gradient 
          className='dashboard_container-newDeck'>            
              <p>Start a new Deck?</p>
              <Link className='dashboard_container-sub-link' to={'/Deck/new'}>+</Link>
          </Gradient>
        <Gradient className='dashboard_container-sub-lowerBlock'>
         <Storage />

        </Gradient>
        <Gradient className='dashboard_container-sub-upperBlock'/>
 

       <Gradient className='dashboard_container-public'>
      <PublicDeckDisplay />
      </Gradient>
    </div>
  )
}

export default Dashboard