import Storage from '../modules/Storage'
import Navigation from '../modules/Navigation'
import PublicDeckDisplay from './PublicDeckDisplay'
import '../styles/Dashboard.css';

// Dashboard component
function Dashboard() {
  
  return (
  
  <>
    <ul className='Navigation'>
   </ul>
    <div className='Hero'>
      <div className='dashboardContainer'>

      
      <h1> Welcome to Deckbox Dashboard </h1>
      <Storage />
      </div>

      <div className='box container'>
        <div className='front xside'/>
        <div className='back xside'/>
        <div className='left yside'/>
        <div className='right yside'/>
        <div className='top zside'/>
        <div className='bottom zside'/>
      </div>
    </div>
   <div className='Public'>
   <PublicDeckDisplay />
   </div>
   
    </>
  )
}

export default Dashboard