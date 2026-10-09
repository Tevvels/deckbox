import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCardSearch } from '../../hooks/useCardSearch';

function SearchInputForm() {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const {
        cardQuery,
        setCardQuery,
        handleInputChange,
        suggestions,
        setSuggestions,
        colorIdentity,
        filterByIdentity,
        setFilterByIdentity,
    } =  useCardSearch();
    
    const handleSubmit = (e) =>{
        e.preventDefault();
        if(!cardQuery.trim()) return;

        const params = new URLSearchParams();
        params.append("q",cardQuery.trim());
        if(filterByIdentity && colorIdentity) {
            params.append("identity",colorIdentity);
        }
        setSuggestions([]);
        navigate(`${pathname}?${params.toString()}`);
    };
    

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <div className='search-wrapper'>
                <input 
                    type="text"
                    value={cardQuery}
                    className="search-searchbar"
                    onChange={handleInputChange}
                    placeholder={"..."}
                    />
                    {suggestions.length > 0 &&(
                        <ul className="suggestions-list">
                            {suggestions.map((name,index)=>(
                                <li 
                                key={index}
                                onClick={()=>{
                                    setCardQuery(name);
                                    setSuggestions([]);
                                }}>{name}</li>
                            ))}
                        </ul>
                    )}


            </div>
            <button className="buttons search-input" type="submit">Search</button>
        </form>
    )
}

export default SearchInputForm