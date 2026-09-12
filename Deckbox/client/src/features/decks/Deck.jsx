import React,{useState,useEffect,useMemo} from 'react'
import { useParams,useNavigate,Link } from 'react-router-dom';
import axios from 'axios';

import { useFetchDeck } from '../../hooks/useFetchDeck';
import { useDeckMetrics } from '../../hooks/useDeckMetrics';
import { useDeckActions } from '../../hooks/useDeckActions';
import DeckDetail from './DeckDetail';


const AddCard = ({deckId, isCommander,text}) =>(
    <div className="add-card">
        <Link to={`/deck/${deckId}/search`}
        className="links deck-link deck-add-card-link"
        state={{fromDeck:true,isCommander}}>
            {text}

        </Link>
    </div>
);


function Deck({deck, setDeck, cards, name}) {
    
    const { deckId} = useParams();
    const navigate = useNavigate();

    //core states
    const [selectedCard, setSelectedCard] = useState(null);
    const [cardPreview, setCardPreview] = useState(null);
    const [currentImage,setCurrentImage] = useState(null);

    
    const {isLoading,error,isOwner} = useFetchDeck(deckId,setDeck);
    
    const deckMetrics = useDeckMetrics(deck?.cards || cards || []);



const {deleteDeck,handleDeleteCardInstance,handleUpdateArt} =
    useDeckActions(deckId,setDeck,navigate,isOwner);


const handleCardClick = (card) => {
    setSelectedCard(card);
    setCurrentImage(card);
}


if(isLoading) return <div>loading deck data</div>
if(error) return <div>Error: {error}</div>


  return (
    <main className="deck">

        {isOwner && deck && (
            <AddCard
                deckId={deckId}
                isCommander={deck.format ==="commander"}
                text="Add Card"
                />
        )}
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
            onDeleteCard={handleDeleteCardInstance}
            onDeleteDeck={()=>deleteDeck(deck._id)}
            isOwner={isOwner}
        />
        ):(<div>no deck</div>)}
    </main>
  )
}

export default Deck