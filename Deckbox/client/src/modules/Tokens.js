import { useState, useEffect } from "react";

export function useTokens(sortedCards) {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const fetchRelatedTokens = async () => {
      if (!sortedCards || Object.keys(sortedCards).length === 0) return;

      const allEntries = Object.values(sortedCards).flat();

      const uniqueNames = [
        ...new Set(allEntries.map((e) => e.cardId?.name).filter(Boolean)),
      ];
      if (uniqueNames.length === 0) return;

      try {
        const chunkSize = 75;
        const chunks = [];
        for (let i = 0; i < uniqueNames.length; i += chunkSize) {
          chunks.push(uniqueNames.slice(i, i + chunkSize));
        }

        let fullCards = [];
        for (const chunk of chunks) {
          const res = await fetch("https://api.scryfall.com/cards/collection", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifiers: chunk.map((name) => ({ name })),
            }),
          });
          const data = await res.json();
          if (data.data) fullCards = [...fullCards, ...data.data];
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        const tokenIds = new Set();
        const fallbackKeywords = new Set();

        fullCards.forEach((card) => {
          if (card.all_parts) {
            card.all_parts.forEach((part) => {
              if (["token", "emblem"].includes(part.component))
                tokenIds.add(part.id);
            });
          }
          const text = card.oracle_text?.toLowerCase() || "";
          if (text.includes("emblem")) {
            fallbackKeywords.add(card.name);
          }
          if (text.includes("create") && text.includes("zombie")) {
            fallbackKeywords.add("Zombie");
          }
        });

        let finalTokens = [];

        if (tokenIds.size > 0) {
          const tokenRes = await fetch(
            "https://api.scryfall.com/cards/collection",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                identifiers: Array.from(tokenIds).map((id) => ({ id })),
              }),
            },
          );
          const tokenData = await tokenRes.json();
          if (tokenData.data) finalTokens = [...tokenData.data];
        }
        // this is a generic search if nothing is found
        if (finalTokens.length === 0 && fallbackKeywords.size > 0) {
          const nameQuery = Array.from(fallbackKeywords)
            .map((n) => `(t:emblem "${n}") OR(t: token name: "${n}")`)
            .join(" OR ");
          const searchRes = await fetch(
            `https://api.scryfall.com/cards/search?q=${encodeURIComponent(nameQuery)}&unique=cards`,
          );
          const searchData = await searchRes.json();
          if (searchData.data) {
            const existingIds = new Set(finalTokens.map((t) => t.id));
            const newTokens = searchData.data.filter(
              (t) => !existingIds.has(t.id),
            );

            finalTokens = [...finalTokens, ...newTokens];
          }
        }
        setTokens(finalTokens);
      } catch (err) {
        console.error("Error fetching tokens:", err);
        setTokens([]);
      }
    };
    fetchRelatedTokens();
  }, [sortedCards]);
  //
  return tokens;
}
