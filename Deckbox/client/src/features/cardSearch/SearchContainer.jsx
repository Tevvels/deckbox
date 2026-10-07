import React,{useContext} from 'react'
import { useLocation } from 'react-router-dom';
import SearchInputForm from './SearchInputForm';
import SearchResultsGrid from './SearchResultsGrid';
import { CardSearchProvider } from '../../hooks/useCardSearch';
import '../../styles/Search.css';


function SearchContainer() {
    const {search} = useLocation();
    const queryParams = new URLSearchParams(search);
    const hasQuery = Boolean(queryParams.get("q"));


    return (
        <CardSearchProvider>
            <SearchInputForm />
            {hasQuery ? <SearchResultsGrid  searchString={search}/>:(
                <div className="search-welcome-msg">
                    <p>search for a new card</p>
                </div>
            )}
        
        </CardSearchProvider>


    )
}

export default SearchContainer