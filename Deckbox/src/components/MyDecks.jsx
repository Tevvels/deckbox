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
      'W': '#fdf1a2',
      'U': '#00a2e8',
      'B': '#000000',
      'R': '#e3312b',
      'G': '#00a650',
      'C': '#a9a9a9'
    };
    return colorMap[char] || '#a9a9a9';
  };

  const getDeckColorStyle = (colorIdentity) =>{
    if(!colorIdentity || colorIdentity.length === 0){
      return  {backgroundColor: '#a9a9a9'};
    }
    
    if(colorIdentity.length ===1){
      return {backgroundColor : getColorValue(colorIdentity[0])};
    }
    const gradientColors = colorIdentity.map(char => getColorValue(char)).join(', ');
    return {background: `linear-gradient(270deg, ${gradientColors})`, boxShadow: `0 0 15px ${gradientColors}`};
  };

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
        
        {decks.map((deck) => {
          // Get first card's image for deck art
         const validCards = deck.cards?.filter(c => c &&  c.cardId) || [];
          
        
          const firstCard = validCards.length > 0 ? validCards[0].cardId : null;

          // if the card has an image_uris field, use art_crop else use placeholder

          const imageUrl = firstCard?.image_uris?.art_crop || firstCard?.card_faces?.[0]?.image_uris.art_crop || 'placement_image_url_here';
          return (
            <div key={deck._id} className="my_Deck-container-sub my_Deck-informationBlock" >
              <div className='my_Deck-color' style={getDeckColorStyle(deck.color_identity)} />
            <Link className='links my_Deck-link my_Deck-toSpecificDeck' to={`/deck/${deck._id}`} key={deck._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className='my_Deck-informationBlock-sub'>
            <img className={`img my_Deck-deckArt`} alt="deckArt" src={imageUrl}/>
            <h3 className="headers my_Deck-header my_Deck-header-sub">{deck.name}</h3>
            <p className='my_Deck-format'>Format: {deck.format}</p>
            <p className='my_Deck-commander' >Commander: {deck.commander || 'N/A'}</p>
            <p className='my_Deck-cardCount'>Cards in Deck: {deck.cards.length}</p>
              <button className='buttons my_Deck-button my_Deck-delete' onClick={() => deleteDeck(deck._id)}>Delete Deck</button>
            </div>
        </Link>
          </div>
          )
})}
      </div>
      <Link className='links my_Deck-link my_Deck-link-dashboard ' to="/dashboard"> Back to Dashboard </Link>

    </div>
  )
}   


export default MyDecks