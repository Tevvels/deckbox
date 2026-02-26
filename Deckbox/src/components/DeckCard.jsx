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
// function to get the color identity of a commander and use it for stylign. 
const getDeckColorIdentity = (colorIdentity) =>{
    // checks if it has a color. 
    if (!colorIdentity || colorIdentity.length === 0) return {backgroundColor:"#a9a9a9"}
    // an array that represents the color pattern of MTG
    const wubrgOrder = ['W','U','B','R','G','C'];
    // a function to insure our color identity follow that pattern.
    const sortedIdentity = [...colorIdentity].sort((a,b)=> {
        return wubrgOrder.indexOf(a) - wubrgOrder.indexOf(b);
    });
    // if there is a color identity return this sorted color.
    if(sortedIdentity.length === 1) {
        return {backgroundColor: getColorIdentity(sortedIdentity[0])}
    }

    const colorTotals = sortedIdentity.length;
    // making a simple math equation that takes those numebrs and divides them evenly with 100. 
    const sectionWidth = 100/ colorTotals;
    // to make thicker lines in my gradient
    const gradientStops = sortedIdentity.map((char,index)=>{
        const color = getColorIdentity(char);
        const start = index * sectionWidth;
        const end = (index + 1) * sectionWidth;
        return `${color} ${start}%, ${color} ${end}%`;
    }).join(', ');
    // created a gradient for the color
    const gradientColors = sortedIdentity.map(char=> getColorIdentity(char)).join(', ')
    // getting a variable that as a defined number = to the length or amount of colors. 

return {background: `linear-gradient(110deg,${gradientStops})`,}    
} 



function DeckCard({deck,onDelete,showOwner = false}) {
    const colorIdentityStyle = getDeckColorIdentity(deck.color_identity)
    const validCards = deck.cards?.filter(c => c && c.cardId) || [];
    const firstCard = validCards.length > 0 ? validCards[0].cardId : null;
    
    const imageUrl = firstCard?.image_uris?.art_crop || firstCard?.card_faces?.[0]?.image_uris?.art_crop || "placeholder_url";

  return (

    

    <div className='deck_card-container'>
{console.log(deck.color_identity)}

        <Link className='deck_card-link' to={`/deck/${deck._id}`}>
            <div className="deck_card-content">
        <div className='my_Deck-color' style={colorIdentityStyle} />
                <img className='deck_card-art' alt="deckArt" src={imageUrl} />
                <h3 className="deck_card-name">{deck.name}</h3>
                <p>{deck.format}</p>
                {/* <p>Commander: {deck.commander || 'N/A'}</p> */}
                <p>Cards: {deck.cards.length}</p>
                {onDelete && (
                    <button className={`buttons buttons_delete`}
                    onClick={(e)=>{e.preventDefault(); onDelete(deck._id)}}
                    ></button>
                )}
                {showOwner && <h4 className='deck_card-owner'>{deck.user?.username || 'unknown'}</h4>}

            </div>
        
        </Link>
    </div>
  )
}

export default DeckCard