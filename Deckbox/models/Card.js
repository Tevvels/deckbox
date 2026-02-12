import mongoose from "mongoose";
const cardSchema = new mongoose.Schema({
    method: String,
    oracle_id: String,
    url: String,
    name: String,
    type_line: String,
    cmc:Number,
    mana_cost: String,
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
    },
});
export default mongoose.model('Card', cardSchema);