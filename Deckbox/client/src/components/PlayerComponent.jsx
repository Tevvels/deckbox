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
  <div className="player player_container">
    <h2 className="header player_header">{player.name}</h2>
        <div className='player_container-sub player_life'>
            <h3 className='header player_header-sub'>Life Total: {count}</h3>
            <button className='buttons player_life-plus' onClick={increaselife}> + </button>
            <button className='buttons player_life-minus' onClick={ decreaselife}> - </button>
        </div>
        <div className='header player_container-sub player_poison'>
            <h3 className='header player_header-sub'>Poison Counters: {poison}</h3>
            <button className='buttons player_poison-plus' onClick={increasepoison}> + </button>
            <button className='buttons player_poison-minus' onClick={decreasepoison}> - </button>
        </div>
    </div>
  );

}




export default PlayerComponent