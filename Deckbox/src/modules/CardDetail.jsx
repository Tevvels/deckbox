
import React, { useEffect,useState } from 'react'
// have it so when I click on the card it goes to this page with more details
// import Card from '../data/Card.json'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';


function CardDetail({card,onClose,onUpdateSuccess}) {
  const [AllPrints, setAllPrints] = useState([]);
  const [currentImage, setCurrentImage] = useState(card);
  
  
  const handleUpdateArt = async()=>{
    try{
      const response = await fetch(`${API_BASE}/cardStorage/update-art/${card._id}`,{
        method:'PATCH',
        headers:{
          'Content-Type':'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          scryfallId: currentImage.id,
          image_uris: currentImage.image_uris,
        }),
    })
    if(response.ok){
      onUpdateSuccess(card._id,{
        scryfallId: currentImage.id,
        image_uris: currentImage.image_uris,

    });
      onClose();
  
    }
    } catch (err){
      console.error('Error updating card art:', err);
    }
  };
useEffect(() => {
  if(card && card.name){
    setCurrentImage(card);
    setAllPrints([]); // Reset before fetching new prints

  
    const query = `!"${card.name}"`;
    const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&unique=prints`;
    fetch(url)
    .then(response => {
    if(!response.ok)
      throw new Error ('Network response was not ok');  
      return response.json();
    }).then(data => {
      if(data.data){  
        setAllPrints(data.data);
      }
    }).catch(error => {
      console.error('Error fetching card prints:', error);setAllPrints([]);
    })
  }
}, [card]);
// console.log("Current Image in CardDetail:", currentImage);
// console.log("All Prints in CardDetail:", AllPrints);
if(!card || !currentImage) return null;
  return (

      
<div className="card-detail-modal">
  <button onClick={handleUpdateArt}>Update Card Art</button>

      <div className="close-button" onClick={onClose}>X</div>
        
        {/* card detail includes name, oracle text, selection for images */}

        <h1>{currentImage?.name}</h1>
        <p>{currentImage?.oracle_text}</p>
        <div>
          {AllPrints.length > 0 ? (AllPrints.map((print) => (
            <img 
              key={print.id} 
              src={print.image_uris ? print.image_uris.small : ''} 
              alt={print.name}  
              style={{border: print.id === currentImage.id ? '2px solid blue' : '1px solid gray', cursor: 'pointer', margin: '5px'}}
              onClick={() => setCurrentImage(print)}
            />
          ))
         ) : (
            <p>No other prints available.</p>
          )
              }
        </div>
    </div>
  );
}

export default CardDetail