import express from 'express';
import authMiddleware from '../auth.js';
import Deck from '../../models/Deck.js';
import Card from '../../models/Card.js'; 


const router = express.Router();

// ----------------------------------------------------------------
// PUBLIC Deck Routes (No Authentication Required)
// --------------------------------------------------------


router.get('/public/decks', async (req, res) => {
    try {
        const publicDecks = await Deck.find({ isPublic: true }).populate('user','username').populate('cards.cardId');
        return res.json(publicDecks);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/public/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deck = await Deck.findOne({ _id: id, isPublic: true }).populate('user','username').populate('cards.cardId');
        if (!deck) {
            return res.status(404).json({ error: 'Public Deck not found' });
        }

        return res.json(deck);
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
});

// Apply authentication middleware to all routes defined below
router.use(authMiddleware);
// Make sure you have imported the Card model if you are using .populate('cards')



// --------------------------------------------------------
// DECK Management Routes (Mounted at /cardStorage in server.js)
// --------------------------------------------------------

// Get ALL Decks for the authenticated user (FIXED)
router.get('/', async (req, res) => {
    try {
        // Use find() to get ALL decks for the logged-in user ID
        const decks = await Deck.find({ user: req.user.id }).populate('cards.cardId');
        // Optional: Add .populate('cards') here if you want ALL decks to preload their cards
        return res.json(decks);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Create a NEW Deck
router.post('/', async (req,res) =>{
    const {name, isPublic,format,commander,color_identity,scryFallCardData} = req.body;

    try{
        let initialCards = [];

        if(format === 'Commander' && commander){
            const cardRecord = await Card.findOneAndUpdate({name: commander, user: req.user.id}

            ,{
                    name: scryFallCardData.name,
                    color_identity: scryFallCardData.color_identity,
                    cmc: scryFallCardData.cmc,
                    type_line: scryFallCardData.type_line,
                    mana_cost: scryFallCardData.mana_cost,
                    oracle_text: scryFallCardData.oracle_text,
                    scryfallId: scryFallCardData.id,
                    image_uris: scryFallCardData.image_uris,
                    user:req.user.id
                },
                {new:true, upsert:true}
);
            
           
            if(cardRecord){ 
                initialCards.push({cardId: cardRecord._id, quantity:1, color_identity: cardRecord.color_identity});

        }
    }


      // Create and save the new Deck  
        const newDeck = new Deck({
            name,
            isPublic,
            format,
            color_identity,
            commander: format === 'Commander' ? commander : null,
            image_uris: scryFallCardData?.image_uris || null,

            cards: initialCards,
            user:req.user.id
        });
        await newDeck.save();
        await newDeck.populate('cards.cardId');
        return res.status(201).json(newDeck);
    } catch(err){
        return res.status(500).json({error:err.message});
    }
});

// Get a SINGLE Deck by ID 
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Use findOne and populate the cards
        const deck = await Deck.findOne({ _id: id, user: req.user.id }).populate('cards.cardId');
        if (!deck) {
            return res.status(404).json({ error: `Deck not found or does not belong to user` });
        }
        if(!deck) {
            return res.status(404).json({error: 'Deck not found'});
        }
        const deckObj = deck.toObject();
        if(deckObj.format === 'Commander' && deckObj.commander) {
            const commanderDetails = await Card.findOne({ name: deckObj.commander, user: req.user.id });
            deckObj.commanderDetails = commanderDetails || null;
        }
        return res.json(deck);
    } catch (err) {
        console.error("Server error when fetching single deck:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Update a Deck by ID
router.put('/:id', async (req,res) => {
    const { id }  = req.params;
    const updates = req.body;
    try{

        const deck = await Deck.findOneAndUpdate(
            {_id: id, user: req.user.id},
            updates,{new:true, runValidators:true}
        );
        if(!deck) {
            return res.status(404).json({error: 'Deck not found'});
        }
        return res.json(deck);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Delete a Deck by ID
router.delete('/:id', async (req,res) => {
    const { id } = req.params;
    try {
        const deck = await Deck.findOneAndDelete({_id: id, user: req.user.id});
        if(!deck) {
            return res.status(404).json({error: "no Deck found to Delete"})
        }
        return res.json({ message: 'Deck Deleted'});
    } catch (err) {
        return res.status(500).json({error:err.message});
    }
});

// add a new card to the deck
router.post('/:id/add-card',async (req,res) => {
    const {id} = req.params;
    const {cardId} = req.body; // Expecting { cardId: "..." } from frontend

    try{
        // Push the cardId into the cards array
        let deck = await Deck.findOneAndUpdate(
            {_id:id,user:req.user.id,"cards.cardId":cardId},
            {$inc:{'cards.$.quantity':1}},
            {new:true}
        );

        if(!deck){
            deck = await Deck.findOneAndUpdate(
                {_id:id, user:req.user.id},
                {$push:{cards:{cardId: cardId, quantity:1}}},
                {new:true, runValidators:true}
            );

        }
        if(!deck){
          return res.status(404).json({error:"Deck not found or doesn't exist"});
}
        
        // Populate the cards array before sending the response back to React
        await deck.populate('cards.cardId');
        return res.json(deck);
    
}catch(err){
    console.log("error adding card to deck:",err);
    return res.status(500).json({error: err.message});
    }
});

// remove a card instance from the deck
router.delete('/:id/remove-card-instance',async (req,res) =>{
        const {id} = req.params;
        const {cardId} = req.body;

        console.log(`backend delete request: deckID:${id} and card id ${cardId}`)


        if(!cardId){
            return res.status(400).json({error: 'cardId is required in request body'})
        }
        try{
            let deck;
             deck = await Deck.findOneAndUpdate({_id:id,user: req.user.id, 'cards.cardId':cardId,"cards.quantity":{$gt: 1}},
                {$inc:{"cards.$.quantity":-1}},
                {new: true}
            );


            if(!deck){
                deck = await Deck.findOneAndUpdate(
                    {_id:id,user:req.user.id,"cards.cardId":cardId},
                    {$pull:{cards:{cardId:cardId}}},
                    {new:true}
                );
            }
                    if(!deck) {
            return res.status(404).json({error: "no Deck found to Delete"})
        }
        await deck.populate('cards.cardId');
        return res.json({ deck:deck, message: 'Card instance removed successfully'});
    } catch (err) {
        console.error("error in delete route: ", err.stack || err);
        return res.status(500).json({error:err.message ||            
"something went wrong"});
    }
        
})

// Sync a card from Scryfall to MongoDB
router.post('/sync-card',async(req,res)=>{
    const scryFallCardData = req.body;
    try{
        const userId = req.user.id
        const card = await Card.findOneAndUpdate({scryfallId: scryFallCardData.id,
        user:userId

        },
        
           {
                name: scryFallCardData.name,
                color_identity: scryFallCardData.color_identity,
                scryfallId: scryFallCardData.id,
                image_uris: scryFallCardData.image_uris,
                user:userId,
                cmc: scryFallCardData.cmc,
                type_line: scryFallCardData.type_line,
                mana_cost: scryFallCardData.mana_cost,
                oracle_text: scryFallCardData.oracle_text

            },
            {new:true, upsert:true}
);
            await card.save();
        
        return res.json({mongoId: card._id});
    } catch(err){
        res.status(500).json({error: err.message});
    }
})
// Update Card Art by Card MongoDB ID
router.patch('/update-art/:id', async (req,res) => {
    try{
        const mongoId = req.params.id;

        const {scryfallId, image_uris} = req.body;
        const updatedCard = await Card.findByIdAndUpdate(
            mongoId,    
            {scryfallId, image_uris},
            {new:true}
        );
        console.log("Updated Card:", updatedCard);
        console.log("Scryfall ID:", req.params.id);
        if(!updatedCard){
            return res.status(404).json({error: 'Card not found'});
        }
        return res.json(updatedCard);
    } catch (err){
        return res.status(500).json({error: err.message});

    }
});

router.get('/admin/repair-cards',async (req,res) => {
    try{
        const allCards = await Card.find({cmc:{$exists:false}});
        let updatedCount = 0;
        for(let card of allCards){
            const scryFallData = await fetch(`https://api.scryfall.com/cards/${card.scryfallId}`).then(r=>r.json());
            if(scryFallData && scryFallData.cmc !== undefined){
                card.cmc = scryFallData.cmc;
                card.type_line = scryFallData.type_line;
                card.mana_cost = scryFallData.mana_cost;        

                card.oracle_text = scryFallData.oracle_text;
                await card.save();
                updatedCount++;
            }
        }
        return res.json({message: `Updated ${updatedCount} cards with missing CMC`});
    } catch(err){
        return res.status(500).json({error: err.message});
    }
});

export default router;
