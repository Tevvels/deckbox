import React, {useState,useMemo,useEffect, use} from 'react'
import '../styles/CardDetail.css';

function DeckDetail({cards =[], isOwner,name, onCardClick,OnDeleteCard}) {
 

const [sortBy, setSortBy] = useState('none');
const [cardPreview, setCardPreview] = useState(null);
const Mana_Colors = {
    "W": "White",
    "U": "Blue",
    "B": "Black",
    "R": "Red",
    "G": "Green",
    "C": "Colorless"
};
const activeColors = useMemo(()=>{
    const colors = new Set();
    cards.forEach(entry => {
        if(entry.cardId?.color_identity) {
            entry.cardId.color_identity.forEach(color => colors.add(color));
        }
    });
    if(colors.size === 0) colors.add("C");
    return colors;
},[cards]);


 

const sortedCards = useMemo(()=>{
    let list = cards ? cards.filter(entry => entry && entry.cardId): [];

        list.sort((a,b)=> a.cardId.name.localeCompare(b.cardId.name));

    const groups = {};
if(sortBy === "type") {
    list.forEach(entry => {
        const type = entry.cardId.type_line.toLowerCase();
    let category = "other";
    if(type.includes("creature")) category = "creature";
    else if(type.includes("planeswalker")) category = "planeswalker";
    else if(type.includes("instant")) category = "instant";
    else if(type.includes("sorcery")) category = "sorcery";
    else if(type.includes("enchantment")) category = "enchantment";
    else if(type.includes("artifact")) category = "artifact";
    else if(type.includes("land")) category = "land";
    if(!groups[category]) groups[category] = [];
    groups[category].push(entry);
});
}  else if(sortBy === "cmc") {
    list.forEach(entry => {
        const category = `Mana Value ${entry.cardId.cmc || 0 }`;
        if(!groups[category]) groups[category] = [];
        groups[category].push(entry);
    });
}
else {
    groups["All Cards"] = list;
}
return groups;
},[cards,sortBy]);

const stats = useMemo(()=>{
    const counts = {
        total: 0,
        creature: 0,
        planeswalker: 0,
        instant: 0,
        sorcery: 0,
        enchantment: 0,
        artifact: 0,
        land: 0,
        other: 0
    };
    cards.forEach(entry => {
        if(entry?.cardId) {
            const type = entry.cardId.type_line.toLowerCase();
            const qty = entry.quantity || 1;
            counts.total += qty;
            if(type.includes("creature")) counts.creature += qty;
            else if(type.includes("planeswalker")) counts.planeswalker += qty;
            else if(type.includes("instant")) counts.instant += qty;
            else if(type.includes("sorcery")) counts.sorcery += qty;
            else if(type.includes("enchantment")) counts.enchantment += qty;
            else if(type.includes("artifact")) counts.artifact += qty;
            else if(type.includes("land")) counts.land += qty;
            else counts.other += qty;

        }
    });



        return counts;
    

 },[cards]);


 useEffect(()=>{
    if(cards.length > 0 && !cardPreview) {
        const commanderEntry = cards.find(entry => entry.cardId?.name === name);
        if(commanderEntry) {
            setCardPreview(commanderEntry.cardId);
        } else if(cards[0].cardId) {
            setCardPreview(cards[0].cardId);
        }
    }
 }, [cards,name, cardPreview]);


const tokens = useMemo(()=>{
    const tokenMap = new Map();
    cards.forEach(entry => {
        if(entry.cardId?.all_parts) {
            entry.cardId.all_parts.forEach(part => {
                if(part.component === "token"|| part.component === "combo") {
                    if(!tokenMap.has(part.id)) {
                    tokenMap.set(part.id, {
                        name:part.name,
                        image: `https://api.scryfall.com/cards/${part.id}?format=image&version=normal`
                    }
                    );
                    }
                }
            });
        }
    });
    return Array.from(tokenMap.values());
}, [cards]);


    return (
        <>

      
        
    <div className='deck_container'>
        <div className='deck_header'>{name}</div>
            <div className="sort_controls">
                <button className='buttons' onClick={()=>{setSortBy('type');}}>Type</button>
                <button className='buttons' onClick={()=>setSortBy('cmc')}>Mana </button>
                <button className='buttons' onClick={()=>setSortBy('none')}>Reset</button>
            </div>

            <ul className='list deck_list'>
{Object.entries(sortedCards).map(([category, entries])=>(
    <li className='deck_list-categoryList' key={category}>
        <h3 className='deck_header-sub'>{category}({entries.reduce((sum,i) => sum +(i.quantity  ||1),0)})</h3>
        <ul className='list deck_list'>
            {entries.map(entry =>(
                <li 
                key={entry._id}
                className='card_entry'
                onClick={()=> onCardClick(entry.cardId)}
                onMouseEnter={()=> setCardPreview(entry.cardId)}
                // onMouseLeave={()=> setCardPreview(null)}
                >
                    {entry.quantity}x {entry.cardId.name} 
                    {isOwner && (
                        <button 
                        className='buttons buttons_delete'
                        onClick={(e)=>{e.stopPropagation(); OnDeleteCard(entry._id)}
                        }                        >X</button>
                    )}
                </li>
            ))}
            </ul>
        </li>
    ))}
     </ul>
    </div>
    <div className="tokens_preview">
        <h3>Tokens</h3>
        <div className='tokens_container'>
            {tokens.length > 0 ? tokens.map((token, index) => ( 
                <div key={index} className='token'>
                    <p>{token.name}</p>
                    <img src={token.image} alt={token.name} />
                </div>
            )) : <p>No tokens in this deck</p>}
        </div>
    </div>
    <div className='card_preview'>
        {Object.keys(Mana_Colors).map((mana)=>{
            const isActive = activeColors.has(mana);
            return (<span 
key={mana} 
className={`mana_symbol ${isActive ? 'active' : 'inactive'}`}
>
<i className={`ms ms-${mana.toLowerCase()} ms-cost`}/>
</span>
            )
        })}
        {cardPreview ? (
            <div className='card-preview'>
                <h3>{cardPreview.name}</h3>
                <img className='card' src={cardPreview.image_uris?.normal || "https://via.placeholder.com/300"} alt={cardPreview.name} />
                <p>{cardPreview.type_line}</p>
                <p>{cardPreview.oracle_text}</p>
            </div>
        ) : (
            <p>Hover over a card to see details</p>
        )}
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
    </div>
</>
 
    )
}

export default DeckDetail