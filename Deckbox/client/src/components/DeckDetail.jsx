import React, { useState, useMemo, useEffect } from "react";
import "../styles/CardDetail.css";
import "../styles/MyDecks.css";

// Page Views
import DecklistPage from "./Decklist";
import DeckOverviewPage from "./DeckOverview";
import TokensPage from "./Tokens";

const MANA_TYPES = ["W", "U", "B", "R", "G", "C"];

export default function DeckDetailPage({
  cards = [],
  isOwner,
  name,
  onCardClick,
  OnDeleteCard,
  format,
}) {
  const [activeTab, setActiveTab] = useState("decklist"); // Options: "overview", "decklist", "tokens"
  const [sortBy, setSortBy] = useState("type");
  const [subSortBy, setSubSortBy] = useState("name");
  const [cardPreview, setCardPreview] = useState(null);

  // --- Data Crunching & Sorting Logic ---
  const sortedCards = useMemo(() => {
    const filteredList = cards.filter((entry) => entry?.cardId);
    let groups = {};

    if (sortBy === "none") {
      groups = { "All Cards": filteredList };
    } else {
      groups = filteredList.reduce((acc, entry) => {
        const card = entry.cardId;
        const category =
          [
            "creature",
            "planeswalker",
            "instant",
            "sorcery",
            "enchantment",
            "artifact",
            "battle",
            "land",
          ].find((t) => card.type_line?.toLowerCase().includes(t)) || "other";

        (acc[category] = acc[category] || []).push(entry);
        return acc;
      }, {});
    }

    Object.keys(groups).forEach((category) => {
      groups[category].sort((a, b) => {
        const cardA = a.cardId;
        const cardB = b.cardId;
        if (subSortBy === "cmc") {
          return (cardA.cmc || 0) - (cardB.cmc || 0) || cardA.name.localeCompare(cardB.name);
        }
        if (subSortBy === "value") {
          const priceA = parseFloat(cardA.prices?.usd || 0);
          const priceB = parseFloat(cardB.prices?.usd || 0);
          return priceB - priceA || cardA.name.localeCompare(cardB.name);
        }
        return cardA.name.localeCompare(cardB.name);
      });
    });
    return groups;
  }, [cards, sortBy, subSortBy]);

  const deckMetrics = useMemo(() => {
    const init = {
      counts: { total: 0, creature: 0, planeswalker: 0, artifact: 0, enchantment: 0, instant: 0, sorcery: 0, battle: 0, land: 0 },
      mana: { cmc: 0, W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 },
      colors: new Set(),
    };

    cards.forEach(({ cardId: card, quantity = 1 }) => {
      if (!card) return;
      const type = card.type_line.toLowerCase();
      const qty = Number(quantity);
      init.counts.total += qty;

      const mainType = [
        "creature", "planeswalker", "artifact", "enchantment", "sorcery", "instant", "battle", "land"
      ].find((t) => type.includes(t)) || "other";

      if (init.counts[mainType] !== undefined) init.counts[mainType] += qty;
      card.color_identity?.forEach((c) => init.colors.add(c));
      
      const costString = card.mana_cost || card.card_faces?.map((f) => f.mana_cost).join("") || "";
      const symbols = costString.match(/\{([^}]+)\}/g);

      if (symbols) {
        symbols.forEach((s) => {
          const core = s.slice(1, -1);
          MANA_TYPES.forEach((color) => {
            if (core.includes(color)) init.mana[color] += qty;
          });
        });
      } else if (!type.includes("land")) {
        init.mana.C += qty;
      }
    });

    if (init.colors.size === 0) init.colors.add("C");
    return init;
  }, [cards]);

  useEffect(() => {
    if (cards.length > 0 && !cardPreview) {
      const initialCard = cards.find((e) => e.cardId?.name === name)?.cardId || cards[0].cardId;
      setCardPreview(initialCard);
    }
  }, [cards, name, cardPreview]);

  return (
    <div className="deck-page-layout">
      {/* Sub-Navigation Header Bar */}
      <header className="deck-page-navigation">
        <h1 className="deck-page-title">{name} <span className="format-tag">{format}</span></h1>
      
      </header>

      {/* Dynamic Sub-Page Routing Window */}
      <main className="deck-page-content">
       
          <DeckOverviewPage 
            name={name} 
            format={format} 
            deckMetrics={deckMetrics} 
            commanderCard={cards[0]?.cardId} 
          />

          <DecklistPage 
            sortedCards={sortedCards}
            sortBy={sortBy}
            setSortBy={setSortBy}
            subSortBy={subSortBy}
            setSubSortBy={setSubSortBy}
            isOwner={isOwner}
            onCardClick={onCardClick}
            setCardPreview={setCardPreview}
            OnDeleteCard={OnDeleteCard}
            cardPreview={cardPreview}
            manaTypes={MANA_TYPES}
          />

          <TokensPage sortedCards={sortedCards} />
      </main>
    </div>
  );
}
