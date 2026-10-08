import React,{useState,useEffect} from 'react'
import { useCardSearch } from '../../hooks/useCardSearch';
import Skeleton from '../../components/Skeleton'
import PrintedCardItem from './PrintedCardItem';
import CardDetail from '../../modules/CardDetail';
// import PrintedCardItem from './PrintedCardItem'

const INITIAL_VISIBLE_COUNT = 15;


function SearchResultsGrid({searchString}) {

    const {
        loading,
        setLoading,
        error,
        setError,
        sameNameCard,
        setSameNameCard,
        selectedCard,
        setSelectedCard,
        deckCountMap,
        colorIdentity,
        addCard,filterByIdentity
    } = useCardSearch();
    

    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    useEffect(()=>{
        if(filterByIdentity && colorIdentity === null) return;

        const queryParams = new URLSearchParams(searchString);
        const cardQuery = queryParams.get("q");

        if(!cardQuery) return;

        const fetchCards = async ()=>{
            setLoading(true);
            setError(null);
            try {
                const identityConstraint = colorIdentity ?  
                `identity:${colorIdentity}` :"";
                const fullQuery = `${cardQuery} ${identityConstraint}`.trim();
                const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(fullQuery)}&unique=cards`;
                const response = await fetch(url);
                const data = await response.json();
                if(data?.data){
                    let results = data.data;

                    if(colorIdentity !==null){
                        const deckColors = colorIdentity.toLowerCase();
                         results = results.filter(card =>{
                            const cardColors = card.color_identity.join("").toLowerCase() || "";
                            return [...cardColors].every(c => deckColors.includes(c));
                         })
                    }
                    setSameNameCard(results);
                    setSelectedCard(results[0] || null);
                } else {
                    setSameNameCard([]);
                }
            } catch (err) {
             setError(err.message);
             }finally {
             setLoading(false)
             }
        }
            fetchCards();
    },[searchString,setLoading,setError,setSameNameCard,setSelectedCard]);

    if(loading) return <Skeleton className="searching"/>;
    if(error) return <div className="loading-error">Error: {error} </div>
    if (sameNameCard.length === 0) return null;


  return (
                <>
                    <div className="search-container-sub">
                    <div className="search-container-card"
                    style={{display:"flex", overflowX:"auto",padding:"10px"}}>

                        {sameNameCard.slice(0,visibleCount).map((card)=>(
                            <PrintedCardItem
                            key={card.id}
                            card={card}
                            onClick={()=>setSelectedCard(card)}
                            onAddClick={()=>addCard(card)}
                            isOwner={true}
                            isSelected={selectedCard?.id === card.id}
                            quantityInDeck={deckCountMap?.[card.name] || 0}
                            />
                        ))}
                    </div>
                    </div>

                    {sameNameCard.length > visibleCount && (
                        <button
                        className="buttons search-loadMore"
                        onClick={() => setVisibleCount(prev => prev === INITIAL_VISIBLE_COUNT? sameNameCard.length: INITIAL_VISIBLE_COUNT)}>{visibleCount === INITIAL_VISIBLE_COUNT? "load more" : "Show less"}</button>
                    )}
                    {selectedCard && <CardDetail card={selectedCard} />}
                </>



  );
}

export default SearchResultsGrid