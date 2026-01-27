import React from 'react'
import data from './data.jsx'
import { Link } from 'react-router-dom';

function DeckDetail({deck}) {


    if (!data) {
        return <div><div>Loading...</div>
        <Link to="/dashboard">Back to Dashboard</Link>
        </div>;
    }

  return (
    <div>
      <ul>
      {deck.map((card,index)=>(
        <li key={card.id + index}>
          {card.name} - {card.set_name}
        </li>
      ))}
        </ul>

        <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  )
}

export default DeckDetail