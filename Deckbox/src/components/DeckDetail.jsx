import React, {useState,useMemo} from 'react'
import '../styles/CardDetail.css';

function DeckDetail({cards =[], isOwner,name, onCardClick,OnDeleteCard}) {
 

const [sortBy, setSortBy] = useState('none');
const [cardPreview, setCardPreview] = useState(null);
 const sortedCards = useMemo(()=>{
    let list = cards ? cards.filter(entry => entry && entry.cardId): [];
    console.log("Original cards:", list);
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
        return list;
    
 },[cards,sortBy]);
 const stats = useMemo(()=>{
    const counts = {
        creature: 0,
        planeswalker: 0,
        instant: 0,
        sorcery: 0,
        enchantment: 0,
        artifact: 0,
        land: 0,
        other: 0,
        total: 0
    };
    cards.forEach(entry => {
        if(entry && entry.cardId) {
            const typeLine = entry.cardId.type_line.toLowerCase();
            if(typeLine.includes('creature')) counts.creature++;
            else if(typeLine.includes('planeswalker')) counts.planeswalker++;
            else if(typeLine.includes('instant')) counts.instant++;
            else if(typeLine.includes('sorcery')) counts.sorcery++;
            else if(typeLine.includes('enchantment')) counts.enchantment++;
            else if(typeLine.includes('artifact')) counts.artifact++;
            else if(typeLine.includes('land')) counts.land++;
            else counts.other++;
            counts.total++;
        }
    });
    return counts;
 },[cards]);
 
    return (
        <>

      
        
    <div className='deck_container'>
        <div className='deck_header'>{name}</div>
        <ul className={`Deck_list Deck_list-inDeck`}>
            <div className="sort_controls">
                <button className='buttons' onClick={()=>{console.log("button clicked"); setSortBy('type');}}>Type</button>
                <button className='buttons' onClick={()=>setSortBy('cmc')}>Mana </button>
                <button className='buttons' onClick={()=>setSortBy('none')}>Reset</button>
            </div>

            <ul className='list deck_list'>
                {sortedCards.map((deckEntry, index) =>{
                const card = deckEntry.cardId;
                const qty = deckEntry.quantity || 1;
                    // const uniqueKey = `${deckEntry.cardId._id}-${index}`;
                    // if(!deckEntry.cardId) return null;
                    // const colors = deckEntry.cardId.color_identity || [];

                    return (
                        <li className='listItem deck_listItem' key={`${card._id}-${index}`}
                        onMouseEnter={()=> setCardPreview(card)}
                            onClick={()=> onCardClick(card)}
                        
                        >
                            <div className='deck_card' onClick={() => onCardClick(deckEntry.cardId)}>
                                <span className='deck_card-name'>{deckEntry.cardId.name}</span>
                                <span className='deck_card-qty'> x {qty}</span>
                                <img className='deck_card-img' src={deckEntry.cardId.image_uris?.small || "https://via.placeholder.com/150"} alt={deckEntry.cardId.name} />
                            </div>
                            {isOwner && (
                                <button className="delete_button" 
                                        onClick={(e) =>{e.stopPropagation();
                                        if(window.confirm(`Remove ${card.name} from deck?`)) {
                                            OnDeleteCard(card._id);
                                        }
                                    }}
                            >
                                remove
                            </button>
                    )}
                        </li>
                    )
                })}
            </ul>


        </ul>
    </div>
    <div className='card_preview'>
          <div className='deck_stats'>
            <h3>Deck Statistics</h3>
            <p>Total Cards: {stats.total}</p>
            <p>Creatures: {stats.creature}</p>
            <p>Planeswalkers: {stats.planeswalker}</p>
            <p>Instants: {stats.instant}</p>
            <p>Sorceries: {stats.sorcery}</p>
            <p>Enchantments: {stats.enchantment}</p>
            <p>Artifacts: {stats.artifact}</p>
            <p>Lands: {stats.land}</p>
            <p>Other: {stats.other}</p>
        </div>
        {cardPreview ? (
            <div className='card-preview'>
                <h3>{cardPreview.name}</h3>
                <img src={cardPreview.image_uris?.normal || "https://via.placeholder.com/300"} alt={cardPreview.name} />
                <p>{cardPreview.type_line}</p>
                <p>{cardPreview.oracle_text}</p>
            </div>
        ) : (
            <p>Hover over a card to see details</p>
        )}
    </div>
</>
    )
}

export default DeckDetail