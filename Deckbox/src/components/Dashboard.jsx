import Storage from '../modules/Storage'
import Navigation from '../modules/Navigation'
import PublicDeckDisplay from './PublicDeckDisplay'
import '../styles/Dashboard.css';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import Gradient from '../modules/Gradient';
import TextPhaser from '../modules/TextPhaser';

// Dashboard component
function Dashboard() {

  
  const wubrgPhrases = [
      {type:'symbol',value:"ms-w"},
      {type:'symbol',value:"ms-u"},
      {type:'symbol',value:"ms-b"},
      {type:'symbol',value:"ms-r"},
      {type:'symbol',value:"ms-g"},
      {type:'symbol',value:"ms-c"},
  
  
  ]


  
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
        <Gradient className='dashboard_container-sub-upperBlock'>
          <TextPhaser phrases={wubrgPhrases} />
        </Gradient>
 

       <Gradient className='dashboard_container-public'>
      <PublicDeckDisplay  />
      </Gradient>
    </div>
  )
}

export default Dashboard