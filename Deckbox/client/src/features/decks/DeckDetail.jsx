import React,{useState,useMemo} from 'react';
// import "../styles/CardDetail.css";
// import "../styles/myDecks.css";

import DeckList from './DeckList';
import DeckOverview from './DeckOverview';
import Tokens from  './Tokens'


const getSortedGroups = (cards,sortBy,subSortBy) =>{
    const filteredList = cards.filter((entry)=>entry?.cardId);
    let groups = {};
    if(sortBy === 'none'){
        groups = {"All Cards:": filteredList};
    } else {
        groups = filteredList.reduce((acc,entry)=>{
            const card = entry.cardId;
            const category = [
                "creature","planeswalker","instant","sorcery","enchantment","artifact","battle","land"
            ].find((t)=>card.type_line?.toLowerCase().includes(t)) ||"other";
            (acc[category] = acc[category] || []).push(entry);
            return acc;
        },{})
    }


Object.keys(groups).forEach((category)=>{
    groups[category].sort((a,b)=>{
        const cardA = a.cardId;
        const cardB = b.cardId;

        if(subSortBy === "cmc"){
            return (cardA.cmc || 0) - (cardB.cmc || 0) || cardA.name.localeCompare(cardB.name);
        } 
        if(subSortBy === "value"){
            const priceA = parseFloat(cardA.prices?.usd || 0);
            const priceB = parseFloat(cardB.prices?.usd || 0);
            return priceB - priceA || cardA.name.localeCompare(cardB.name);
        }
        return cardA.name.localeCompare(cardB.name); 
    });
});
return groups;
}
const MANA_TYPES = ["W","U","B","R","G","C"];


export default function DeckDetail({    cards =[],
    isOwner,
    name,
    onCardClick,
    onDeleteCard,
    format,
    deckMetrics,
cardPreview,
setCardPreview}) {

        const [activeTab,setActiveTab] = useState("decklist");
        const [sortBy,setSortBy] = useState("type");
        const [subSortBy,setSubSortBy] = useState("name");

        const sortedCards = useMemo(()=>{
            return getSortedGroups(cards,sortBy,subSortBy);
        },[cards,sortBy,subSortBy]);


    return (
    <div className='deck-page-layout'>
        <header className='deck-page-navigation'>
            <h1 className='deck-page-title'>
                {name}<span className="format-tag">{format}</span>
            </h1>
            <div className="tab-navigation">
                <button className={activeTab === "overview" ? "active" : ""} onClick={()=>setActiveTab("overview")}>overview</button>
            </div>
        </header>
        <main className='deck-page-content'>
                <DeckOverview
                    name={name}
                    format={format}
                    deckMetrics={deckMetrics}
                    commanderCard={deckMetrics?.commander || cards[0]?.cardId}
                    />
                <DeckList
                 sortedCards={sortedCards}
                 sortBy={sortBy}
                 setSortBy={setSortBy}
                 subSortBy={subSortBy}
                 setSubSortBy={setSubSortBy}
                 isOwner={isOwner}
                 onCardClick={onCardClick}
                 cardPreview={cardPreview}
                 setCardPreview={setCardPreview}
                 onDeleteCard={onDeleteCard}
                 manaTypes={MANA_TYPES}
                 />

                <Tokens  sortedCards={sortedCards} />
        </main>

    </div>
  )



}
