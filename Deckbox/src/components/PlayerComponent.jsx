import React, { useState } from 'react'

function PlayerComponent({player}) {
    const [count,setCount] = useState(player.gametype);
    const [poison,setPoison] = useState(0);

    const increaselife = () => {
        setCount(count + 1);
    }
    const decreaselife = () => {
        if (count > 0) {
            setCount(count - 1);
        } 
    }
    const increasepoison = () => {
        setPoison(poison + 1);
    }
    const decreasepoison = () => {
        if (poison > 0) {
            setPoison(poison - 1);
        } 
    } 

    return (
  <div>
    <h2>{player.name}</h2>
    <div>
        <h3>Life Total: {count}</h3>
        <button onClick={increaselife}> + </button>
        <button onClick={decreaselife}> - </button>
    </div>
    <div>
        <h3>Poison Counters: {poison}</h3>
        <button onClick={increasepoison}> + </button>
        <button onClick={decreasepoison}> - </button>
      
    </div>
    </div>
  );

}




export default PlayerComponent