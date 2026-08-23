import React from "react";
import { useTokens } from "../../hooks/useTokens";

export default function TokensPage({ sortedCards }) {
  const tokens = useTokens(sortedCards);
  

  return (
    <div className="view-page tokens-view">
        <h2>Tokens Required</h2>
        <div className="tokens_grid_layout">
          {tokens?.length > 0 ? (
            tokens.map((token, index) => (
              <div key={index} className="token-card-wrapper">
                <p className="token-name">{token.name}</p>
                <img
                  className="card token-img"
                  src={token.image_uris?.normal || token.image_uris?.small}
                  alt={token.name}
                />
              </div>
            ))
          ) : (
            <p className="no-tokens-msg">No tokens required for this deck configuration.</p>
          )}
        </div>
    </div>
  );
}
