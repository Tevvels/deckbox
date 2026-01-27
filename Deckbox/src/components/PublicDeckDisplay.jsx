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

  if (loading) return <div>Loading public decks...</div>;
  if (error) return <div>Error loading public decks: {error.message}</div>;

  return (<>
    <div className="Public">
      {publicDecks.map((deck) => (
        <div key={deck._id} className="public-deck"> 
          <h3>{deck.name}</h3>
          <h2>By: {deck.user?.username || 'unknown'}</h2>  
          <p>Format: {deck.format}</p>
          <p>Commander: {deck.commander || 'N/A'}</p>
          <p>Cards in Deck: {deck.cards.length}</p>
          <Link to={`/deck/${deck._id}`}> View Deck </Link>
        </div>
      ))}

      <Link to ="/dashboard"> Back to Dashboard </Link>
    </div>
    
</>
  );
}

export default PublicDeckDisplay