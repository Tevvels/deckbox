import React from "react";

const MANA_TYPES = ["W", "U", "B", "R", "G", "C"];

export default function DeckOverviewPage({ name, format, deckMetrics, commanderCard }) {
  return (
    <>
      {format === "Commander" && commanderCard && (
        <section className="deck-commander">
          <img
            className="card deck-commander-img"
            src={commanderCard.image_uris?.normal || "https://placeholder.com"}
            alt={commanderCard.name}
          />
          <h3 className="deck-commander-name">{commanderCard.name}</h3>
          <p className="deck-commander-type">{commanderCard.type_line}</p>
          <p className="deck-commander-oracle">{commanderCard.oracle_text}</p>
        </section>
      )}

      <section className="deck-container-stats">
        <div className="deck_header">{name}</div>
        <div className="mana_symbols-stats">
          {MANA_TYPES.map((m) => {
            const totalManaCount = Object.values(deckMetrics.mana).reduce((a, b) => a + b, 0) || 1;
            const barHeightPercent = (deckMetrics.mana[m] / totalManaCount) * 100;
            return (
              <div key={m} className="mana_graph-column">
                <div
                  className="graph_bar"
                  style={{ height: `${barHeightPercent}%` }}
                />
                <span className={`mana_symbol `}>
                  <i className={`ms ms-${m.toLowerCase()} ms-cost ms-span ${deckMetrics.colors.has(m) ? "active" : "inactive"}`} />{" "}
                  {deckMetrics.mana[m]} ({barHeightPercent.toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>
          <div className="format">
            {format}
          </div>
        <div className="type_count">
          {Object.entries(deckMetrics.counts).map(([type, count]) => (
            count > 0 && (
              <p className={`stat stat_${type}`} key={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}: {count}
              </p>
            )
          ))}
        </div>
      </section>
    </>
  );
}
