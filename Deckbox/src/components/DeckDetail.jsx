import React, {useState,useMemo} from 'react'

function DeckDetail({cards =[], isOwner, onCardClick,OnDeleteCard}) {
 
 const [sortBy, setSortBy] = useState('none');

 const sortedCards = useMemo(()=>{
    console.log("sorting triggered",sortBy)
    let list = cards ? cards.filter(entry => entry && entry.cardId): [];
    if(sortBy === 'cmc') {
        return [...list].sort((a,b)=>(a.cardId.cmc || 0) - (b.cardId.cmc || 0));
    }

    if(sortBy === "type") {
            return [...list].sort((a,b)=>{
                const typeA = a.cardId?.type_line || "";
                const typeB = b.cardId?.type_line || "";
                return typeA.localeCompare(typeB);
            });
        }
        console.log(list)
        return list;
    
 },[cards,sortBy]);
 
 
    return (

    <div>DeckDetail

        <ul className={`Deck_list Deck_list-inDeck`}>
            <div className="sort_controls">
                <button className='buttons' onClick={()=>{console.log("button clicked"); setSortBy('type');}}>Type</button>
                <button className='buttons' onClick={()=>setSortBy('cmc')}>Mana </button>
                <button className='buttons' onClick={()=>setSortBy('none')}>Reset</button>
            </div>

            <ul className='list deck_list'>
                {sortedCards.map((deckEntry, index) =>{
                    if(!deckEntry.cardId) return null;
                    const colors = deckEntry.cardId.color_identity || [];

                    return (
                        <li className='listItem deck_listItem' key={deckEntry.cardId._id || index}>
                            <div className='deck_card' onClick={() => onCardClick(deckEntry.cardId)}>
                                <span className='deck_card-name'>{deckEntry.cardId.name}</span>
                            </div>
                            {isOwner && (
                                <button onClick={() => OnDeleteCard(deckEntry.cardId._id)}>Remove</button>
                            )}
                        </li>
                    )
                })}
            </ul>

        </ul>
    </div>
    )
}

export default DeckDetail