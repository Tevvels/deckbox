import React,{useState} from 'react';
import CardDetail from '../../modules/CardDetail';


export default function DeckList({
    sortedCards,
    sortBy,
    setSortBy,
    subSortBy,
    setSubSortBy,
    isOwner,
    onCardClick,
    setCardPreview,
    onDeleteCard,
    cardPreview,
    manaTypes,


}) {
    const [withImage,setWithImage] = useState(false);
    

  return (
    <>
        <section className="deck-decklist">
            <div className="control_group">
                <span className="control_label">
                    Group By:
                </span>
                {["type","Alphabet"].map((s)=>(
                    <button key={s} onClick={()=> setSortBy(s)} className={`buttons ${sortBy === s? "active_sort":""}`}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                ))}
            
            
                <span className="control_label"> Sort By:</span>
                {["name","cmc","value"].map((s)=>(
                    <button key={s} onClick={()=> setSubSortBy(s)} className={`buttons ${subSortBy === s ?"active_sort":""}`}>
                        {s.toUpperCase()}
                    </button>
                ))}
                <button className="buttons button_imageToggle" onClick={()=> setWithImage(!withImage)}>
                    {withImage? "Name list":"Image list"}
                </button>
            </div>
            <ul className={`decklist ${sortBy}`}>
                {Object.entries(sortedCards).map(([category,entries])=>(
                    
                    <li key={category} className="decklist-item">
                    
                        <h3 className="decklist-category-header">{entries.reduce((sum,i)=> sum +(i.quantity || 1),0) <= 1 ? category:`${category}s`} ({entries.reduce((sum,i)=> sum +(i.quantity || 1),0)})</h3>
                     <ul className={`decklist-category ${withImage? "withImage":"noImage"}`}>
                    {entries.map((entry)=>{
                        const isLand = entry.cardId.type_line?.toLowerCase().includes("land");
                        const symbols = entry.cardId.mana_cost?.match(/\{([^}]+)\}/g)|| [];
                        return (

                            <li key={entry._id}
                            className="card_list-item"
                            onClick={()=>{
                                setCardPreview(entry.cardId);
                                if(onCardClick) onCardClick(entry.cardId);
                            }}
                            >
                             {/* image display */}
                            {withImage? (
                                    <img className="card card_entry-image" src= {entry.cardId.image_uris?.normal || entry.cardId.card_faces?.[0]?.image_uris?.normal} alt={entry.cardId.name} />
                                ) : (
                                    <h3>{entry.cardId.name}</h3>
                                )
                            }


                            {/* text display */}
                            <div className="card_list-item-text">

                            {!isLand &&(
                                <div className="mana_cost_container">
                                {symbols.length > 0? symbols.map((s,i)=>{
                                    const sym = s.replace(/[{}/]/g,"").replace("}","").toLowerCase();
                                    return (
                                        <span key={i} className={`mana_symbol }`}>
                                        <i className={`ms ms-${sym} ms-cost ms-span`} />
                                        </span>
                                    );
                                }):
                                <span className="mana_symbol inactive">
                                    <i className='ms ms-c ms-cost ms-span'/>
                                </span>}
                            </div>
                            )}
                           {entry.quantity > 0 ? <span className="card_quantity"> x{entry.quantity}</span>:""}
                            {isOwner && (
                                <button className="buttons buttons_delete" onClick={(e)=>{e.stopPropagation(); onDeleteCard(entry._id || entry.cardId.id);}}>X</button>
                            )}
                            </div>
                            </li>
                        );
                    })}
                    </ul>
                    </li>
                ))}
                </ul>
                <div className={"decklist-preview-column"}>
                    {cardPreview? (
                        <div className="card_preview">
                            <CardDetail card={cardPreview} />
                            <button onClick={()=>setCardPreview(null)}>Close</button>
                        </div>
                    ):(
                        ""
                    )}
                </div>
        </section>
    </>
  )
}
