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
        <section className="view-page decklist">
            <div className='sort_controls'>
                <span className="control_label">
                    Group By:
                </span>
                {["type","none"].map((s)=>(
                    <button key={s} onClick={()=> setSortBy(s)} className={`buttons ${sortBy === s? "active_sort":""}`}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                ))}
            </div>
            <div className="control_group">
                <span className="control_label"> Sort By:</span>
                {["name","cmc","value"].map((s)=>(
                    <button key={s} onClick={()=> setSubSortBy(s)} className={`buttons ${subSortBy === s ?"active _sort":""}`}>
                        {s.toUpperCase()}
                    </button>
                ))}
            </div>
                <button className="buttons button_imageToggle" onClick={()=> setWithImage(!withImage)}>
                    {withImage? "Name list":"Image list"}
                </button>
            <ul className={`deck_list ${sortBy}`}>
                {Object.entries(sortedCards).map(([category,entries])=>(
                    <li key={category} className="deck_list-item">
                        <h3 className="deck_header-sub">{category} ({entries.reduce((sum,i)=> sum +(i.quantity || 1),0)})</h3>
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
                                {console.log("line 61:",cardPreview)}
                            {
                                withImage? (
                                    <img className="card card_entry-image" src ={entry.cardId.image_uris?.normal || entry.cardId.card_faces?.[0]?.image_uris?.normal} alt={entry.cardId.name} />
                                ) :(
                                    <h3>{entry.cardId.name}</h3>
                                )
                            }
                            {!withImage && !isLand &&(
                                <div className="mana_cost_container">
                                {symbols.length > 0? symbols.map((s,i)=>{
                                    const sym = s.replace("{","").replace("}","");
                                    return (
                                        <span key={i} className={`mana_symbol ${manaTypes.includes(sym) ? "active":"inactive"}`}>
                                        <i className={`ms ms-${sym.toLowerCase()} ms-cost ms-span`} />
                                        </span>
                                    );
                                }):
                                <span className="mana_symbol inactive">
                                <i className='ms ms-c ms-cost ms-span'/>
                            </span>}</div>
                            )}
                            <span className="card_quantity">X{entry.quantity}</span>
                            {isOwner && (
                                <button className="buttons buttons_delete" onClick={(e)=>{e.stopPropagation(); onDeleteCard(entry._id || entry.cardId.id);}}>X</button>
                            )}
                            </li>
                        );
                    })}
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
