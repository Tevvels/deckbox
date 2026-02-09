import React , {useState,useEffect,useMemo} from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';


function SearchResults({addCardToDeck, currentDeckList =[]}) {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || "";
    const deckId = searchParams.get('deckId');
    const [results ,setResults] = useState([]);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleAddClick = async() =>{
    if(card || !deckId) {
        try{
            // Sync card details to your backend database
            const syncResponse = await fetch(`${API_BASE}/cardStorage/sync-card`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                },
                body: JSON.stringify(card),
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

            addCardToDeck({mongoId, name: card.name})

        } catch(error){
            console.error("error during card sync:" ,error); 
            setError(error);
        }
    }
};

const deckCountMap = useMemo(() => {
  
const countMap = {};
        if (Array.isArray(currentDeckList)) {
            currentDeckList.forEach(entry => {
                const name = entry.cardId?.name || entry.name;
                if (name) {
                    const qty = entry.quantity || 1;
                    countMap[name] = (countMap[name] || 0) + qty;
                }
            });
        }
        return countMap;
}, [currentDeckList]);



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
    const fetchResults = async()=>{
        if(!query) return;
        setLoading(true);
        try{
            const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
                setResults(data.data ||[]); 
        
        
        } catch(err){
            console.error('search error',err);
        } finally {
        
            setLoading(false);
        }
    };
    fetchResults();
},[query]);    

const handleAddCard = async (card) => {
    // implement add to deck logic
    if(!card || !deckId) return;
    
    setLoading(true);
    try{
        const syncResponse = await fetch(`${API_BASE}/cardStorage/sync-card`,{
            method: 'POST',
            headers:{
                'Content-Type': "application/json",
                'Authorization':`Bearer ${localStorage.getItem('userToken')}`
            },
            body:JSON.stringify(card)
        });
            const {mongoId} = await syncResponse.json();

        const addCardResponse = await fetch(`${API_BASE}/cardStorage/${deckId}/add-card`,{
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem('userToken')}` 
            },
            body: JSON.stringify({cardId: mongoId}),
        });

        if(syncResponse.ok){
            
            addCardToDeck({mongId, name: card.name});
        }
        alert(`${card.name}  added!`)
    }catch (error){
        console.error("Add Error:",error);

    } finally{
        setLoading(false)
    }
}


    return (
    <div>
        <button onClick={()=> navigate(-1)}>Back to search</button>
        <h2>{query}</h2>
        <div className='card'>
     {results.map((card)=>{
        const countInDeck = deckCountMap[card.name] || 0;
        return (
            <div key={card.id} className="cardItem">
                <div className='card-image-container'>
                    <img
                    src={card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal}
                    alt={card.name}
                    />
                    {countInDeck > 0 && <span className='deck_count'>{countInDeck}</span>}
                </div>
                <button onClick={()=> handleAddCard(card)}>Add</button>
                </div>
        )
    })}

        </div>

        {results.length === 0 && !loading && <p>no cards founds</p> }

    </div>

  )
}

export default SearchResults