import React, { useEffect, useState,useRef,useCallback, useMemo } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import "../styles/Search.css";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';


// A debounce function - this is to reduce the number of api requests during typing. 
const useDebounce = (callback,delay) =>{
    const timeoutRef = useRef(null);
    return useCallback((...args)=>{
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(()=>{
            callback(...args);
        },delay);
    },[callback,delay])
}

function Storage({addCardToDeck, currentDeckList = []}) {
    // states for card search
const [cardQuery,setCardQuery] = useState('');
const [colorIdentity,setColorIdentity] = useState('');
const [suggestions,setSuggestions] = useState([]);
const [cardData,setCardData] = useState([]);
const [error,setError] = useState(null);
const [loading,setLoading]  = useState(false);
const [sameNameCard,setSameNameCard] = useState([]);
const [selectedCard,setSelectedCard] = useState(null);
const {deckId} = useParams();
const [filterByIdentity,setFilterByIdentity] = useState(true);



const location = useLocation();
const navigate = useNavigate();

const handleSearchSubmission = async(e) =>{
    e.preventDefault();
    if(!cardQuery.trim()) return;
    setLoading(true);
    setError(null);

        try{
            const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(cardQuery)}`)
            const data = await response.json();
            if(data.object === 'error'){
                throw new Error(data.details);
            }
        
        //navigation//
        navigate(`/search?q=${encodeURIComponent(cardQuery)}&deckId=${deckId}`,{
            state: {
                results: data.data,
                query: cardQuery,
                deckId: deckId // pass deckid to add card later
            }
        });
} catch (err) {
    setError(err.message);
} finally {
    setLoading(false); 
}
}

const showCommanderFilter = location.state?.fromDeck && location.state?.isCommander;

const cameFromDeck = location.state?.fromDeck;

useEffect(()=>{
    const fetchDeckColors = async() =>{
        if(!deckId) return;
        try{
            const response = await fetch(`${API_BASE}/cardStorage/${deckId}`,{
                  headers:{
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                    
                }}); 
                 
             if(!response.ok){
                throw new Error('Network was not ok');
            }   
            const data = await response.json();
            if(data.color_identity){
                setColorIdentity(data.color_identity.join('').toLowerCase());
            }
        } catch( error){
            console.error('Error fetching deck colors: ', error);
        }
    }
    if(deckId){
        fetchDeckColors();
    }   
},[deckId]);





// const cancelTokenSource = useParams();


const fetchAutocompleteSuggestions = async (searchQuery) => {
    const isLongEnough = searchQuery && searchQuery.length > 1;
    if(!isLongEnough) {
        setSuggestions([]);
        return;
    }
    try{
        // Build the search query with color identity constraint if filtering is enabled
        const identityPart = (filterByIdentity && colorIdentity && colorIdentity.trim() !== "") ? ` id<=${colorIdentity}` : '';
        const fullQuery = `${searchQuery}${identityPart}`;
        
        // Fetch matching cards from Scryfall
        const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(fullQuery)}&unique=prints&order=released&page=1`);
        
        if(!response.ok){
            throw new Error(`Http error! status: ${response.status}`);
        }
        
        const json = await response.json();
        
        // Extract unique card names and limit to 15 suggestions
        if(json.data && json.data.length > 0) {
            const uniqueNames = Array.from(new Set(json.data.map(card => card.name))).slice(0, 15);
            setSuggestions(uniqueNames);
        } else {
            setSuggestions([]);
        }

    }
        catch(error){
        console.error("search error:",error);
        setSuggestions([]);
        }
};

const debouncedAutocompleteFetch = useDebounce(fetchAutocompleteSuggestions, 300);





useEffect(()=>{
    if(cardData && cardData.length > 0) {
        // `sameNameCard` seems redundant if you just use `cardData`
        setSameNameCard(cardData); 
        setSelectedCard(cardData[0]);
    }
},[cardData]);

const handleSuggestionClick = (name)=>{
    setCardQuery(name);
    fetchCardDataForSelection(name);
}

const handleSubmit = (event) =>{
    event.preventDefault();
    if(cardQuery.trim()){
        fetchCardDataForSelection(cardQuery.trim());
    }
}

