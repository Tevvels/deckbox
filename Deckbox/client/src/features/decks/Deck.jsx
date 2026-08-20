import React from 'react'
import useTokens from '../modules/Tokens'
import DeckDetailPage from '../DeckDetail';
function Deck({deck, setDeck, cards, name}) {
    
    const { deckId} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [sortBy, setSortBy] = useState("none");
    const [deckData, setDeckData] = useState(null);
    const [cardPreview, setCardPreview] = useState(null);
    const [allprints, setAllPrints] = useState([]);
    const [currentImage,setCurrentImage] = useState(card);
    const navigate = useNavigate();



const commanderEntry = deck?.cards?.find(
    (entry) =>
        entry.isCommander ||
        entry?.cardId?.type_line?.includes("legendary Creature"),
);
const colorIdentity =
    commanderEntry?.cardId?.color_identity?.join("").toLowerCase() || "";

// Function to delete the deck, with a confirmation prompt and API call to delete the deck from the server. If successful, it navigates back to the user's decks page.

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



  return (
    <main>
        <DeckDetail
            deck={deckData}
            deckMetrics={deckMetrics}
            cardPreview={cardPreview}
            setCardPreview={setCardPreview}
            onCardClick={(card) => {setSelectedCard(card);}}
            onDeleteDeck={deleteDeck}
            isOwner={isOwner}
        />
    </main>
  )
}
}
export default Deck