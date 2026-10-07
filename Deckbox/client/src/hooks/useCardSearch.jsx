import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// 1. Create a Global Search Context
const CardSearchContext = createContext(null);

export const CardSearchProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { deckId } = useParams();
  
  const [selectedCard, setSelectedCard] = useState(null);
  const [sameNameCard, setSameNameCard] = useState([]);
  const [deckCountMap, setDeckCountMap] = useState({});
  const [cardQuery, setCardQuery] = useState("");
  const [colorIdentity, setColorIdentity] = useState(location.state?.colorIdentity ?? null);
  const [filterByIdentity, setFilterByIdentity] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  
  const [isOwner, setIsOwner] = useState(false);
  
  const cameFromDeck = !!(location.state?.fromDeck || deckId);

  const getSafeToken = useCallback(() => {
    const rawToken = localStorage.getItem("token");
    if (!rawToken) return null;
    try {
      const parsed = JSON.parse(rawToken);
      return typeof parsed === "object" && parsed.token ? parsed.token : parsed;
    } catch (e) {
      return rawToken;
    }
  }, []);

  const handleArtworkClick = (card) => {
    setSelectedCard(card);
  };

  const handleAddClick = async () => {
    if (!isOwner) {
      alert("You do not have permission to add cards to this deck.");
      return;
    }
    if(!selectedCard) {
      alert("No card selected to add.");
      return;
    }
    console.log("color identity " + colorIdentity);
    if(colorIdentity !== null){
      console.log("Checking color identity constraints...");
      const deckColors = (colorIdentity || "")
      .toLowerCase().replace(/[^wubrg]/g,"");
      const cardColors = (selectedCard.color_identity || []).join("").toLowerCase();
      console.log(`Deck colors: ${deckColors}, Card colors: ${cardColors}`);
      const illegalColors = [...cardColors].filter(c => !deckColors.includes(c));
      console.log("Illegal colors found:", illegalColors);
      if(illegalColors.length > 0){
        alert(`Cannot add card. It contains colors not in the deck's color identity: ${illegalColors.join(", ")}`);
        return;
      }
    }

    const token = getSafeToken();
    try {
      const syncResponse = await fetch(`${API_BASE}/cardStorage/sync-card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(selectedCard),
      });
      const syncedCard = await syncResponse.json();
      const mongoId = syncedCard.mongoId;
      if (!mongoId) throw new Error("Failed to sync card with server.");

      const addRes = await fetch(`${API_BASE}/cardStorage/${deckId}/add-card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ cardId: mongoId }),
      });

      if (addRes.ok) {
        setDeckCountMap((prev) => {
          const newMap = { ...prev };
          const cardName = selectedCard.name;
          newMap[cardName] = (newMap[cardName] || 0) + 1;
          return newMap;
        });
      }
    } catch (err) {
      console.error("Error adding card to deck:", err);
    }
  };

  // 1. Fetch deck details (Color identity and ownership verification)
  useEffect(() => {
    const fetchDeckDetails = async () => {
      const token = getSafeToken();
      if (!deckId) return;
      try {
        const response = await fetch(`${API_BASE}/cardStorage/${deckId}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.color_identity && colorIdentity === null) {
  const normalized = Array.isArray(data.color_identity)
    ? data.color_identity.join("").toLowerCase()
    : String(data.color_identity).toLowerCase().replace(/[^wubrg]/g, "");

  setColorIdentity(normalized);
}
          console.log(colorIdentity, data.color_identity);
          if (data.isOwner !== undefined) {
            setIsOwner(data.isOwner);
          } else {
            // Fallback true value if backend does not pass explicit true/false check flags
            setIsOwner(true);
          }
        }
      } catch (err) {
        console.error("Error fetching deck details:", err);
      }
    };
    fetchDeckDetails();
  }, [deckId, colorIdentity, getSafeToken]);

  // 2. Fetch search suggestion autocomplete entries from Scryfall API
const fetchSuggestions = useCallback(async (query) => {
  const cleanQuery = query ? query.trim() : "";

  // Require at least 2 characters before searching
  if (cleanQuery.length < 2) {
    setSuggestions([]);
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const response = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(cleanQuery)}`
    );

    const data = await response.json();

    if (data.data) {


      const cardNames = data.data.map((card) => card.name);
      const uniqueNames = Array.from(new Set(cardNames)).slice(0, 10);
      setSuggestions(uniqueNames);
    } else {
      setSuggestions([]);
    }
  } catch (err) {
    console.error("Auto Complete Error:", err);
    setError(err);
  } finally {
    setLoading(false);
  }
}, [colorIdentity]);
const handleInputChange = (e) => {
  const value = e.target.value;
  setCardQuery(value);
  if(timeoutRef.current) clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(() => {
    fetchSuggestions(value);
  }, 300);
};

  const currentInDeckCount = selectedCard ? deckCountMap[selectedCard.name] || 0 : 0;

  const value = {
    cardQuery, setCardQuery,
    filterByIdentity, setFilterByIdentity,
    suggestions, setSuggestions,
    loading, setLoading,
    error, setError,
    handleInputChange, deckId,
    sameNameCard, setSameNameCard,
    selectedCard, setSelectedCard,
    handleArtworkClick, deckCountMap,
    cameFromDeck, currentInDeckCount,
    handleAddClick,
    colorIdentity, setColorIdentity,
    isOwner
  };

  return (
    <CardSearchContext.Provider value={value}>
      {children}
    </CardSearchContext.Provider>
  );
};

// 2. Consume Shared Context values across your elements
export const useCardSearch = () => {
  const context = useContext(CardSearchContext);
  if (!context) {
    throw new Error("useCardSearch must be executed inside a <CardSearchProvider /> block.");
  }
  return context;
};
