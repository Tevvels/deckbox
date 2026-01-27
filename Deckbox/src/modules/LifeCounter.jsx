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
            <div key={i}>Player {i +1}</div>
            <button onClick={()=>setLifeTotal(lifeTotal=> lifeTotal+1)}>{lifeTotal}
                </button>
                </>)
        }
        return players;    
    };

  return (
    <div>
    <div>lifeCounter</div>
    <input type="number" value={handleInput} onChange={inputValueChange} placeholder="What is the number of players?"/>
    <button onClick={handleSubmit}>Display Players</button>
    {renderPlayers()}

    <Players  players={playerCount}/>
    <Dice>hello</Dice>

    
    </div>
  )
}

export default LifeCounter