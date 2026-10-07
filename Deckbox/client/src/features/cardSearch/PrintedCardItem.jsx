import React from 'react'
import { useCardSearch } from '../../hooks/useCardSearch';


function PrintedCardItem({card, isSelected, quantityInDeck}){
    const {setSelectedCard,handleArtworkClick,handleAddClick} = useCardSearch()
    const handleClick = ()=>{
        setSelectedCard(card);
        if(typeof handleArtworkClick === 'function'){
            handleArtworkClick(card);
        }
    }
    const cardImageSrc = card.image_uris?.small
    || card.card_faces?.[0]?.image_uris?.small
    || "https://scryfall.com";




    return (

        <div className="search-card"
        onClick={handleClick}
        style={{position:'relative',marginRight:"10px"}}
        >
            <img
            className="card search-card-img"
            src={cardImageSrc}
            alt={card.name}
            style={{
                border: isSelected ? "3px solid blue": "1px solid grey",
                cursor:"pointer",
                width:"100px",
            }}
            />
            <img
            src={`https://svgs.scryfall.io/sets/${card.set}.svg`
}
            alt={`${card.set} logo`}
            style={{
                width:"20px",
                display:"block",
                margin: "4px auto 0"
            }} />
            {/* {isOwner && ( */}
            <button onClick={handleAddClick}>Add</button>
            {/* )} */}
            {quantityInDeck}

        </div>

    )
}


const badgeStyle = {
    position:"absolute", top:"5px",right:"5px",
    backgroundColor:"rgba(0,128,0,0.9)", color:"white",
    borderRadius:"50%",width:"24px",height:"24px",
    display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:"14px",fontWeight:"bold",
};
export default PrintedCardItem