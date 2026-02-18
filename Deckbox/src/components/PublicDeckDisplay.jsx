import React ,{useEffect, useState} from 'react'
import { Link, useLocation } from 'react-router-dom';
import '../styles/PublicDeckDisplay.css';
import DeckCard from './DeckCard';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';




function PublicDeckDisplay() {
  const [publicDecks, setPublicDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  
  useEffect(() => {
    const fetchPublicDecks = async () => {
      try {
        const response = await fetch(`${API_BASE}/cardStorage/public/decks`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched public decks:", data);
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

  return (<div className='public'>
      <h1 className='headers public_header'>What the community is doing</h1>
    <div className=" public_container">
      {publicDecks.map((deck) => (
        <DeckCard
        key={deck._id}
        deck={deck}
        showOwner={true}
        />
      ))}

    </div>
    
</div>
  );
}

export default PublicDeckDisplay