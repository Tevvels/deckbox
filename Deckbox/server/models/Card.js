import mongoose from "mongoose";
const cardSchema = new mongoose.Schema({
    method: String,
    oracle_id: String,
    url: String,
    all_parts: {type:Array,default:[]},
    name: String,
    type_line: String,
    cmc:Number,
    mana_cost: String,
    oracle_text: String,
    legalities:{
          standard: String,
         future: String,
         historic: String,
          gladiator: String,
    pioneer: String,
    explorer: String,
    modern: String,
    legacy: String,
    pauper: String,
    vintage: String,
    penny: String,
    commander: String,
    oathbreaker: String,
    brawl: String,
    historicbrawl: String,
    alchemy: String,
    paupercommander: String,
    duel: String,
    oldschool: String,
    premodern: String,
    predh: String
    },
    artist: String,
    color_identity: {
    type: [String], // This defines an array of strings
    default: []     // Colorless cards will be an empty array
    },
    user: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    scryfallId:{
        type:String,
        required:true,
        unique:true
    },
    image_uris:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    },
    card_faces:{
        type: [mongoose.Schema.Types.Mixed],
        default:[]
    }
});
export default mongoose.model('Card', cardSchema);