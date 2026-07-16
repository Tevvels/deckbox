import React, { useState, useMemo, useEffect, use } from "react";
import "../styles/CardDetail.css";
import "../styles/MyDecks.css";
import Gradient from "../modules/Gradient";
import { useTokens } from "../modules/Tokens";
import CardDetail from "../modules/CardDetail";

const MANA_TYPES = ["W", "U", "B", "R", "G", "C"];

function DeckDetail({
  cards = [],
  isOwner,
  name,
  onCardClick,
  OnDeleteCard,
  format,
}) {
  const [sortBy, setSortBy] = useState("type");
  const [subSortBy,setSubSortBy]=useState("name")
  const [cardPreview, setCardPreview] = useState(null);
  const [withImage, setWithImage] = useState(false);

  // Sorts the cards.
  const sortedCards = useMemo(() => {
    const filteredList = cards.filter((entry)=> entry?.cardId)

    let groups = {};
    if(sortBy ==="none"){
      groups = {"All Cards": filteredList};
    } else {
      groups = filteredList.reduce((acc,entry)=>{
        const card = entry.cardId;
        const category = [
          "creature",
          "planeswalker",
          "instant",
          "sorcery",
          "enchantment",
          "artifact",
          "battle",
          "land",
        ].find((t)=> card.type_line?.toLowerCase().includes(t)) || "other";

        (acc[category] = acc[category] || []).push(entry);
        return acc;
      },{});
    }

   Object.keys(groups).forEach((category)=>{
    groups[category].sort((a,b)=>{
      const cardA = a.cardId;
      const cardB = b.cardId;
      if(subSortBy === "cmc"){
        return (cardA.cmc || 0) - (cardB.cmc || 0) || cardA.name.localeCompare(cardB.name);
      }
      if(subSortBy === "value"){
        const priceA = parseFloat(cardA.prices?.usd || 0)
        const priceB = parseFloat(cardB.prices?.usd || 0);
        return priceB - priceA || cardA.name.localeCompare(cardB.name);

      }
      return cardA.name.localeCompare(cardB.name);
    });
   });
   return groups;
  },[cards,sortBy,subSortBy]);
console.log(cards)
  const tokens = useTokens(sortedCards);

  const deckMetrics = useMemo(() => {
    const init = {
      counts: {
        total: 0,
        creature: 0,
        planeswalker: 0,
        artifact: 0,
        enchantment: 0,
        instant: 0,
        sorcery: 0,
        battle: 0,
        land: 0,
      },
      mana: { cmc: 0, W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 },
      colors: new Set(),
    };


    cards.forEach(({ cardId: card, quantity = 1 }) => {
      if (!card) return;

      //counts the cards types
      const type = card.type_line.toLowerCase();
      const qty = Number(quantity);
      init.counts.total += qty;
      const mainType =
        [
          "creature",
          "planeswalker",
          "artifact",
          "enchantment",
          "sorcery",
          "instant",
          "battle",
          "land",
        ].find((t) => type.includes(t)) || "other";
      init.counts[mainType] += qty;

      card.color_identity?.forEach((c) => init.colors.add(c));
      const cost =
        card.mana_cost ||
        card.card_faces?.map((f) => f.mana_cost).join("") ||
        "";
      const costString =
        card.mana_cost ||
        card.card_faces?.map((f) => f.mana_cost).join("") ||
        "";
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
      setCardPreview(
        cards.find((e) => e.cardId?.name === name)?.cardId || cards[0].cardId,
      );
    }
  }, [cards, name]);
  return (
    <div className="deck">
      <div className="deck_container">
    
        {format ===  "Commander" && cards[0]?.cardId && (
          <div className="deck_commander">
            <h3 className="deck_commander-name">{cards[0].cardId.name}</h3>
            <img
              className="card deck_commander-img"
              src={
                cards[0].cardId.image_uris?.normal ||
                "https://via.placeholder.com/300"
              }
              alt={cards[0].cardId.name}
            />
            <p className="deck_commander-type">{cards[0].cardId.type_line}</p>
            <p className="deck_commander-oracle">{cards[0].cardId.oracle_text}</p>
            </div>)}
      <Gradient className="deck_container-stats">
          <div className="deck_header">{name}</div>
        <div className="mana_symbols-stats">
          {MANA_TYPES.map((m) => (
            <span
              key={m}
              className={`mana_symbol ${deckMetrics.colors.has(m) ? "active" : "inactive"}`}
            >
              <i className={`ms ms-${m.toLowerCase()} ms-cost ms-span`} />{" "}
              {deckMetrics.mana[m]}
            </span>
          ))}
        </div>
        <div className="stats_header">
          <h3>statistics</h3>
          <span>{format}</span>
        </div>
        <div className="type_count">
          {Object.entries(deckMetrics.counts).map(
            ([type, count]) =>
              count > 0 && (
                <p key={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}:{count}
                </p>
              ),
          )}
        </div>
      </Gradient>
    


        <ul className={`deck_list  ${sortBy}`}>
                  <div className="sort_controls">
          <div className="control_group">
            <span className="control_label">Group By:</span>
            {["type","none"].map((s)=>(
              <button key={s} className={`buttons ${sortBy === s ? "active_sort":""}`}></button>
            ))}
          </div>


    
          <button
            className="buttons buttons_imageToggle"
            onClick={() => setWithImage((w) => !w)}
          >
            {withImage ? "Hide Images" : "Show Images"}
          </button>
        </div>
          {/* // iterating over the sorted cards and displaying them by category. */}
          {Object.entries(sortedCards).map(([category, entries]) => (
            <Gradient className={`sort_order ${category.replaceAll(" ", "")}`}>
              <li className={`deck_list-item`} key={category}>
                <h3 className="deck_header-sub">
                  {category}(
                  {entries.reduce((sum, i) => sum + (i.quantity || 1), 0)})
                </h3>
                <ul className="card_list">
                  {entries.map((entry) => {
                    const isLandCard = entry.cardId.type_line
                      ?.toLowerCase()
                      .includes("land");
                    return (
                      <li
                        key={entry._id}
                        className="card_list-item"
                        onClick={() => onCardClick(entry.cardId)}
                        onMouseEnter={() => setCardPreview(entry.cardId)}
                      >
                        {withImage && (
                          <img
                            className="card card_entry-image"
                            src={
                              entry.cardId.image_uris?.normal ||
                              entry.cardId.card_faces?.[0]?.image_uris?.normal
                            }
                            alt={entry.cardId.name}
                          />
                        )}
                        {!withImage && <h3>{entry.cardId.name}</h3>}
                        {!withImage && !isLandCard && (
                          <div>
                            {entry.cardId.mana_cost ? (
                              entry.cardId.mana_cost.split("}{").map((s, i) => {
                                const symbol = s
                                  .replaceAll("{", "")
                                  .replaceAll("}", "");
                                return (
                                  <span
                                    key={i}
                                    className={`mana_symbol ${MANA_TYPES.includes(symbol) ? "active" : "inactive"}`}
                                  >
                                    <i
                                      className={`ms ms-${symbol.toLowerCase()} ms-cost ms-span`}
                                    />
                                  </span>
                                );
                              })
                            ) : (
                              <span className="mana_symbol inactive">
                                <i className={`ms ms-c ms-cost ms-span`} />
                              </span>
                            )}
                          </div>
                        )}
                        x {entry.quantity}
                        {isOwner && (
                          <button
                            className="buttons buttons_delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              OnDeleteCard(entry.cardId._id);
                            }}
                          >
                            X
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            </Gradient>
          ))}
        </ul>

      <Gradient className="deck_container-token">
        <h3>Tokens</h3>
        <div className="tokens_container">
          {tokens?.length > 0 ? (
            tokens.map((token, index) => (
              <div key={index} className="token ">
                <p>{token.name}</p>
                <img
                  className="card"
                  src={token.image_uris?.small || token.image_uris?.normal}
                  alt={token.name}
                />
              </div>
            ))
          ) : (
            <p>No tokens in this deck</p>
          )}
        </div>
      </Gradient>

      <Gradient className="deck_container-preview">
        {cardPreview ? (
          <div className="card_preview">
            <div className="card_preview-a">
            <CardDetail card={cardPreview}/>

            </div>
            <div className="card_preview-b">
              <p>change art?</p>
              <button>click here</button>
            </div>
          </div>
        ) : (
          <p>Hover over a card to see details</p>
        )}
      </Gradient>

      </div>



    </div>
  );
}

export default DeckDetail;
