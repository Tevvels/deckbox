import axios from 'axios';
import React, { useState,useEffect } from 'react'
import '../styles/MyDecks.css';
import { Link,useNavigate } from 'react-router-dom'
import DeckCard from './DeckCard';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';


function MyDecks() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  

  // Delete deck function
  const deleteDeck = async (deckId) => {
      const token = localStorage.getItem('userToken');
      try {
        await axios.delete(`${API_BASE}/cardStorage/${deckId}`, {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        });
        setDecks(prevDecks => prevDecks.filter(deck => deck._id !== deckId));
      }
      catch (err) {
        console.error('Error deleting deck:', err);
      }
    };
    // Fetch user's decks on component mount
  useEffect(() => {
const fetchDecks = async () => {
    const token = localStorage.getItem('userToken');
    if(!token) {
      setError(new Error('No authentication token found'));
      setLoading(false);
      navigate('/login');
      return;
    }  
    try {

    const response = await axios.get(`${API_BASE}/cardStorage`, {
      headers: {
        Authorization: `Bearer ${token}`  
      }
    });
    setDecks(response.data);
    setLoading(false);
  }
  catch (err) {
    if(err.response && err.response.status === 401||err.response.status === 403) {
      localStorage.removeItem('userToken');
      setError(new Error('Authentication error. Please log in again.'));
      navigate('/login');
    } else {
      setError(err);
  }
  setLoading(false);
}
};
fetchDecks();
  }, [navigate]);
// Function to determine deck color style

  if (loading) {
    return <div>Loading...</div>;
  } 
  if (error) {
    return <div>Error: {error.message}</div>;
  }




 return (
    <div className="my_Deck my_Deck-container">
      <Link className="links my_Deck-link my_Deck-link-new" to="/deck/new">
        <button className="buttons my_Deck-button my_Deck-add">+</button></Link>
      <h2 className='header my_Deck-header'>My Decks</h2>
      <div className="list my_Deck-list">
        
        {decks.map((deck) => (
          <DeckCard
          key={deck._id}
          deck={deck}
          onDelete={deleteDeck}
          />
))}
      </div>
      <Link className='links my_Deck-link my_Deck-link-dashboard ' to="/dashboard"> Back to Dashboard </Link>

    </div>
  )
}   


export default MyDecks