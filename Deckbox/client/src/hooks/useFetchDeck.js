import {useState, useEffect} from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
export function useFetchDeck(deckId,setDeck) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if(!deckId) return;
        const loadDeckData = async () => {
            setIsLoading(true);
            setIsOwner(false);
            setError(null);
            const token = localStorage.getItem("token");
            const currentUser = JSON.parse(localStorage.getItem("user"));
            let data = null;

            try {
                if (token) {
                    try {
                        const privRes = await fetch(`${API_BASE}/cardStorage/${deckId}`,{
                            headers: {Authorization: `Bearer ${token}`},
                            
                        });
                        if(privRes.ok){
                            data = await privRes.json();
                            setIsOwner(true);
                        }
                    } catch(e){
                        console.error(`Error fetching private deck: ${e}`);
                    }
                }
                if(!data){
                    const pubRes = await fetch (`${API_BASE}/cardStorage/public/${deckId}`);
                    if(!pubRes.ok) throw new Error("Deck not found");
                    data = await pubRes.json();
                    if (currentUser && data.user) {
                        const deckUserId = data.user._id || data.user;
                        if(deckUserId.toString()=== currentUser.id.toString()){
                            setIsOwner(true);
                        }
                    }
                }
                setDeck(data);
            } catch (err) {
                console.error(`Fetch deck hook error: ${e}`);
                setError(err.message);
                setDeck(null);

            } finally {
                setIsLoading(false);
            }
        };
        loadDeckData();
    },[deckId,setDeck]);
    return {isLoading,error,isOwner};
}