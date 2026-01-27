import React, { useEffect, useState,useRef,useCallback, useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';

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



const deckCountMap = useMemo(() => {
 const countMap = {};
 if(Array.isArray(currentDeckList)){
        currentDeckList.forEach(entry =>{
            if(entry.cardId &&entry.cardId.name){
                const name = entry.cardId.name;
                const qty = entry.quantity || 1;
                if(countMap[name]){
                    countMap[name] += qty;
                } else {
                    countMap[name] = qty;
                }
            }
        });
    } else {
        console.warn('currentDeckList is not an array');  // Log a warning if currentDeckList is not an array
    }   return countMap;
}, [currentDeckList]);


// const cancelTokenSource = useParams();


const fetchAutocompleteSuggestions = async(searchQuery)=>{
    if(!searchQuery || searchQuery.length < 2) {
        setSuggestions([]);
        return;
    }
    try{
        const response = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(searchQuery)}`)
        if(!response.ok){
            throw new Error(`Http error! status :${response.status}`)
        }
        const json = await response.json();
        setSuggestions(json.data || []);
    } catch(error) {
        console.error("Autocomplete fetch error:",error);
        setSuggestions([]);
    }
};

const debouncedAutocompleteFetch = useDebounce(fetchAutocompleteSuggestions, 300);

const fetchCardDataForSelection = async(cardName) =>{
    setLoading(true);
    setError(null);
    try{
        
        const idQuery = (colorIdentity && colorIdentity.trim() !== "") ? colorIdentity : null;

        const identityPart = (filterByIdentity && idQuery) ? ` id<=${idQuery}` : '';
        const fullQuery = `!"${cardName}"${identityPart}`;
        const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(fullQuery)}&unique=prints`)
        if(!response.ok){
            throw new Error(`Http error! status:${response.status}`);
        }
        const json = await response.json();
        if(json.data && json.data.length > 0){
            // Set the full list of prints
            setCardData(json.data); 
        } else {
            throw new Error("no card was found");
        }
    } catch (error){
        setError(error);
        setCardData(null);
    } finally{
        setLoading(false);
    }

}



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


const handleArtworkClick = (clickedCard) => {
    setSelectedCard(clickedCard);
};

const handleAddClick = async() =>{
    if(selectedCard && deckId) {
        try{
            // Sync card details to your backend database
            const syncResponse = await fetch(`${API_BASE}/cardStorage/sync-card`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                },
                body: JSON.stringify(selectedCard),
            });
            if(!syncResponse.ok){
                throw new Error('Failed to sync card with backend database')
            }
            
            const {mongoId} = await syncResponse.json();
            

            const addCardResponse = await fetch(`${API_BASE}/cardStorage/${deckId}/add-card`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${localStorage.getItem('userToken')}`
                },
                body: JSON.stringify({cardId:mongoId}),
            });
            if(!addCardResponse.ok){
                throw new Error('Failed to add card to deck backend');
            }

            addCardToDeck({mongoId, name: selectedCard.name})

        } catch(error){
            console.error("error during card sync:" ,error); 
            setError(error);
        }
    }
};

const currentInDeckCount = selectedCard ? (deckCountMap[selectedCard.name] || 0) : 0;

if (loading && !cardData) return(<div>it's loading</div>)
if (error) return(<div>Error {error.message}</div>)

    return (
    <>
        <form onSubmit={handleSubmit}>
            {showCommanderFilter && (
            <label>
                <input 
                    type="checkbox"
                    checked={filterByIdentity}  
                    onChange={(e)=> setFilterByIdentity(e.target.checked)}
                />  
                Filter by Commander Identity ({colorIdentity || 'None'})
            </label>
            )}
           <input 
            id={'cardSearch'}
            type="text"
            value={cardQuery}
            onChange={handleInputChange}
            placeholder='Search for a card..'
            role="combobox"
            aria-expanded={suggestions.length > 0 ? true: false}
            />

            <button type='submit'>search</button>

            {suggestions.length > 0 && (
                <ul style={{ border: '1px solid #ccc', listStyle: 'none', padding: 0 }}>
                    {suggestions.map((name)=>(
                        <li key={name}
                        onClick={()=> handleSuggestionClick(name)}
                        onMouseEnter={(e)=> e.target.style.backgroundColor = '#f0f0f0'}
                        onMouseLeave={(e)=> e.target.style.backgroundColor = ''}
                        style={{ padding: '5px', cursor: 'pointer' }}
                         >
                        {name}
                        {/* Indicator in suggestion list */}
                        {deckCountMap[name] > 0 && <span style={{color: 'green', fontSize: '0.8em', marginLeft: '10px'}}>(In Deck: {deckCountMap[name]})</span>}
                    </li>
                    ))}
                </ul>
            )}

        </form>
    
        {loading && <div>loading card data...</div>}
      
        {/* Artwork Navigation */}
        {error && <div>Error: {error.message}</div>}

        {sameNameCard.length > 0 && (
            <div>
                <h3>Prints found:</h3>
                <div style={{ display: 'flex', overflowX: 'auto', padding: '10px' }}>
                    {sameNameCard.map((card) => (

                        <div key={card.id} style={{ position: 'relative', marginRight: '10px' }}>
                            <img
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
                                <div style={{ 
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
            <div style={{marginTop: '20px'}}>
                <h2>{selectedCard.name}</h2>
                
                {/* Detailed view indicator */}
                <div style={{ marginBottom: '10px', padding: '5px', border: '1px solid #ddd' }}>
                    {currentInDeckCount > 0 ? (
                        <span style={{ color: 'green', fontWeight: 'bold' }}>
                            ✓ You have {currentInDeckCount} copy{currentInDeckCount > 1 ? 'ies' : ''} in your deck.
                        </span>
                    ) : (
                        <span style={{ color: '#666' }}>This card is not yet in your deck.</span>
                    )}
                </div>

                    {deckId ? (
                <button disabled={!deckId} onClick={handleAddClick}>
                    Add {selectedCard.name} to Deck
                </button>
                    ):(
                        <p>generals</p>
                    )}
                {selectedCard.card_faces ? (
                    selectedCard.card_faces.map((face, index) => (
                        <div key={index}>
                            <img src={face.image_uris.large} alt={face.name} style={{ maxWidth: '300px', marginTop: '10px' }} /> 
                            <p>{face.oracle_text}</p>
                        </div>
                    ))
                ) : (
                    <div>
                        <img src={selectedCard.image_uris.large} alt={selectedCard.name} style={{ maxWidth: '300px', marginTop: '10px' }} />     
                        <p>{selectedCard.oracle_text}</p>
                    </div>
                )}
            </div>
        )}
         {cameFromDeck ? (<Link to={`/deck/${deckId}`}> Back to Deck </Link>): (<Link to="/dashboard"> Back to My Decks </Link>)}
    </>
    );
}

export default Storage;
