import React, { useState } from "react";
import Gradient from "../modules/Gradient";
import CardDetail from "../modules/CardDetail";

export default function DecklistPage({
  sortedCards,
  sortBy,
  setSortBy,
  subSortBy,
  setSubSortBy,
  isOwner,
  onCardClick,
  setCardPreview,
  OnDeleteCard,
  cardPreview,
  manaTypes,
}) {
  const [withImage, setWithImage] = useState(false);

  return (
    <div className="view-page decklist-split-view">
      <div className="decklist-main-column">
        {/* Sorting Controls */}
        <div className="sort_controls">
          <div className="control_group">
            <span className="control_label">Group By:</span>
            {["type", "none"].map((s) => (
              <button key={s} onClick={() => setSortBy(s)} className={`buttons ${sortBy === s ? "active_sort" : ""}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="control_group">
            <span className="control_label">Sort By:</span>
            {["name", "cmc", "value"].map((s) => (
              <button key={s} onClick={() => setSubSortBy(s)} className={`buttons ${subSortBy === s ? "active_sort" : ""}`}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>

          <button className="buttons buttons_imageToggle" onClick={() => setWithImage(!withImage)}>
            {withImage ? "Hide Images" : "Show Images"}
          </button>
        </div>

        {/* Card Loop */}
        <ul className={`deck_list ${sortBy}`}>
          {Object.entries(sortedCards).map(([category, entries]) => (
            <Gradient key={category} className={`sort_order ${category.replaceAll(" ", "")}`}>
              <li className="deck_list-item">
                <h3 className="deck_header-sub">{category} ({entries.reduce((sum, i) => sum + (i.quantity || 1), 0)})</h3>
                <ul className="card_list">
                  {entries.map((entry) => {
                    const isLand = entry.cardId.type_line?.toLowerCase().includes("land");
                    const symbols = entry.cardId.mana_cost?.match(/\{([^}]+)\}/g) || [];

                    return (
                      <li key={entry._id} className="card_list-item" onClick={() => onCardClick(entry.cardId)} onMouseEnter={() => setCardPreview(entry.cardId)}>
                        {withImage ? (
                          <img className="card card_entry-image" src={entry.cardId.image_uris?.normal || entry.cardId.card_faces?.[0]?.image_uris?.normal} alt={entry.cardId.name} />
                        ) : (
                          <h3>{entry.cardId.name}</h3>
                        )}
                        {!withImage && !isLand && (
                          <div className="mana_cost_container">
                            {symbols.length > 0 ? symbols.map((s, i) => {
                              const sym = s.replace("{", "").replace("}", "");
                              return (
                                <span key={i} className={`mana_symbol ${manaTypes.includes(sym) ? "active" : "inactive"}`}>
                                  <i className={`ms ms-${sym.toLowerCase()} ms-cost ms-span`} />
                                </span>
                              );
                            }) : <span className="mana_symbol inactive"><i className="ms ms-c ms-cost ms-span" /></span>}
                          </div>
                        )}
                        <span className="card_quantity">x {entry.quantity}</span>
                        {isOwner && (
                          <button className="buttons buttons_delete" onClick={(e) => { e.stopPropagation(); OnDeleteCard(entry._id || entry.cardId.id); }}>X</button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            </Gradient>
          ))}
        </ul>
      </div>

      {/* Floating Art/Details Inspector Column */}
      <div className="decklist-preview-column">
        <Gradient className="deck_container-preview">
          {cardPreview ? (
            <div className="card_preview">
              <div className="card_preview-a"><CardDetail card={cardPreview} /></div>
              <div className="card_preview-b"><p>change art?</p><button>click here</button></div>
            </div>
          ) : (
            <p>Hover over a card to see details</p>
          )}
        </Gradient>
      </div>
    </div>
  );
}
