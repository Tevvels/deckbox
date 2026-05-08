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
      <div className='dashboard_Logo'>            
          </div>
      <Gradient className='dashboard_container-header'>
       <h1 className='header dashboard_header'> Welcome to Deckbox Dashboard </h1>
      </Gradient>
        <div className='dashboard_container-search'>
         <Storage />

        </div>
        <div className='dashboard_container-upperBlock'>
          <TextPhaser phrases={wubrgPhrases} />
        </div>
 

       <div className='dashboard_container-public'>
      <PublicDeckDisplay  />
      </div>
    </Gradient>
  )
}

export default Dashboard