const handleInputChange = (event) =>{
    const value = event.target.value;
    setCardQuery(value);
    debouncedAutocompleteFetch(value);
}




const currentInDeckCount = selectedCard ? (deckCountMap[selectedCard.name] || 0) : 0;

if (loading && !cardData) return(<div className='loading'>it's loading</div>)
if (error) return(<div className='loading_error'>Error {error.message}</div>)

    return (
    <div className="search search_container">
        <form onSubmit={handleSearchSubmission}>
            <input 
            type="text"
            value={cardQuery}
            onChange={(e)=>setCardQuery(e.target.value)}
            placeholder='Search for a card..'
            />
            <button className='buttons' type='submit' disabled={loading}>
                {loading ? 'Searching...':'search'}
                </button>
        </form>
        {loading && <div className='loading'>loading card data...</div>}
      
        {/* Artwork Navigation */}
        {error && <div className='loading_error'>Error: {error.message}</div>}

        {sameNameCard.length > 0 && (
            <div className='search_container-sub'>
                <h3 className='search_header '>Prints found:</h3>
                <div className='search_container-sub search_container-card' style={{ display: 'flex', overflowX: 'auto', padding: '10px' }}>
                    {sameNameCard.map((card) => (

                        <div className='search_card' key={card.id} style={{ position: 'relative', marginRight: '10px' }}>
                            <img
                                className='card search_card-img'
                                src={card.image_uris ? card.image_uris.small : card.card_faces[0].image_uris.small} 
                                alt={card.name}
                                style={{
                                    border: selectedCard && selectedCard.id === card.id ? '3px solid blue' : '1px solid gray',
                                    cursor: 'pointer',
                                    width: '100px' // Keep images small for the carousel
                                }}
                                onClick={() => handleArtworkClick(card)}
                            />
                             {/* The Quantity Badge */}
                            {deckCountMap[card.name] > 0 && (
                                <div className='search_card-name' style={{ 
                                    position: 'absolute', 
                                    top: '5px', 
                                    right: '5px', 
                                    backgroundColor: 'rgba(0, 128, 0, 0.9)', 
                                    color: 'white', 
                                    borderRadius: '50%', 
                                    width: '24px', 
                                    height: '24px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}>
                                    {deckCountMap[card.name]}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {selectedCard && (
            <div className='search_card card  search_card-selected' style={{marginTop: '20px'}}>
                <h2 className='search_card-name search_card-selected-name'>{selectedCard.name}</h2>
                
                {/* Detailed view indicator */}
                <div className="search_card-selected-indeck" style={{ marginBottom: '10px', padding: '5px', border: '1px solid #ddd' }}>
                    {cameFromDeck ? (currentInDeckCount > 0 ? (
                        <span className='spans ' style={{ color: 'green', fontWeight: 'bold' }}>
                            ✓ You have {currentInDeckCount} copy{currentInDeckCount > 1 ? 'ies' : ''} in your deck.
                        </span>
                    ) : (
                        <span className='spans ' style={{ color: '#666' }}>This card is not yet in your deck.</span>
                    )):""}
                </div>

                    {deckId ? (
                <button className='buttons search_card-selected-button' disabled={!deckId} onClick={handleAddClick}>
                    Add {selectedCard.name} to Deck
                </button>
                    ):(
                        <p className='search_public'>generals</p>
                    )}
                {selectedCard.card_faces ? (
                    selectedCard.card_faces.map((face, index) => (
                        <div key={index}>
                            <img className="card search_card-img" src={face.image_uris.large} alt={face.name} style={{ maxWidth: '300px', marginTop: '10px' }} /> 
                            <p className='search_card-oracle'>{face.oracle_text}</p>
                        </div>
                    ))
                ) : (
                    <div>
                        <img className="card search_card-img" src={selectedCard.image_uris.large} alt={selectedCard.name} style={{ maxWidth: '300px', marginTop: '10px' }} />     
                        <p className='search_card-oracle'>{selectedCard.oracle_text}</p>
                    </div>
                )}
            </div>
        )}
         {cameFromDeck ? (<Link className='links search_link' to={`/deck/${deckId}`}> Back to Deck </Link>): ""}
    </div>
    );
}

export default Storage;
