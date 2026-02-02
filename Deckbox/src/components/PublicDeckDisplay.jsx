import React ,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import '../styles/PublicDeckDisplay.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';




function PublicDeckDisplay() {
  const [publicDecks, setPublicDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPublicDecks = async () => {
      try {
        const response = await fetch(`${API_BASE}/cardStorage/public/decks`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPublicDecks(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPublicDecks();
  }, []);

  if (loading) return <div className='loading'>Loading public decks...</div>;
  if (error) return <div className='loading_error'>Error loading public decks: {error.message}</div>;

  return (<>
    <div className="public public_container">
      {publicDecks.map((deck) => (
        <div key={deck._id} className="public_container-sub public_deck"> 
          <h3 className='public_deck-name'>{deck.name}</h3>
          <h2 className='public_deck-owner'>By: {deck.user?.username || 'unknown'}</h2>  
          <p className='public_deck-format'>Format: {deck.format}</p>
          <p className='public_deck-commander'>Commander: {deck.commander || 'N/A'}</p>
          <p className="public_deck-count">Cards in Deck: {deck.cards.length}</p>
          <Link className='links public_link' to={`/deck/${deck._id}`}> View Deck </Link>
        </div>
      ))}

      <Link className='links public_link' to ="/dashboard"> Back to Dashboard </Link>
    </div>
    
</>
  );
}

export default PublicDeckDisplay