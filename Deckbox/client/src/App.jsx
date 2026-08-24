import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import MyDecks from "./components/MyDecks";
import CreateNewDeck from "./components/CreateNewDeck";
import Players from "./components/Players";
import SingleDeck from "./components/SingleDeck";
import Storage from "./modules/Storage.jsx";
import PublicDeckDisplay from "./components/PublicDeckDisplay.jsx";
import "./styles/GridDisplay.css";
import Footer from "./modules/Footer.jsx";
import Navigation from "./modules/Navigation.jsx";
import SearchResults from "./components/SearchResults.jsx";
import "mana-font/css/mana.min.css";
import "./styles/Layout.css";
import Gradient from "./modules/Gradient.jsx";
import "./styles/Deck.css";
import "./styles/Dice.css";
import "./styles/Menu.css";
import Deck from "./features/decks/Deck.jsx";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function App() {
  // manage authentication state
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const [authView, setAuthView] = useState("login"); // login | register | forgot
  // manage deck/card storage state
  const [cardStorage, setCardStorage] = useState([]);
  const [activeDeckCards, setActiveDeckCards] = useState([]);
  const [activeDeck, setActiveDeck] = useState([]);
  // stored cards from backend
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);
  // handle login by setting token state and saving to localStorage
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };
  // handle logout by clearing token state and removing from localStorage
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const addCardToActiveDeck = ({ mongoId, name }) => {
    const newcardEntry = {
      cardId: { _id: mongoId, name: name },
      quantity: 1,
    };
    setActiveDeck((prevDeck) => {
      const existingCards = prevDeck && prevDeck.cards ? prevDeck.cards : [];
      return {
        ...prevDeck,
        cards: [...existingCards, newcardEntry],
      };
    });
    console.log(`${name} has been added to the active deck`);
  };

  const cardAdded = (cardInfo) => {
    setActiveDeckCards((prevDeck) => [...prevDeck, cardInfo]);
    console.log(`${cardInfo.name} has been added`);
  };

  const showLogin = () => setAuthView("login");
  const showRegister = () => setAuthView("register");
  const showForgot = () => setAuthView("forgot");

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_BASE}/cardStorage`)
      .then((response) => setCardStorage(response.data))
      .catch((error) => console.error(error));
  }, [token]);
  const addItem = (newItem) => {
    setCardStorage((prev) => [...prev, newItem]);
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE}/cardStorage/${id}`);
      setCardStorage((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateItem = async (id, patch) => {
    try {
      const res = await axios.put(`${API_BASE}/cardStorage/${id}`, patch);
      setCardStorage((prev) => prev.map((c) => (c._id === id ? res.data : c)));
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <Gradient className={"App"}>
      <main>
        <Navigation isLoggedIn={!!token} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Dashboard isLoggedIn={!!token} />} />
          <Route path="/publicdecks" element={<PublicDeckDisplay />} />
          if(!token) {
          <>
            <Route path="/register" element={<Register onShowLogin={showLogin} />} />
            <Route path="/forgot" element={<ForgotPassword onShowLogin={showLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} onShowRegister={showRegister} onShowForgot={showForgot} />} />
          </>
          }
          <Route path="/profile" element={<div>Profile Page</div>} />
          <Route path="/settings" element={<div>Settings Page</div>} />
          <Route path="/deck/" element={<MyDecks />} />
          <Route path="/deck/new" element={<CreateNewDeck onAdd={addItem} />} />
          <Route path="/players" element={<Players />} />
          <Route path="/mydecks" element={<MyDecks />} />
          <Route path="/refractor" element={<Deck />} />
          <Route
            path="/login"
            element={
              <Login
                onLogin={handleLogin}
                onShowRegister={showRegister}
                onShowForgot={showForgot}
              />
            }
          />
          <Route
            path="/storage"
            element={
              <Storage
                addCardToDeck={cardAdded}
                deckCards={activeDeck?.cards || []}
              />
            }
          />
          <Route
            path="/deck/:deckId"
            element={<Deck deck={activeDeck} setDeck={setActiveDeck} />}
          />
          
          <Route
            path="/deck/:deckId/search"
            element={
              <Storage
                addCardToDeck={addCardToActiveDeck}
                currentDeckList={activeDeck?.cards || []}
              />
            }
          />
          <Route path="/search" element={<SearchResults />} />
          <Route path="*" element={<Gradient>404 Not Found</Gradient>} />
        </Routes>
      </main>
      <Footer />
    </Gradient>
  );
}

export default App;
