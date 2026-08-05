import React from "react";
import Gradient from "../modules/Gradient";

const MANA_TYPES = ["W", "U", "B", "R", "G", "C"];

export default function DeckOverviewPage({ name, format, deckMetrics, commanderCard }) {
  return (
    <div className="view-page overview-view">
      {format === "Commander" && commanderCard && (
        <div className="deck_commander">
          <h3 className="deck_commander-name">{commanderCard.name}</h3>
          <img
            className="card deck_commander-img"
            src={commanderCard.image_uris?.normal || "https://placeholder.com"}
            alt={commanderCard.name}
          />
          <p className="deck_commander-type">{commanderCard.type_line}</p>
          <p className="deck_commander-oracle">{commanderCard.oracle_text}</p>
        </div>
      )}

      <Gradient className="deck_container-stats">
        <div className="deck_header">{name} Distribution</div>
        <div className="mana_symbols-stats">
          {MANA_TYPES.map((m) => {
            const totalManaCount = Object.values(deckMetrics.mana).reduce((a, b) => a + b, 0) || 1;
            const barHeightPercent = (deckMetrics.mana[m] / totalManaCount) * 100;
            return (
              <div key={m} className="mana_graph-column">
                <div
                  className={`ms ms-${m.toLowerCase()} ms-cost ms-span graph_bar ${deckMetrics.colors.has(m) ? "active" : "inactive"}`}
                  style={{ height: `${barHeightPercent}%` }}
                ></div>
                <span className={`mana_symbol ${deckMetrics.colors.has(m) ? "active" : "inactive"}`}>
                  <i className={`ms ms-${m.toLowerCase()} ms-cost ms-span`} />{" "}
                  {deckMetrics.mana[m]} ({barHeightPercent.toFixed(1)}%)
                </span>
              </div>
            );
          })}
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
      </Gradient>
    </div>
  );
}
