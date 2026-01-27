import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'
import Dashboard from './components/Dashboard'
import { Routes,Route } from 'react-router-dom'
import MyDecks from './components/MyDecks'
import CreateNewDeck from './components/CreateNewDeck'
import Players from './components/Players'
import SingleDeck from './components/SingleDeck'
import Storage from './modules/Storage.jsx'
import PublicDeckDisplay from './components/PublicDeckDisplay.jsx'
import './styles/GridDisplay.css';
import Footer from './modules/Footer.jsx';
import Navigation from './modules/Navigation.jsx'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function App() {
  // manage authentication state
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [authView, setAuthView] = useState('login'); // login | register | forgot
  // manage deck/card storage state
  const [cardStorage, setCardStorage] = useState([]) 
  const [activeDeckCards,setActiveDeckCards] = useState([]);
  const [activeDeck,setActiveDeck] = useState([]);
  // stored cards from backend
  useEffect(()=>{
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);
// handle login by setting token state and saving to localStorage
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  }
// handle logout by clearing token state and removing from localStorage
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  }

  const addCardToActiveDeck = ({mongoId,name})=>{
    const newcardEntry = {
      cardId: {_id:mongoId,name:name},
      quantity: 1,
    };
    setActiveDeck(prevDeck => {
      const existingCards = prevDeck && prevDeck.cards ? prevDeck.cards : [];
      return {
        ...prevDeck,
        cards: [...existingCards, newcardEntry]
      };
    });
    console.log(`${name} has been added to the active deck` );
  }


  const cardAdded = (cardInfo) => {
    setActiveDeckCards(prevDeck => [...prevDeck,cardInfo])
    console.log(`${cardInfo.name} has been added` );
  }

  const showLogin = () => setAuthView('login');
  const showRegister = () => setAuthView('register');
  const showForgot = () => setAuthView('forgot');




  useEffect(()=>{
    axios.get(`${API_BASE}/cardStorage`)
    .then(response => setCardStorage(response.data))
    .catch(error => console.error(error));
  },[]);
  const addItem = (newItem)=> {
    setCardStorage(prev => [...prev, newItem]);
  }

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE}/cardStorage/${id}`);
      setCardStorage(prev => prev.filter(c => c._id !== id));
    } catch (err) { console.error(err) }
  }

  const updateItem = async (id, patch) => {
    try {
      const res = await axios.put(`${API_BASE}/cardStorage/${id}`, patch);
      setCardStorage(prev => prev.map(c => c._id === id ? res.data : c));
    } catch (err) { console.error(err) }
  }
  if (!token) {
    if (authView === 'register') return <Register onRegistered={(t)=>{handleLogin(t);}} onCancel={showLogin} />
    if (authView === 'forgot') return <ForgotPassword onDone={showLogin} onCancel={showLogin} onLogin={(t)=>handleLogin(t)} />
    return <div><Login onLogin={handleLogin} onShowRegister={showRegister} onShowForgot={showForgot} /></div>
  }

  return (
    <div className={"App"}>
      <main>
    <Navigation />
    <Routes>
      <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
      <Route path='/publicdecks' element={<PublicDeckDisplay/>}/>
      <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
      <Route path="/deck/" element={<MyDecks/>} />
      <Route path="/deck/new" element={<CreateNewDeck onAdd={addItem}/>} />
      <Route path="/players" element={<Players />} />
      <Route path="*" element={<div>404 Not Found</div>} />
      <Route path="/mydecks" element={<MyDecks />} />
      <Route path="/login" element={<Login onLogin={handleLogin} onShowRegister={showRegister} onShowForgot={showForgot} />} />
      <Route path="/storage" element={<Storage addCardToDeck={cardAdded} deckCards={activeDeck?.cards || []} />} />
      <Route path="/deck/:deckId" element={<SingleDeck deck={activeDeck} setDeck={setActiveDeck}/>} />
      <Route path="/deck/:deckId/search" element={<Storage addCardToDeck={addCardToActiveDeck} currentDeckList={activeDeck?.cards || []}/>} />   
    </Routes>
    </main>
    <Footer />
    </div>
  )
}

export default App
