import React from 'react'

// Function to get the card image based on the available data

const getCardImage = (card, size = "small") => {
  if (card.image_uris) {
    return card.image_uris[size];
  }
  if(card.card_faces && card.card_faces[0].image_uris) {
    return card.card_faces[0].image_uris[size];
  }
  return "https://placeholod.co";
};

function Card({currentImage,Allprints,onSelectPrint,OnUpdateArt,onClose}) {
  return (
    <div>
        <button onClick={OnUpdateArt}>Update Art</button>
        <button onClick={onClose}>Close</button>
        <h1>{currentImage.name}</h1>
        <p>{currentImage.oracle_text}</p>
        <p>{currentImage.type_line}</p>
        {Allprints.map((print) => (
            <img 
                key={print.id}
                src={print.image_uris?.small || print.card_faces?.[0]?.image_uris?.small}
                alt={print.name}
                onClick={() => onSelectPrint(print)}
            />
            
        ))}        

    </div>
  )
}

export default Card