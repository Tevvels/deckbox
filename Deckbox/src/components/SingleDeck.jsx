import React, { useEffect, useState } from 'react'
import { Link, useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import CardDetail from '../modules/CardDetail';
import DeckDetail from './DeckDetail';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const AddCardButton = ({ deckId,isCommander}) =>(
    <div className='deck_container-sub deck_container-ownerCheck'>
        <div className='deck_header deck_addCard-header'>Add a card</div>
        <Link className='links deck_link deck_addCard-link'
        state={{ fromDeck:"true", isCommander}}
        >
            + card
        </Link>
    </div>
)


function SingleDeck({deck,setDeck}) {
    const {deckId} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOwner,setIsOwner] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [sortBy,setSortBy] = useState('none');
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
                if(token){
                    try{
                    const privRes = await fetch(`${API_BASE}/cardStorage/${deckId}`,{
                        headers:{'Authorization': `Bearer ${token}`}
                    });
                    if(privRes.ok){
                        data = await privRes.json();
                        setIsOwner(true);
                    }

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

            

    

if(isLoading) return <p className='loading'> loading deck details... </p>
if(error) return <p className='loading loading_error'> Error loading deck: {error} </p>
if(!deck) return <p className='loading loadinga_notFound'>Deck not found</p>

    return (
    // <div className="deck deck_container">
    //     {isOwner &&(
    //         <div className='deck_container-sub deck_container-ownerCheck'>
    //             <div className='deck_header deck_addCard-header'>Add a card</div>

    //             <Link className='links deck_link deck_addCard-link' to={`/deck/${deckId}/search`} state={{fromDeck:true ,isCommander: deck.format ==='commander'}}> + card </Link>
    //         </div>
    //     )}
    //     {/* {console.log("Rendering SingleDeck with deck:", deck)} */}
    //     <CardDetail card={selectedCard} onClose={handleCloseDetail}  onUpdateSuccess={handleUpdateCardArt}/>
    //     {deck ? (
    //         <div className='deck_container-sub'>
    //             <h2 className='deck_title'>{deck.title || deck.name}</h2>
    //             <p className='deck_desc' >{deck.description}</p>
    //             <ul className='lists deck_list'>
    //                 {/* the map that get the color identity of our commander, then displays those here in a background gradient */}
    //                 {deck.cards && deck.cards.map((deckEntry, index) => {
    //                   if(!deckEntry.cardId) return null;
    //                   const colors = (deckEntry.cardId.color_identity && deckEntry.cardId.color_identity.length > 0) ? deckEntry.cardId.color_identity : [];
    //                   return (
    //                   <li className='listItem deck_listItem' key={deckEntry.cardId._id || index}>
    //             <div className='deck_card deck_card-button' onClick={()=>handleCardClick(deckEntry.cardId)} style={{cursor:'pointer'}}>

    //                        <span className='spans deck_card-name'> {deckEntry.cardId.name} </span>
    //                        <span className='spans deck_card-count'> - Quantity: {deckEntry.quantity} </span>
    //                         <span className='spans deck_card-colorId'> - color identity {deckEntry.cardId.color_identity}</span>
    //                        <span className='spans deck_card-img-container'> {deckEntry.cardId.image_uris && <img className='card deck_card-img' src={deckEntry.cardId.image_uris.small} alt={deckEntry.cardId.name} />} </span> 
    //                        <div className="deck_container-sub deck_container-color">
    //                        {
    //                         colors.map((color, idx) => (
    //                             <span key={idx} className={`spans deck_card-color-circle color-circle ${color.toLowerCase()}`} title={color}></span>
    //                         ))
    //                        }
    //                        </div>
    //                        </div>
    //                        {isOwner &&(
    //                        <div className='deck_container-sub deck_container-ownerCheck'>

    //                             <button className='buttons deck_button deck_button-delete-deck' onClick={()=> deleteDeck(deck._id)}>delete deck</button>
    //                            <button className='buttons deck_button deck_button-delete-card' onClick={() => handleDeleteClick(deckEntry.cardId._id)}>Remove Card</button>
    //                        </div> 
    //                        )}
    //                     </li>
                        
    //                 )})}
    //                </ul>

    //         </div>
    //     ) : (
    //         <p className='loading'>Loading deck...</p>
    //     )}  
    //         <Link className='links deck_link' to="/publicdecks">Back to Public Decks</Link>
          
    //     {isOwner && <Link  className='links deck_link' to="/mydecks"> Back to My Decks </Link>}
 
    // </div>

    


    <div className="deck deck_container">
        {isOwner && <AddCardButton deckId={deckId} isCommander={deck?.format === "commander"} />}


        <CardDetail
        card={selectedCard}
        onClose={handleCloseDetail}
        onUpdateSuccess={handleUpdateCardArt}
        />
        {
            deck? (
                <div className='deck_conatainer-sub'>
                    <h2 className='deck_title'>{deck.title}</h2>
                    <DeckDetail
                    cards={deck.cards ||[]}
                    sortBy={sortBy}
                    isOwner={isOwner}
                    setSoryBy={setSortBy}
                    onCardClick={handleCardClick}
                    onDeleteCard={handleCardClick}
                    />
                    </div>
            ) : <p>loading ...</p>}
            </div>
)
}

export default SingleDeck