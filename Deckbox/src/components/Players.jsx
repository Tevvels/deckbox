import React, { useState } from 'react'
import PlayerComponent from './PlayerComponent'
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';
import Dice from './Dice';

function Players() {
  const gameTypes = [
    {value:20, label:'Standard'},
     {value: 40, label:'Commander'}, 
     {value:30, label:'Two-Headed Giant'},
     {value:10, label:'Draft'} 
    ];
    const [gametype,setGametype] = useState(gameTypes[0]);
    const [playerCount,setPlayerCount] = useState(0);

    const handleInputChange = (event) =>{
        const value = parseInt(event.target.value,10);
        setPlayerCount(isNaN(value) || value < 0 || value >=7 ? 0: value );
    }
    
    const createPlayers = (count, gameType) => {
      return Array.from({length: count}, (_, index) => ({
        id: index + 1,
        name: `Player ${index + 1}`,
        gametype: gameType
      }));
    }
    const players = createPlayers(playerCount, gametype.value);

  return (
    <div className='player player_container'>
      <Dice />
      <Dropdown options={gameTypes} onSelect={(option) => setGametype(option)} />
        <label className='player_label'>number of players
          <input
            className='inputs player_input'
            type={'number'} 
            value={playerCount} 
            onChange={handleInputChange} 
            min="0" 
            max="6"
          />

        </label>

    <ul className='player_list'>
      {players.map((player) => (
        <li className='player_listItem' key={player.id}>
          <PlayerComponent player={player} />
        </li>
      ))}
    </ul>
    <Link className='links player_link' to ="/dashboard"> Back to Dashboard </Link>
    </div>
  )
}

export default Players