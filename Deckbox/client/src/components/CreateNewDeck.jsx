import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropdown from './Dropdown';
import Gradient from '../modules/Gradient';
import '../styles/CreateNewDeck.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const SCRYFALL_API = 'https://api.scryfall.com';

// --- Custom Hooks ---
// Debounce hook to limit the rate of function calls
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  return useCallback((...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};
// Hook to manage commander search suggestions

const useCommanderSearch = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const q = encodeURIComponent(`${query} f:commander is:commander`);
      const { data } = await axios.get(`${SCRYFALL_API}/cards/search?q=${q}`, {
        headers: { 'User-Agent': 'DeckboxApp/1.0' }
      });
      setSuggestions(data.data || []);
    } catch (err) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  return { suggestions, loading, fetchSuggestions, setSuggestions };
};

// --- Main Component ---
// Component to create a new deck.

function CreateNewDeck({ onAdd }) {
  const navigate = useNavigate();
  const [deckName, setDeckName] = useState('');
  const [deckFormat, setDeckFormat] = useState('Other');
  const [isPublic, setIsPublic] = useState(false);
  const [commanderName, setCommanderName] = useState('');
  const [selectedCommanderData, setSelectedCommanderData] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, fetchSuggestions, setSuggestions } = useCommanderSearch();
  const debouncedFetch = useDebounce(fetchSuggestions, 300);

  // Warm up Scryfall
  useEffect(() => {
    axios.get(SCRYFALL_API).catch(() => console.warn('Scryfall unreachable'));
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCommanderName(value);
    setSelectedCommanderData(null);
    setShowSuggestions(true);
    debouncedFetch(value);
  };

  const handleSelectSuggestion = (card) => {
    setCommanderName(card.name);
    setSelectedCommanderData(card);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const createDeck = async (e) => {
    e.preventDefault();
    if (!deckName.trim()) return alert('Deck name required');
    if (deckFormat === 'Commander' && !commanderName.trim()) {
      return alert('Commander required for this format');
    }

    try {
      const payload = {
        name: deckName,
        isPublic,
        format: deckFormat,
        color_identity: selectedCommanderData?.color_identity || [],
        commander: deckFormat === 'Commander' ? commanderName.trim() : undefined,
        scryFallCardData: selectedCommanderData,
      };

      const { data } = await axios.post(`${API_BASE}/cardStorage`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      onAdd(data);
      resetForm();

      const deckId = data._id || data.id;
      if(deckId) {
        navigate(`/deck/${deckId}`);
      } else  {
        navigate('/deck');
      }
    } catch (error) {
      console.error('Creation failed:', error);
    }
  };

  const resetForm = () => {
    setDeckName('');
    setCommanderName('');
    setSuggestions([]);
    setSelectedCommanderData(null);
  };

  return (
    <div className="create">
      <div className="create_deck">
        <div className="create_deck-header">
          <h2>Create New Deck</h2>
        </div>

        <form className="create_deck-form" onSubmit={createDeck}>
          {/* Row 1: Deck Name Input */}
          <div className="create_deck-group">
            <label htmlFor="deckName">Deck Name</label>
            <input
              id="deckName"
              className="create_deck-input"
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              required
              placeholder="Enter a name for your deck..."
            />
          </div>

          {/* Row 2: Format Selection Field Container */}
          <div className="create_deck-group create_deck-format-group">
            <label>Deck Format</label>
            <Dropdown
            classN="createMenu"
              options={[
                { value: 'Standard', div: 'Standard' },
                { value: 'Modern', div: 'Modern' },
                { value: 'Commander', div: 'Commander' },
                { value: 'Legacy', div: 'Legacy' },
                { value: 'Pauper', div: 'Pauper' },
                { value: 'Other', div: 'Other' },
              ]}
              onSelect={(opt) => setDeckFormat(opt.value)}
            />
          </div>

          {/* Row 3: Conditional Commander Input Form Field */}
          {deckFormat === 'Commander' && (
            <div className="create_deck-group create_deck-commander-group">
              <label htmlFor="commanderName">Commander Name</label>
              <input
                id="commanderName"
                type="text"
                className="create_deck-input"
                placeholder="Search for a legendary creature..."
                value={commanderName}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <ul className="create_deck-suggestions-list">
                  {suggestions.map((card) => (
                    <li key={card.id} onMouseDown={() => handleSelectSuggestion(card)}>
                      {card.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Row 4: Privacy Settings Checkbox Wrapper */}
          <div className="create_deck-public">
            <label>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              Make the Deck Public
            </label>
          </div>

          {/* Row 5: Action Button Cluster Submitter Row */}
          <div className="create_deck-buttons">
            <button type="submit" className="create_deck-button-create">
              Create Deck
            </button>
            <Link className="create_deck-button-back" to="/mydecks">
              Back to My Decks
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNewDeck;
