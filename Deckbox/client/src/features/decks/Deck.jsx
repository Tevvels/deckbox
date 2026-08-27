import React,{useState,useEffect,useMemo} from 'react'
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useFetchDeck } from '../../hooks/useFetchDeck';
import { useDeckMetrics } from '../../hooks/useDeckMetrics';
import DeckDetail from './DeckDetail';
function Deck({deck, setDeck, cards, name}) {
    
    const { deckId} = useParams();
    const navigate = useNavigate();
    const [selectedCard, setSelectedCard] = useState(null);
    const [cardPreview, setCardPreview] = useState(null);
    const [currentImage,setCurrentImage] = useState(null);

    
    const {isLoading,error,isOwner} = useFetchDeck(deckId,setDeck);
    
    const deckMetrics = useDeckMetrics(deck?.cards || cards || []);





const deleteDeck = async (idtowait) => {
    if (!window.confirm("are you sure you want to delete this deck?")) return;
    const token = localStorage.getItem("token");
    try{
        await axios.delete(`${API_BASE}/cardStorage/${idtowait}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        navigate("/mydecks");
    } catch (err) {
        console.error("Error deleting deck:", err);

    }
};

// Set the initial card preview when the component mounts or when the cards or name change


const handleCardClick = (card) => {
    setSelectedCard(card);
    setCurrentImage(card);
}

const handleCloseCardDetail = () => {
    setSelectedCard(null);
    setCurrentImage(null);
}
const handleUpdateArt = (updatedCard) => {
    setDeck((prevDeck) => {
        const updatedCards = prevDeck.cards.map((entry) =>
            entry.cardId._id === updatedCard._id ? { ...entry, cardId: updatedCard } : entry
        );
        return { ...prevDeck, cards: updatedCards };
    });
    setCurrentImage(updatedCard);
    setSelectedCard(updatedCard);
}

if(isLoading) return <div>loading deck data</div>
if(error) return <div>Error: {error}</div>

  return (
    <main className="deck">
        {deck ? (
        <DeckDetail
            deck={deck}
            cards={deck.cards ||[]}
            name={deck.name || "Unnamed Deck"}
            format={deck.format || "Unknown Format"}
            deckMetrics={deckMetrics}
            cardPreview={cardPreview}
            setCardPreview={setCardPreview}
            onCardClick={(card) => {setSelectedCard(card);}}
            onDeleteDeck={deleteDeck}
            isOwner={isOwner}
        />
        ):(<div>no deck</div>)}
    </main>
  )
}

export default Deck