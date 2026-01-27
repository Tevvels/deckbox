import axios from 'axios';
import React, { useState,useEffect } from 'react'
import '../styles/MyDecks.css';
import { Link,useNavigate } from 'react-router-dom'

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
  const getColorValue = (char) =>{
    const colorMap = {
      'W': 'white',
      'U': 'blue',
      'B': 'black',
      'R': 'red',
      'G': 'green',
      'C': 'colorless'
    };
    return colorMap[char] || '#90adbb';
  };

  const getDeckColorStyle = (colorIdentity) =>{
    if(!colorIdentity || colorIdentity.length === 0){
      return  {backgroundColor: '#90adbb'};
    }
    
    if(colorIdentity.length ===1){
      return {backgroundColor : getColorValue(colorIdentity[0])};
    }
    const gradientColors = colorIdentity.map(char => getColorValue(char)).join(', ');
    return {background: `linear-gradient(45deg, ${gradientColors})`};
  };

  if (loading) {
    return <div>Loading...</div>;
  } 
  if (error) {
    return <div>Error: {error.message}</div>;
  }




 return (
    <div className="my-decks-container">
      <Link to="/deck/new"><button className="create-deck-button">+</button></Link>
      <h2>My Decks</h2>
      <div className="deck-list">
        
        {decks.map((deck) => {
          // Get first card's image for deck art
         const validCards = deck.cards?.filter(c => c &&  c.cardId) || [];
          
        
          const firstCard = validCards.length > 0 ? validCards[0].cardId : null;

          // if the card has an image_uris field, use art_crop else use placeholder

          const imageUrl = firstCard?.image_uris?.art_crop || firstCard?.card_faces?.[0]?.image_uris.art_crop || 'placement_image_url_here';
          console.log(imageUrl)
          return (
          <Link to={`/deck/${deck._id}`} key={deck._id} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div key={deck._id} className="deck-card" style=
          {getDeckColorStyle(deck.color_identity)}>
          <img className={`deckArt`} alt="deckArt" src={imageUrl}/>

            <h3>{deck.name}</h3>
            <p>Format: {deck.format}</p>
            <p>Commander: {deck.commander || 'N/A'}</p>
            <p>Cards in Deck: {deck.cards.length}</p>
            <div className="deck-card-buttons">
              <button onClick={() => deleteDeck(deck._id)}>Delete Deck</button>
            </div>
          </div>
        </Link>
          )
})}
      </div>
      <Link to="/dashboard"> Back to Dashboard </Link>

    </div>
  )
}   


export default MyDecks