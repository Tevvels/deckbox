import React from "react";
import { Link } from "react-router-dom";
import "../styles/MyDecks.css";

// 1. Define the color map
const getColorIdentity = (char) => {
  const colorMap = {
    W: "#fdf1a2",
    U: "#00a2e8",
    B: "#000000",
    R: "#e3312b",
    G: "#00a650",
    C: "#a9a9a9",
  };
  return colorMap[char?.toUpperCase()] || "#a9a9a9";
};

// 2. Define the individual pip style helper
const getPipStyle = (color) => {
  return { backgroundColor: getColorIdentity(color) };
};

// 3. Define the main gradient logic helper
const getDeckColorIdentity = (colorIdentity) => {
  if (!colorIdentity || colorIdentity.length === 0)
    return { backgroundColor: "#a9a9a9" };

  const wubrgOrder = ["W", "U", "B", "R", "G", "C"];
  const sortedIdentity = [...colorIdentity].sort((a, b) => {
    return wubrgOrder.indexOf(a) - wubrgOrder.indexOf(b);
  });

  if (sortedIdentity.length === 1) {
    return { backgroundColor: getColorIdentity(sortedIdentity[0]) };
  }

  const sectionWidth = 100 / sortedIdentity.length;
  const gradientStops = sortedIdentity
    .map((char, index) => {
      const color = getColorIdentity(char);
      const start = index * sectionWidth;
      const end = (index + 1) * sectionWidth;
      return `${color} ${start}%, ${color} ${end}%`;
    })
    .join(", ");

  return { background: `linear-gradient(110deg, ${gradientStops})` };
};

// 4. The Component
function DeckCard({ deck, onDelete, showOwner = false, className }) {
  // Now these functions are defined and accessible
  const colorIdentityStyle = getDeckColorIdentity(deck.color_identity);
  const validCards = deck.cards?.filter((c) => c && c.cardId) || [];
  const firstCard = validCards.length > 0 ? validCards[0].cardId : null;

  const imageUrl =
    firstCard?.image_uris?.art_crop ||
    firstCard?.card_faces?.[0]?.image_uris?.art_crop ||
    "placeholder_url";

  const artistName =
    firstCard?.artist || firstCard?.card_faces?.[0]?.artist || "Unknown Artist";

  const copyrightText = `™ & © Wizards of the Coast`;

  return (
    <div className={`deck_card-container ${className}`}>
      <Link className="deck_card-link" to={`/deck/${deck._id}`}>
        <div className="deck_card-content">
          <div className="deck_card-art-wrapper">
            <img className="deck_card-art" alt="deckArt" src={imageUrl} />
            
            {/* The WUBRG gradient bar */}
            

            <div className="deck_card-subcontainer">
              <div className="deck-card-info">
                <div className="deck_card-header">
                  <h3 className="deck_card-name">{deck.name}</h3>
                  <div className="deck_mana-symbols">
                    {deck.color_identity?.map((color) => (
                      <div 
                        key={color} 
                        className={`ms ms-${color.toLowerCase()} ms-cost mana-icon`} 
                        title={color}                        
                      >
                        {color}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="deck_card-stats">{deck.format} • {deck.cards.length} Cards</p>
              </div>

              <div className="deck_card-footer">
                <div className="deck_card-artist">
                  <span>Art by: {artistName}</span>
                  <br />
                  <span className="deck_card-copyright">{copyrightText}</span>
                </div>
                {onDelete && (
                  <button 
                    className="buttons buttons_delete" 
                    onClick={(e) => { e.preventDefault(); onDelete(deck._id); }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// 5. The Default Export
export default DeckCard;
