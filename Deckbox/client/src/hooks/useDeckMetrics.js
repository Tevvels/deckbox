import { useMemo } from "react";

export function useDeckMetrics(cards =[]) {

    
 return  useMemo(() => {
    const init = {
      counts: { total: 0, creature: 0, planeswalker: 0, artifact: 0, enchantment: 0, instant: 0, sorcery: 0, battle: 0, land: 0, other:0},
      mana: { cmc: 0, W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 },
      colors: new Set(),
      commander:null,
      colorIdentity:""
    };
    if (!cards || cards.length === 0) return init;

    const commanderEntry = cards.find(
        (entry) =>
          entry.isCommander ||
        entry?.cardId?.type_line?.includes("legendary Creature"),
      );

      if(commanderEntry?.cardId){
          init.commander = commanderEntry.cardId;
          init.colorIdentity = commanderEntry.cardId.color_identity?.join("").toLowerCase() || ""
      }

    cards.forEach(({ cardId: card, quantity = 1 }) => {
      if (!card) return;
      const type = card.type_line.toLowerCase();
      const qty = Number(quantity);
      init.counts.total += qty;

      
      
        
        const mainType = [
          "creature", "planeswalker", "artifact", "enchantment", "sorcery", "instant", "battle", "land"
        ].find((t) => type.includes(t)) || "other";

  
      if (init.counts[mainType] !== undefined) {
        init.counts[mainType] += qty;
        card.color_identity?.forEach((c) => init.colors.add(c));
      }
      const costString = card.mana_cost || card.card_faces?.map((f) => f.mana_cost).join("") || "";
     const symbols = costString.match(/\{([^}]+)\}/g);

        if (symbols) {
            symbols.forEach((s) => {
                const core = s.slice(1, -1);
                ["W", "U", "B", "R", "G", "C"].forEach((color) => {
                    if (core.includes(color)) init.mana[color] += qty;
                });
            });
        } else if (!type.includes("land")) {
            init.mana.C += qty;
        }
    });
    
    if(init.colors.size === 0) init.colors.add("C");
    return init;
}, [cards]);
}