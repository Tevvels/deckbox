import Storage from '../modules/Storage'
import Navigation from '../modules/Navigation'
import PublicDeckDisplay from './PublicDeckDisplay'
import '../styles/Dashboard.css';
import { Link } from 'react-router-dom';

// Dashboard component
function Dashboard() {
  
  return (
  
    <div className='dashboard'>
      <div className='dashboard_container-header'>
       <h1 className='header dashboard_header'> Welcome to Deckbox Dashboard </h1>
       <Storage />
        </div>
        <div className='dashboard_container-newDeck'>
                  <p>Start a new Deck?</p>
          <Link className='dashboard_container-sub-link' to={'/Deck/new'}>+</Link>
        </div>
        <div className='dashboard_container-sub-lowerBlock'/>
        <div className='dashboard_container-sub-upperBlock'/>
 

       <div className='dashboard_container-public'>
      <PublicDeckDisplay />
      </div>
    </div>
  )
}

export default Dashboard