import React, {useState,useMemo,useEffect, use} from 'react'
import '../styles/CardDetail.css';
import { data } from 'react-router-dom';
import { set } from 'mongoose';
import Gradient from "../modules/Gradient"

function DeckDetail({cards =[], isOwner,name, onCardClick,OnDeleteCard,format}) {
    
    const [sortBy, setSortBy] = useState('none');
    const [cardPreview, setCardPreview] = useState(null);
    const [decksTokens, setDecksTokens] = useState([]);
    const Mana_Colors = {
        "W": "White",       
        "U": "Blue",
        "B": "Black",
        "R": "Red",
        "G": "Green",
        "C": "Colorless"
    };
    const sortedCards = useMemo(()=>{
        let list = cards ? cards.filter(entry => entry && entry.cardId): [];
    // add a commit for a push 
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


    const [tokenImg,setTokenImg] = useState(null);
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


    
    
    
    
    
    const stats = useMemo(()=>{
        const counts = {
            format:[],
            total: 0,
            creature: 0,
            planeswalker: 0,
            instant: 0,
            sorcery: 0,
            enchantment: 0,
            artifact: 0,
            land: 0,
        };
        cards.forEach(entry => {
            if(entry?.cardId) {
                const type = entry.cardId.type_line.toLowerCase();
                const qty = entry.quantity || 1;
                counts.total += qty;
                if(type.includes("format")) counts.format = type;
                else if(type.includes("creature")) counts.creature += qty;
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
    const fetchRelatedTokens = async () => {
        
        if(!sortedCards || Object.keys(sortedCards).length === 0) return;
        
        const allEntries = Object.values(sortedCards).flat();
        
       const uniqueNames = [...new Set(allEntries.map(e => e.cardId?.name).filter(Boolean))]
       if(uniqueNames.length === 0) return;

  
    try{
        const chunkSize = 75;
        const chunks = [];
        for(let i = 0; i < uniqueNames.length; i+= chunkSize) {
            chunks.push(uniqueNames.slice(i,i + chunkSize));
        }

        let fullCards = [];
        for (const chunk of chunks){
            const res = await fetch("https://api.scryfall.com/cards/collection",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body:JSON.stringify({identifiers:chunk.map(name=> ({ name }))
                })
            });
            const data = await res.json();
            if(data.data) fullCards = [...fullCards,...data.data];
            await new Promise(resolve => setTimeout(resolve,100));
        }
        const tokenIds = new Set();
        const fallbackKeywords = new Set();
        
        fullCards.forEach(card =>{
            if (card.all_parts) {
                card.all_parts.forEach(part => {
                    if(["token","emblem"].includes(part.component)) tokenIds.add(part.id);
                });
            }
            const text = card.oracle_text?.toLowerCase() || "";
           if(text.includes("emblem")){
            fallbackKeywords.add(card.name);
           }
           if(text.includes("create") && text.includes("zombie")){
            fallbackKeywords.add("Zombie");
           }
        });

        let finalTokens = [];
         
        if(tokenIds.size > 0) {
            const tokenRes = await fetch("https://api.scryfall.com/cards/collection",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({identifiers: Array.from(tokenIds).map(id => ({ id })) })
            });
            const tokenData = await tokenRes.json();
            if(tokenData.data) finalTokens = [...tokenData.data];
        }
        // this is a generic search if nothing is found
        if(finalTokens.length === 0 && fallbackKeywords.size > 0) {
            const nameQuery = Array.from(fallbackKeywords).map(n => `(t:emblem "${n}") OR(t: token name: "${n}")`).join(" OR ");
            const searchRes = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(nameQuery)}&unique=cards`);
            const searchData = await searchRes.json();
            if(searchData.data) {
                const existingIds = new Set(finalTokens.map(t => t.id));
                const newTokens = searchData.data.filter( t=> !existingIds.has(t.id));
                
                finalTokens = [...finalTokens, ...newTokens]};
        }
        setDecksTokens(finalTokens);
    }catch (err) {
        console.error("Error fetching tokens:",err);
        setDecksTokens([]);
        }
    };
    fetchRelatedTokens();
   
},[sortedCards])

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



    return (
        <div className="full_deck">
     
    <Gradient className='deck_container'>
        <div className='deck_header'>{name}</div>
            <div className="sort_controls">
                <button className='buttons' onClick={()=>{setSortBy('type');}}>Type</button>
                <button className='buttons' onClick={()=>setSortBy('cmc')}>Mana </button>
                <button className='buttons' onClick={()=>setSortBy('none')}>Reset</button>
            </div>

            <ul className='list'>
                {Object.entries(sortedCards).map(([category, entries])=>(
                    <Gradient className={`sort_order ${category.replaceAll(" ","")}`}>
                    <li 
                    className={`deck_list-categoryList `} 
                    key={category}
                        
                    >
                    <h3 className='deck_header-sub'>{category}({entries.reduce((sum,i) => sum +( i.quantity  ||1),0)})</h3>
                    <ul className='deck_list'>
                    {entries.map(entry =>(
                        <li 
                        key={entry._id}
                        className='card_entry'
                        onClick={()=> onCardClick(entry.cardId)}
                        onMouseEnter={()=> setCardPreview(entry.cardId)}
                        >
                            {entry.cardId.name} x {entry.quantity}
                            {console.log(entry.isCommander)} 
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
    </Gradient>

    <Gradient className="deck_container-token">
        <h3>Tokens</h3>
        <div className='tokens_container'>
            {decksTokens?.length > 0 ? decksTokens.map((token, index) => ( 
                <div key={index} className='token '>
                    <p>{token.name}</p>
                    <img className='card' src={token.image_uris?.small || token.image_uris?.normal} 
                    alt={token.name} />
                </div>
            )) : <p>No tokens in this deck</p>}
            {tokenImg && (
                <div className='card_preview'>
                    <img className='card' src
                    ={tokenImg.image_uris} alt="Token Preview" />
                </div>
            )}
        </div>
    </Gradient>

    <Gradient className='deck_container-preview'>

        {cardPreview ? (
            <div className='card_preview'>
                <h3>{cardPreview.name}</h3>
                <img className='card' src={cardPreview.image_uris?.small || "https://via.placeholder.com/300"} alt={cardPreview.name} />
                <p>{cardPreview.type_line}</p>
                <p>{cardPreview.oracle_text}</p>

            </div>
        ) : (
            <p>Hover over a card to see details</p>
        )}
    </Gradient>

    <Gradient className='deck_container-stats'>

                {Object.keys(Mana_Colors).map((mana)=>{
            const isActive = activeColors.has(mana);
            return (<span 
            key={mana} 
            className={`mana_symbol ${isActive ? 'active' : 'inactive'}`}
            >
            <i className={`ms ms-${mana.toLowerCase()} ms-cost ms-2x`}/>
            </span>
            )
        })}
            <h3>Deck Statistics</h3>
            <p>Deck Format: {format}</p>
            <p>Total Cards: {stats.total}</p>
            <p>Creatures: {stats.creature}</p>
            <p>Planeswalkers: {stats.planeswalker}</p>
            <p>Instants: {stats.instant}</p>
            <p>Sorceries: {stats.sorcery}</p>
            <p>Enchantments: {stats.enchantment}</p>
            <p>Artifacts: {stats.artifact}</p>
            <p>Lands: {stats.land}</p>
    </Gradient>

</div>
 
    )
}

export default DeckDetail