import axios from 'axios';
import React, { useState,useRef,useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';


// Debounce hook to limit the rate of function calls
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

// CreateNewDeck component
function CreateNewDeck({onAdd}) {
const [deckName, setDeckName] = useState('');
const [deckFormat, setDeckFormat] = useState('Other');
const [isPublic, setIsPublic] = useState(false);


const [commanderName, setCommanderName] = useState('');
const [selectedCommanderData, setSelectedCommanderData] = useState(null);
const [suggestions, setSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);
// Check Scryfall API availability on component mount
// warm up the Scryfall API

useEffect(() => {
    fetch('https://api.scryfall.com', {
        method:'GET',
        headers: {
            'Accept': 'application/json',
            'User-Agent': "DeckboxApp/1.0" 
        }
    })
    .then(res => {
        if(!res.ok) console.warn("Scryfall warm-up status:", res.status);
    })
    .catch(()=>{
        console.error("Scryfall API is not reachable")
    });
},[]);
const fetchAutocompleteSuggestions = async(searchQuery)=>{
    if(!searchQuery || searchQuery.length < 2) {
        setSuggestions([]);
        return;
    }
    try{
        const query = `${searchQuery}  f:commander is:commander`;
        const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`,{
        headers:{
            'Accept':'application/json',
            'User-Agent':'DeckboxApp/1.0'
            }
        });
        if(!response.ok){
            if(response.status === 404){
                setSuggestions([]);
                return;
            }
            throw new Error(`Http error! status :${response.status}`)
        }
        const json = await response.json();
        setSuggestions(json.data || []);
    } catch(error) {
        console.error("Autocomplete fetch error:",error);
        setSuggestions([]);
    }   
};
// Debounced version of the fetch function
const debouncedAutocompleteFetch = useDebounce(fetchAutocompleteSuggestions, 300);

const handleInputChange = (e) =>{
    const value = e.target.value;
    setCommanderName(value);
    setShowSuggestions(true);
    setSelectedCommanderData(null);
    debouncedAutocompleteFetch(value);
}
const handleSelectSuggestion = (suggestion) =>{
    setCommanderName(suggestion.name);
    setSelectedCommanderData(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
}


// Function to create a new deck
const createDeck = async()=>{

    if (!deckName.trim()) {
        
        alert("Deck name cannot be empty");
        return;
    }
    if(deckFormat === 'Commander' && !commanderName.trim()){
        alert("Commander name cannot be empty for Commander format");
        return;
    }   

    try {
        const payload = { 
            name: deckName, 
            isPublic: isPublic,
            format: deckFormat,
            color_identity: selectedCommanderData ? selectedCommanderData.color_identity : [], 
            commander: deckFormat === 'Commander' ? commanderName.trim() : undefined,
            scryFallCardData: selectedCommanderData
        };
        const response = await axios.post(`${API_BASE}/cardStorage`, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        });
        console.log("deck created", response.data);
        onAdd(response.data);
        setDeckName('');
        setCommanderName('');
        setSuggestions([]);
    } catch(error){
        console.error("error creating deck", error)
    }
}
return (
    <div className="create-deck-container">
        <h2>Create New Deck</h2>
        <label>Deck Name:</label>
        <input type="text" value={deckName} onChange={(e)=>setDeckName(e.target.value)} />

        <label>Deck Format:</label>
        <input type="checkbox" checked={isPublic} onChange={(e)=>setIsPublic(e.target.checked)} /> Make Deck Public
    <Dropdown options={[
        {value:'Standard', label:'Standard'},
        {value:'Modern', label:'Modern'},
        {value:'Commander', label:'Commander'},
        {value:'Legacy', label:'Legacy'},
        {value:'Vintage', label:'Vintage'},
        {value:'Pauper', label:'Pauper'},
        {value:'Other', label:'Other'},
    ]} onSelect={(option)=>setDeckFormat(option.value)} />



    {deckFormat === 'Commander' && (
        <div className="commander-input-container">
            <input type="text" placeholder="Commander Name" value={commanderName} onChange={handleInputChange}
            onBlur={()=>setTimeout(()=>setShowSuggestions(false),300)}
            onFocus={()=>setShowSuggestions(true)} />

        {showSuggestions && suggestions.length >0 && (
            <ul className="suggestions-list">
                {suggestions.map((suggestion) =>(
                    <li key={suggestion.id} onClick={() => handleSelectSuggestion(suggestion)}>
                        {suggestion.name}
                    </li>
                ))}
            </ul>
     )}
</div>
    )}
    



    <button onClick={createDeck}>Create Deck</button>
        <Link to="/mydecks"> Back to My Decks </Link>
    
    </div>
  )
}

export default CreateNewDeck