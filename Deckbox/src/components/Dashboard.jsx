import Storage from '../modules/Storage'
import Navigation from '../modules/Navigation'
import PublicDeckDisplay from './PublicDeckDisplay'
import '../styles/Dashboard.css';
import { Link } from 'react-router-dom';
import { useMemo,useState } from 'react';
import Gradient from '../modules/Gradient';
import TextPhaser from '../modules/TextPhaser';
import Dice from './Dice';
import Players from './Players';

// Dashboard component
function Dashboard() {

  const [game,setGame] = useState(false);
  const wubrgPhrases = [
      {type:'symbol',value:"ms-w"},
      {type:'symbol',value:"ms-u"},
      {type:'symbol',value:"ms-b"},
      {type:'symbol',value:"ms-r"},
      {type:'symbol',value:"ms-g"},
      {type:'symbol',value:"ms-c"},
  
  
  ];

  const handleGameClick = () =>{
    setGame(true);
  }
  const handleGameClose = () =>{
    setGame(false);
  }
  
  return (
  
    <Gradient className='dashboard'>
      <Gradient className='dashboard_container-header'>
       <h1 className='header dashboard_header'> Welcome to Deckbox Dashboard </h1>
      </Gradient>
      <Gradient className='dashboard_container-newDeck'>            
              <p>Start a new Deck?</p>
              <Link className='dashboard_container-link' to={'/Deck/new'}>+</Link>
          </Gradient>
        <Gradient className='dashboard_container-lowerBlock'>
         <Storage />

        </Gradient>
        <Gradient className='dashboard_container-upperBlock'>
          <TextPhaser phrases={wubrgPhrases} />
        </Gradient>
 
        <Gradient className="dashboard_container-game">
          <button className='play-button' onClick={()=>setGame(true)}>
            Play
          </button>
        </Gradient>
       
          {game && (
       <Gradient className='modal'>
              <button onClick={()=> setGame(false)}>Close</button>
              <Players onClose={()=> setGame(false)}/>
            </Gradient>
        )}
       <Gradient className='dashboard_container-public'>
      <PublicDeckDisplay  />
      </Gradient>
    </Gradient>
  )
}

export default Dashboard