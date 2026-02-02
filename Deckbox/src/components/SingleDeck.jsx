import React, { useEffect, useState } from 'react'
import { Link, useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import CardDetail from '../modules/CardDetail';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
import '../styles/SingleDeck.css';
function SingleDeck({deck,setDeck}) {
    const {deckId} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOwner,setIsOwner] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const navigate = useNavigate();
  
  
    const deleteDeck = async (idtowait) => {
        if(!window.confirm("are you sure you want to delete this deck?")) return;
  const token = localStorage.getItem('userToken');
  try {
    await axios.delete(`${API_BASE}/cardStorage/${idtowait}`, {
      headers: { 
        Authorization: `Bearer ${token}`
      }
    });
    navigate('/mydecks')
  }
  catch (err) {
    console.error('Error deleting deck:', err);
  }
};


    useEffect(()=>{
  
        const loadDeckData = async()=>{
            setIsLoading(true);
            setIsOwner(false);
            setError(null)
            const token = localStorage.getItem('userToken');
            const currentUser = JSON.parse(localStorage.getItem('user'));
                let data = null;
        
            try{
                console.log(data)
                if(token){
                    try{
                    const privRes = await fetch(`${API_BASE}/cardStorage/${deckId}`,{
                        headers:{'Authorization': `Bearer ${token}`}
                    });
                    if(privRes.ok){
                        data = await privRes.json();
                        setIsOwner(true);
                    }
                    {console.log(`"data.user" ${data.user}`)}

                } catch(e){
                    console.error("Error fetching private deck:", e);
                }
            }

                if(!data){
                    const pubRes = await fetch(`${API_BASE}/cardStorage/public/${deckId}`);

                if(!pubRes.ok) throw new Error('Not Found');
                data = await pubRes.json();
                
                if(currentUser && data.user){
                    const deckUserId = data.user._id || data.user
              
                    if(deckUserId.toString() === currentUser._id.toString()){

                    setIsOwner(true);
                    }
                }
            }
            setDeck(data);
            }catch (err){
                console.error(err);
                setError(err.message);
                setDeck(null);
            } finally {
                setIsLoading(false);
            }

        };
        loadDeckData();
    },[deckId, setDeck]);



const handleDeleteClick = async(entryId) =>{
        if(!isOwner || !entryId) return;


    try{
        const token = localStorage.getItem('userToken');
        const response = await axios.delete(`${API_BASE}/cardStorage/${deckId}/remove-card-instance`,
 
            {
            headers: {
                Authorization:`Bearer ${token}`
            },
            data:{
                cardId:entryId
            }

        });
        setDeck(response.data.deck);
        console.log("Card deleted successfully")

    } catch (err) {
        console.error("Error deleting card", err.response ?err.response: err.message);
    }
}


//end of handleDeleteClick

const handleCardClick = (card) =>{
    setSelectedCard(card);
};
const handleCloseDetail = () =>{
    setSelectedCard(null);
}

const handleUpdateCardArt = (cardId,newCardData) => {
    setDeck((prevDeck) =>({
        ...prevDeck,
        cards: prevDeck.cards.map((deckEntry) => {
            if (deckEntry.cardId && deckEntry.cardId._id === cardId) {
                return {
       
                    ...deckEntry,
                    cardId: {  
                        ...deckEntry.cardId,
                        scryfallId: newCardData.scryfallId,
                        image_uris: newCardData.image_uris,
                    }
                };
            }
            return deckEntry;
        })
    }));
};

            

    

if(isLoading) return <p> loading deck details... </p>
if(error) return <p> Error loading deck: {error} </p>
if(!deck) return <p>Deck not found</p>

    return (
    <div className="SingleDeck_Container">
        {isOwner &&(
            <div>
                <div>Add a card</div>

                <Link to={`/deck/${deckId}/search`} state={{fromDeck:true ,isCommander: deck.format ==='commander'}}> + card </Link>
            </div>
        )}
        {/* {console.log("Rendering SingleDeck with deck:", deck)} */}
        <CardDetail card={selectedCard} onClose={handleCloseDetail}  onUpdateSuccess={handleUpdateCardArt}/>
        {deck ? (
            <div>
                <h2>{deck.title || deck.name}</h2>
                <p>{deck.description}</p>
                <ul>
                    {deck.cards && deck.cards.map((deckEntry, index) => {
                      if(!deckEntry.cardId) return null;
                      const colors = (deckEntry.cardId.color_identity && deckEntry.cardId.color_identity.length > 0) ? deckEntry.cardId.color_identity : [];
                        // console.log("Card colors:", colors);  
                      return (
                      <li className='SingleDeck_Container-Card' key={deckEntry.cardId._id || index}>
                <div className='SingleDeck_Container-Card ' onClick={()=>handleCardClick(deckEntry.cardId)} style={{cursor:'pointer'}}>

                           <span> {deckEntry.cardId.name} </span>
                           <span> - Quantity: {deckEntry.quantity} </span>
                            <span> - color identity {deckEntry.cardId.color_identity}</span>
                           <span> {deckEntry.cardId.image_uris && <img className="SingleDeck_Container-Card-Img" src={deckEntry.cardId.image_uris.small} alt={deckEntry.cardId.name} />} </span> 
                           <div className="card-colors">
                           {
                            colors.map((color, idx) => (
                                <span key={idx} className={`color-circle ${color.toLowerCase()}`} title={color}></span>
                            ))
                           }
                           </div>
                           </div>
                           {isOwner &&(
                           <div>

                                <button onClick={()=> deleteDeck(deck._id)}>delete deck</button>
                               <button onClick={() => handleDeleteClick(deckEntry.cardId._id)}>Remove Card</button>
                           </div> 
                           )}
                        </li>
                        
                    )})}
                   </ul>

            </div>
        ) : (
            <p>Loading deck...</p>
        )}  
            <Link to="/publicdecks">Back to Public Decks</Link>
          
        {isOwner && <Link to="/mydecks"> Back to My Decks </Link>}
 
    </div>
  )
}

export default SingleDeck