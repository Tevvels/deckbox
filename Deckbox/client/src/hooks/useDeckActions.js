import {useMemo} from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://localhsot:5000';
export function useDeckActions(deckId,setDeck,navigate,isOwner) {

    const deleteDeck = async(deckIdToWait)=>{

        if (!window.confirm("Are you sure you want to delete this library?")) return;
        const toekn = localStorage.getItem("token");
        try {
            await axios.delete(`${API_BASE}/cardStorage/${deckIdToWait}`,{
                headers: {Authorization: `Bearer ${token}`}
            });
            navigate("/mydecks");
        } catch(err){
            console.error("Error deleting deck",err);
        }
    };

    const handleDeleteCardInstance = async (entryId) => {
    if(!isOwner || !entryId) return;
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
            `${API_BASE}/cardstorage/${deckId}/remove-card-instance`,
            {
                headers: {Authorization: `Bearer ${token}`},
                data: {entryId},
            }
        );
    } catch(err){
        console.error('Error deleting card',err.response ? err.response : err.message);
    }
};
    const handleUpdateArt = (cardId,updatedCard) =>{
        setDeck((prevDeck)=>{
            if(!prevDeck?.cards) return prevDeck;
            const updatedCards = prevDeck.cards.map((deckEntry)=>{
                if(deckEntry.cardId && deckEntry.cardId._id === cardId){
                    return {
                        ...deckEntry,
                        cardId: {
                    scryfallId: updatedCard.scryfallId,
                    image_uris: updatedCard.image_uris,
                },
            };
        }
        return deckEntry;
            });
            return {...prevDeck, cards: updatedCards};
        });
    };

    return {
        deleteDeck,
        handleDeleteCardInstance,
        handleUpdateArt
    };
}
    