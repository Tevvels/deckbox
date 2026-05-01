import React, {useState,useMemo,useEffect, use} from 'react'
import '../styles/CardDetail.css';
import '../styles/myDecks.css';
import Gradient from "../modules/Gradient"
import { useTokens } from '../modules/Tokens';

const MANA_TYPES = ["W","U","B","R","G","C"];

function DeckDetail({cards =[], isOwner,name, onCardClick,OnDeleteCard,format}) {

    const [sortBy, setSortBy] = useState('none');
    const [cardPreview, setCardPreview] = useState(null);
    const [withImage, setWithImage] = useState(false);


    // Sorts the cards. 
    const sortedCards = useMemo(()=>{
        let list = cards.filter(entry => entry?.cardId).sort((a,b)=> a.cardId.name.localeCompare(b.cardId.name));
        if(sortBy === 'none') return {'All Cards': list};
        return list.reduce((groups,entry)=>{
            const card = entry.cardId;
            const category = sortBy === "type"
             ? (['creature','planeswalker','instant','sorcery','instant','enchantment','artifact','battle','land'].find(t => card.type_line.toLowerCase().includes(t)) ||"other")
             : `Mana Value ${card.cmc || 0}`;
             (groups[category] = groups[category]|| []).push(entry);
             return groups;
        },{});
    },[cards,sortBy]);

    const tokens = useTokens(sortedCards);
   
    const deckMetrics = useMemo(()=>{
        const init = {
            counts:{total:0,creature:0,planeswalker:0,artifact:0,enchantment:0,instant:0,sorcery:0,battle:0,land:0},
            mana:{cmc:0,W:0,U:0,B:0,R:0,G:0,C:0},
            colors:new Set()
        };

        cards.forEach(({cardId: card, quantity = 1})=>{
            if(!card) return;

            //counts the cards types
            const type = card.type_line.toLowerCase();
            const qty = Number(quantity);
            init.counts.total += qty;
            const mainType = ['creature','planeswalker','artifact','enchantment','sorcery','instant','battle','land'].find(t => type.includes(t)) || "other";
            init.counts[mainType] += qty;

            card.color_identity?.forEach(c => init.colors.add(c));
            const cost = card.mana_cost || (card.card_faces?.map(f => f.mana_cost).join("")|| "");
            const costString = card.mana_cost || (card.card_faces?.map(f => f.mana_cost).join("")|| "");
            const symbols = costString.match(/\{([^}]+)\}/g);
        

            if(symbols) {
                symbols.forEach(s => {
                    const core = s.slice(1,-1);
                    
                    MANA_TYPES.forEach(color =>{
                        if(core.includes(color)) init.mana[color] += qty;
                    });
                });
            } else if(!type.includes("land")) {
                init.mana.C += qty;
            }
        });
        if (init.colors.size === 0) init.colors.add("C");
        return init;
    },[cards]);

    
    useEffect(()=>{
        if(cards.length > 0 && !cardPreview){
            setCardPreview(cards.find(e => e.cardId?.name === name)?.cardId || cards[0].cardId);
        }
    },[cards,name]);


    return (
        <div className="full_deck">
    
    
    <div className='deck_container'>
        <div className='deck_header'>{name}</div>
            <div className="sort_controls">
              {['type','cmc','none'].map(s=>(
                <button key={s} className='buttons' onClick={()=>setSortBy(s)}>
                    {s ==="none"? "Reset": s.toUpperCase()}
                </button>
              ))}
              </div>

            <ul className={`list ${sortBy}`}>\
                // iterating over the sorted cards and displaying them by category.
                {Object.entries(sortedCards).map(([category, entries])=>(
                    <Gradient className={`sort_order ${category.replaceAll(" ","")}`}>
                    <li 
                    className={`deck_list-categoryList `} 
                    key={category}
                        
                    >
                        <button className='buttons buttons_imageToggle' onClick={()=> setWithImage(w => !w)}>
                            {withImage ? "Hide Images": "Show Images"}
                        </button>
                    <h3 className='deck_header-sub'>{category}({entries.reduce((sum,i) => sum +( i.quantity  ||1),0)})</h3>
                    <ul className='deck_list'>
                    {entries.map(entry =>(
                        <li 
                        key={entry._id}
                        className='card_entry'
                        onClick={()=> onCardClick(entry.cardId)}
                        onMouseEnter={()=> setCardPreview(entry.cardId)}
                        >
                            {withImage && (<img className='card_entry-image' src={entry.cardId.image_uris?.small || entry.cardId.card_faces?.[0]?.image_uris?.small} alt={entry.cardId.name} />)}
                            {entry.cardId.name} x {entry.quantity}
                            {isOwner && (
                                <button 
                                className='buttons buttons_delete'
                                onClick={(e)=>{e.stopPropagation(); OnDeleteCard(entry.cardId._id)}
                            }                        >X</button>
                        )}
                    </li>
                ))}
            </ul>
        </li>
                </Gradient>
    ))}
     </ul>
    </div>

    <Gradient className="deck_container-token">
        <h3>Tokens</h3>
        <div className='tokens_container'>
            {tokens?.length > 0 ? tokens.map((token, index) => ( 
                <div key={index} className='token '>
                    <p>{token.name}</p>
                    <img className='card' src={token.image_uris?.small || token.image_uris?.normal} 
                    alt={token.name} />
                </div>
            )) : <p>No tokens in this deck</p>}
        </div>
    </Gradient>

    <Gradient className='deck_container-preview'>

        {cardPreview ? (
            <div className='card_preview'>
                <h3>{cardPreview.name}</h3>
                <img className='card' src={cardPreview.image_uris?.normal || "https://via.placeholder.com/300"} alt={cardPreview.name} />
                <p>{cardPreview.type_line}</p>
                {/* <p>{cardPreview.oracle_text}</p> */}

            </div>
        ) : (
            <p>Hover over a card to see details</p>
        )}
    </Gradient>

    <Gradient className='deck_container-stats'>
        <div className='mana_symbols-stats'>
            {MANA_TYPES.map(m => (
                <span key={m} className={`mana_symbol ${deckMetrics.colors.has(m)? 'active': 'inactive'}`}>
                    <i className={`ms ms-${m.toLowerCase()} ms-cost ms-span`} /> {deckMetrics.mana[m]}
                </span>
            ))}
        </div>
        <div  className='stats_header'>
            <h3>statistics</h3>
            <span>{format}</span>
        </div>
        <div className='type_count'>
        {Object.entries(deckMetrics.counts).map(([type,count])=>(
            count > 0 && <p key={type}>{type.charAt(0).toUpperCase() + type.slice(1)}:{count}</p>
        ))}
        </div>
    </Gradient>        
                    
                    
</div>
 
    )
}

export default DeckDetail