import React, { useEffect, useState,useRef,useCallback, useMemo } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import "../styles/Search.css";
import { UseCardSearch } from '../components/UseCardSearch';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';


// A debounce function - this is to reduce the number of api requests during typing. 


function Storage() {
    const {
        cardQuery,
        setCardQuery,
        handleInputChange,
        suggestions,
        setSuggestions,
        colorIdentity,
        filterByIdentity,
        setFilterByIdentity,
        loading,
        setLoading,
        error,
        setError,
        deckId,
        sameNameCard,
        setSameNameCard,
        selectedCard,
        setSelectedCard,
        handleArtworkClick,
        deckCountMap,
        cameFromDeck
    
    } = UseCardSearch();









const handleSearchSubmission = async(e) =>{
    e.preventDefault();
    if(!cardQuery.trim()) return;
    setLoading(true);
    setError(null);

        try{
            const identityFilter = (filterByIdentity && colorIdentity) ? `+identity:${colorIdentity}` : '';
            const fullQuery = cardQuery + identityFilter;
            
            const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(fullQuery)}&unique=prints`);
            const data = await response.json();
            if(!data.object === "error") throw new Error (data.details);
            setSuggestions([]);
            setSameNameCard(data.data);
            if(data.data.length > 0) setSelectedCard(data.data[0]);

            console.log("search results:", data.data)
           
    } catch (err) {
        setError(err.message);
    } finally {
    setLoading(false); 
    }
}

const handleSuggestionClick = (name)=>{
    setCardQuery(name);
    setSuggestions([]);
};

    return (
    <div className="search search_container">
        <h2 className='search_header'>Add Cards to deck</h2>
        <form className='search_form' onSubmit={handleSearchSubmission}>
            <div className='search_input-wrapper'>
            <input 
            type="text"
            value={cardQuery}
            onChange={(e)=>setCardQuery(e.target.value)}
            placeholder='Search for a card..'
            autoComplete="off"
            />

            {suggestions.length > 0 && (
                <ul className='suggestions_list'>
                    {suggestions.map((name,index)=>(
                        <li key={index} onClick={()=> handleSuggestionClick(name)}>
                            {name}
                        </li>
                    ))}
                </ul>
            )}
            </div>

            {colorIdentity && (
                <div className='filter_toggle'>
                    <label>
                       <input type="checkbox" checked={filterByIdentity} onChange={ (e)=>setFilterByIdentity(e.target.checked)}/>
                        limit to deck colors ({colorIdentity.toUpperCase()})
                    </label>
                </div>
            )}

            <button className='buttons' type='submit' disabled={loading}>
                {loading ? 'Searching...':'search'}
                </button>
        </form>
        {loading && <div className='loading'>loading card data...</div>}
      
        {/* Artwork Navigation */}
        {error && <div className='loading_error'>Error: {typeof error === 'string'? error :error.message}</div>}

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
