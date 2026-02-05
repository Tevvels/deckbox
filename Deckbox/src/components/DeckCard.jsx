import React from 'react'
import { Link } from 'react-router-dom';

const getColorIdentity = (char) =>{
    const colorMap = {
      'W': '#fdf1a2',
      'U': '#00a2e8',
      'B': '#000000',
      'R': '#e3312b',
      'G': '#00a650',
      'C': '#a9a9a9'
    };
    return colorMap[char] || '#a9a9a9';
}

const getDeckColorIdentity = (colorIdentity) =>{
    if (!colorIdentity || colorIdentity.length === 0) return {backgroundColor:"#a9a9a9"}
    if(colorIdentity.length === 1) {
        return {backgroundColor: getColorIdentity(colorIdentity[0])}
    }
    const gradientColors = colorIdentity.map(char=> getColorIdentity(char)).join(', ')
return {background: `linear-gradient(270deg,${gradientColors})`,}
} 

function DeckCard({deck,onDelete,showOwner = false}) {
    const validCards = deck.cards?.filter(c => c && c.cardId) || [];
    const firstCard = validCards.length > 0 ? validCards[0].cardId : null;
    
    const imageUrl = firstCard?.image_uris?.art_crop || firstCard?.card_faces?.[0]?.image_uris?.art_crop || "placeholder_url";


  return (

    <div className='deck_card-container'>
        <Link className='deck_card-link' to={`/deck/${deck._id}`}>
            <div className="deck_card-content">
                <img className='deck_card-art' alt="deckArt" src={imageUrl} />
                <h3 className="deck_card-name">{deck.name}</h3>
                {showOwner && <h4 className='deck_card-owner'>{deck.user?.username || 'unknown'}</h4>}
                <p>Format: {deck.format}</p>
                <p>Commander: {deck.commander || 'N/A'}</p>
                <p>Cards: {deck.cards.length}</p>
                {onDelete && (
                    <button className={`buttons buttons_delete`}
                        onClick={(e)=>{e.preventDefault; onDelete(deck._id)}}
                    ></button>
                )}

            </div>
        
        </Link>
    </div>
  )
}

export default DeckCard