import Storage from '../modules/Storage'
import Navigation from '../modules/Navigation'
import PublicDeckDisplay from './PublicDeckDisplay'
import '../styles/Dashboard.css';

// Dashboard component
function Dashboard() {
  
  return (
  
    <div className='dashboard'>
      <div className='dashboard_container'>
       <h1 className='header dashboard_header'> Welcome to Deckbox Dashboard </h1>
       <Storage />
        </div>
   
       <div className='dashboard_container dashboard_container-Public'>
     <PublicDeckDisplay />
    </div>
    </div>
  )
}

export default Dashboard