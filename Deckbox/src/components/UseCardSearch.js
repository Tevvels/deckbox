import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';



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

export const UseCardSearch = () => {




    const location  = useLocation();
    const navigate = useNavigate();
    const {deckId} = useParams();

    const [selectedCard, setSelectedCard] = useState(null);
    const [sameNameCard, setSameNameCard] = useState([]);
    const [deckCountMap, setDeckCountMap] = useState({});
    const cameFromDeck = location.state?.cameFromDeck;


    const [cardQuery, setCardQuery] = useState('');
    const [colorIdentity,setColorIdentity] = useState(location.state?.colorIdentity || '');
    const [filterByIdentity, setFilterByIdentity] = useState(true);
    const [suggestions, setSuggestions] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    const getSafeToken = useCallback(() =>{
        const rawToken = localStorage.getItem('userToken');
        if(!rawToken) return null;
        try{
            const parsed = JSON.parse(rawToken);
            return typeof parsed === 'object' && parsed.token ? parsed.token : parsed;  
        } catch (e){
            return rawToken;    
        }
    },[]);



    const handleArtworkClick = (card) =>{
        setSelectedCard(card);
        if(cameFromDeck){
            navigate(`/card/${card.id}`, {state: {cameFromDeck:true, colorIdentity: colorIdentity}});
        } else {
            navigate(`/card/${card.id}`);
        }
    };

const handleAddClick = async (card) =>{
    const token = getSafeToken();
    try{
        const response = await fetch(`${API_BASE}/cardStorage/${deckId}/add`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : token ? `Bearer ${token}` : ''
            },
            body: JSON.stringify({cardId: card.id})
        })
        if(response.ok){
            const data = await response.json();
            setDeckCountMap(prev => ({...prev, [card.id]: data.newCount}));
        }
    } catch (err) {
        console.error("Error adding card to deck:", err);
    }
};


    useEffect(()=>{
        const fetchDeckColors = async () =>{
            if(!deckId || colorIdentity) return;
            try{
                const response = await fetch(`${API_BASE}/cardStorage/${deckId}`,{
                    headers: {
                        'Authorization' : Token ? `Bearer ${Token}` : '',
                    }
                });
                if(response.ok) {
                    const data  = await response.json();
                    if(data.color_identity) {
                        setColorIdentity(data.color_identity.join("").toLowerCase());
                    }
                }
            } catch (err) {
                console.error("Error fetching deck colors:",err)
            }
        };
        fetchDeckColors();
    },[deckId,colorIdentity]);

const fetchSuggestions = useCallback(async (query) => {
    const cleanQuery = query ? query.trim() : "";
    if (cleanQuery.length < 2) {
        setSuggestions([]);
        return;
    }
    try{
        let identityFilter = "";
        if(filterByIdentity && colorIdentity){
            identityFilter = "identity:" + colorIdentity;  
        }
        const fullQuery = cleanQuery + identityFilter;
        const finalUrl = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(fullQuery)}`;
        const response = await fetch(finalUrl);
        const data = await response.json();


        if(data && data.data){
            const cardNames = data.data.map(function(card){return card.name;})
            const uniqueNames = Array.from(new Set(cardNames)).slice(0,10);
            setSuggestions(uniqueNames);
        } else {
            setSuggestions([])
        }
    } catch (err){
        console.error("Auto Complete Error:", err)
    }
}, [colorIdentity, filterByIdentity]);
    
    const timeoutRef = useRef(null);
    const handleInputChange = (e) => {
        const val = e.target.value;
        setCardQuery(val);

        if(timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(()=> fetchSuggestions(val),300)
    };
    const currentInDeckCount = selectedCard ? deckCountMap[selectedCard.id] || 0 : 0;
    return{
        cardQuery, setCardQuery,
        filterByIdentity,setFilterByIdentity,
        suggestions,setSuggestions,
        loading,setLoading,
        error,setError,
        handleInputChange,
        deckId,
        sameNameCard,setSameNameCard,
        selectedCard,setSelectedCard,
        handleArtworkClick,
        deckCountMap,
        cameFromDeck,
        currentInDeckCount,
        handleAddClick,
    };
};