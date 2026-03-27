import React, { useEffect, useState } from 'react'
import { Link, useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import CardDetail from '../modules/CardDetail';
import DeckDetail from './DeckDetail';
import DeckCard from './DeckCard';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const AddCardButton = ({ deckId,isCommander,colorIdentity}) =>(
    <div className='add_card'>
        <h3 className='add_card-header'>Add a card</h3>
        <Link 
        to={`/deck/${deckId}/search`}
        className='links deck_link deck_addCard-link'
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
    const commanderEntry = deck?.cards?.find(entry => entry.isCommander || entry?.cardId?.type_line?.includes("legendary Creature"));
    const colorIdentity = commanderEntry?.cardId?.color_identity?.join("").toLowerCase() || "";
  
  
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
            console.log(data)
        };
        loadDeckData();
    },[deckId, setDeck]);

const handleDeleteClick = async(entryId) =>{
        if(!isOwner || !entryId) return;
    console.log(`entry ID${entryId}`);
    console.log(deckId)
    console.log("Path:", `${API_BASE}/cardStorage/${deckId}/remove-card-instance`);

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
  


    <div className="deck">
        {console.log(deck)}
        {isOwner && (
            <AddCardButton
            deckId={deckId}
            isCommander={deck.format === 'commander'}
            />
        )}
        <DeckDetail
    // add a commit 
        cards={deck.cards}
        name={deck.name}
        isOwner={isOwner}
        format={deck.format}
        onCardClick={handleCardClick}
        onDeleteDeck={()=> deleteDeck(deck._id)}
        OnDeleteCard={handleDeleteClick}
        >

            
        </DeckDetail>
        {selectedCard && (
            <CardDetail
            card={selectedCard}
            onClose={handleCloseDetail}
            onUpdateSuccess={handleUpdateCardArt}
            />
        )} 
    </div>
)
}

export default SingleDeck