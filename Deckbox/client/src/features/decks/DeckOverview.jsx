import React from 'react'

export default function DeckOverview({name,format,deckMetrics,commanderCard}) {

  return (

    <>
    <section className='view-page overview-view'>
        {format === "Commander" && commanderCard && (
            <>            <h3 className='deck_commander-name'>{commanderCard.name}</h3>
            <img
                className='card deck_commander-name' src={commanderCard.image_uris?.normal || "https://placeholder.com"}
                alt={commanderCard.name}/>
                <p className='deck_commander-type'>{commanderCard.type_line}</p>
                <p className='deck_commander-oracle'>{commanderCard.oracle_text}</p>
                
           </>

        )}
    </section>
    </>
  )
}
