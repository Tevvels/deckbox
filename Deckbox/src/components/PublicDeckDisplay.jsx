import React ,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import '../styles/PublicDeckDisplay.css';
import DeckCard from './DeckCard';

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
        <DeckCard
        key={deck._id}
        deck={deck}
        showOwner={true}
        />
      ))}

      <Link className='links public_link' to ="/dashboard"> Back to Dashboard </Link>
    </div>
    
</>
  );
}

export default PublicDeckDisplay