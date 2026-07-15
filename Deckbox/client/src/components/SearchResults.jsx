import React, { useState, useEffect, useMemo } from "react"; 
import { useNavigate, useSearchParams } from "react-router-dom"; 

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000"; 

function SearchResults({ addCardToDeck, currentDeckList = [] }) { 
  const [searchParams] = useSearchParams(); 
  const query = searchParams.get("q") || ""; 
  const deckId = searchParams.get("deckId"); 
  
  const [results, setResults] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  // Memoize deck count map to instantly find quantity counts for your badge notifications
  const deckCountMap = useMemo(() => { 
    const countMap = {}; 
    if (Array.isArray(currentDeckList)) { 
      currentDeckList.forEach((entry) => { 
        const name = entry.cardId?.name || entry.name; 
        if (name) { 
          const qty = entry.quantity || 1; 
          countMap[name] = (countMap[name] || 0) + qty; 
        } 
      }); 
    } 
    return countMap; 
  }, [currentDeckList]); 

  // Fetch live card metrics out of Scryfall on mount / query changes
  useEffect(() => { 
    const fetchResults = async () => { 
      if (!query) return; 
      setLoading(true); 
      setError(null);
      try { 
        const response = await fetch( 
          `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`, 
        ); 
        if (!response.ok) {
          throw new Error("No cards matched your current search parameter.");
        }
        const data = await response.json(); 
        setResults(data.data || []); 
      } catch (err) { 
        console.error("search error", err); 
        setError(err.message);
        setResults([]);
      } finally { 
        setLoading(false); 
      } 
    }; 
    fetchResults(); 
  }, [query]); 

  // Core execution block to sync card details and update backends
  const handleAddCard = async (card) => { 
    if (!card || !deckId) return; 
    
    // Optimistic alert prompt feedback context or loader indicators toggle
    setLoading(true); 
    try { 
      // 1. Sync card details to your backend database
      const syncResponse = await fetch(`${API_BASE}/cardStorage/sync-card`, { 
        method: "POST", 
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        }, 
        body: JSON.stringify(card), 
      }); 
      
      if (!syncResponse.ok) throw new Error("Failed to sync card details.");
      const { mongoId } = await syncResponse.json(); 

      // 2. Add card relationship token to the deck tracker
      const addCardResponse = await fetch( 
        `${API_BASE}/cardStorage/${deckId}/add-card`, 
        { 
          method: "POST", 
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          }, 
          body: JSON.stringify({ cardId: mongoId }), 
        }, 
      ); 

      if (!addCardResponse.ok) throw new Error("Failed to attach card link to deck backend.");

      // 3. Update the global parent array state tracker
      // FIXED: Corrected spelling typo from 'mongId' to 'mongoId'
      addCardToDeck({ mongoId, name: card.name }); 
      
    } catch (error) { 
      console.error("Add Error:", error); 
      alert(error.message || "An unexpected issue occurred while adding the card.");
    } finally { 
      setLoading(false); 
    } 
  }; 

  return ( 
    <div className="search-results-page"> 
      {/* Upper Navigation Control Links */}
      <div className="search-results-controls">
        <button className="create_deck-button-back" onClick={() => navigate(-1)}>
          ← Back to Search
        </button> 
        {deckId && (
          <button className="create_deck-button-back" onClick={() => navigate(`/deck/${deckId}`)}>
            Back to Deck
          </button>
        )}
      </div>

      <header className="create_deck-header">
        <h2>Results for: "{query}"</h2> 
      </header>

      {loading && <div className="loading-spinner">Searching Scryfall database archives...</div>}
      {error && <p className="error-message-text">{error}</p>}

      {/* Optimized Card Grid Panel Layout */}
      <div className="search-results-grid"> 
        {results.map((card) => { 
          const countInDeck = deckCountMap[card.name] || 0; 
          // Safely extracts double-faced card artwork formats cleanly
          const cardArtUrl = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal;

          return ( 
            <div key={card.id} className="search-card-item"> 
              <div className="card-image-container"> 
                {cardArtUrl ? (
                  <img src={cardArtUrl} alt={card.name} className="card-image-render" /> 
                ) : (
                  <div className="card-image-missing-placeholder">Image Unreachable</div>
                )}
                
                {/* Visual Badge Indicator overlay counters */}
                {countInDeck > 0 && ( 
                  <span className="deck_count-badge">{countInDeck} in deck</span> 
                )} 
              </div> 

              <div className="search-card-meta">
                <p className="search-card-name-title">{card.name}</p>
                <button 
                  className="create_deck-button-create" 
                  disabled={loading}
                  onClick={() => handleAddCard(card)}
                >
                  {loading ? "Adding..." : "Add to Deck"}
                </button> 
              </div>
            </div> 
          ); 
        })} 
      </div> 

      {results.length === 0 && !loading && !error && (
        <p className="no-results-alert-label">No magic cards found matching those criteria.</p>
      )} 
    </div> 
  ); 
} 

export default SearchResults;
