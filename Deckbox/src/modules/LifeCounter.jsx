import React, { useState } from 'react'
import Players from '../components/Players';
import Dice from '../components/Dice';
function LifeCounter() {
    const [playerCount,setPlayerCount] = useState([]);
    const [handleInput,setHandleInput] = useState('');
     const [lifeTotal,setLifeTotal] = useState(0);

    const updateLifeTotal = (id,newValue) =>{
        setLifeTotal(prevLife => prevLife.map(life => life.id === id? {...life, value:newValue}:life))
    }

    const inputValueChange = (event) =>{
        setHandleInput(event.target.value);
    }
    const handleSubmit = () =>{
        const count = parseInt(handleInput,10);
        if(!isNaN(count) && count >= 0){
            setPlayerCount(count)
        }else{
            setPlayerCount(0);
        }
    }
    
    const renderPlayers = () => {
        let players=[];
        for (let i = 0; i < playerCount && playerCount <= 6; i++){
            players.push(<>
            <div className='life_counter-player' key={i}>Player {i +1}</div>
            <button className='buttons life_counter-player-setLife' onClick={()=>setLifeTotal(lifeTotal=> lifeTotal+1)}>{lifeTotal}
                </button>
                </>)
        }
        return players;    
    };

  return (
    <div className='life_counter life_counter-container'>
    <h1 className='headers life_counter life_counter-header'>lifeCounter</h1>
    <input className='inputs life_counter-player-count' type="number" value={handleInput} onChange={inputValueChange} placeholder="What is the number of players?"/>
    <button className='buttons submit life_counter-player-countsub' onClick={handleSubmit}>Display Players</button>
    {renderPlayers()}

    <Players  players={playerCount}/>
    <Dice/>

    
    </div>
  )
}

export default LifeCounter