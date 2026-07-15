import Storage from "../modules/Storage";
import Navigation from "../modules/Navigation";
import PublicDeckDisplay from "./PublicDeckDisplay";
import "../styles/Dashboard.css";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import Gradient from "../modules/Gradient";
import TextPhaser from "../modules/TextPhaser";
import Dice from "./Dice";
import Players from "./Players";
import Logo from '../photos/logo.2.png'

function Dashboard() {
  const [game, setGame] = useState(false);
  const wubrgPhrases = [
    { type: "symbol", value: "ms-w" },
    { type: "symbol", value: "ms-u" },
    { type: "symbol", value: "ms-b" },
    { type: "symbol", value: "ms-r" },
    { type: "symbol", value: "ms-g" },
    { type: "symbol", value: "ms-c" },
  ];

  return (
    <Gradient className="dashboard">
      {/* Top Bar for Logo and Mana Symbols */}
      <header className="dashboard_topBar">
        <div className="dashboard_Logo">
        <img className="dashboard_Logo" src={Logo} alt="Deckbox Logo" />
        </div>
        <div className="dashboard_symbols">
          <TextPhaser phrases={wubrgPhrases} />
        </div>
      </header>

      {/* Hero Section: Centered Heading & Moxfield-style Search */}
      <main className="dashboard_heroSection">
        <div className="dashboard_heroText">
          <h1 className="dashboard_header">Welcome to Deckbox</h1>
          <p className="dashboard_subHeader">Search cards, build decks, craft strategies.</p>
        </div>
        
        <div className="dashboard_searchContainer">
          <Storage /> 
        </div>
      </main>

      {/* Community Section */}
      <section className="dashboard_communitySection">
        <h2 className="section_title">Community Decks</h2>
        <div className="dashboard_container-public">
          <PublicDeckDisplay />
        </div>
      </section>
    </Gradient>
  );
}

export default Dashboard;
