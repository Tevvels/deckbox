import mongoose from 'mongoose';
const deckSchema = new mongoose.Schema({
    name: String,
    format: {
        type: Object,
        required: true 

    },
    isPublic: {
        type: Boolean,
        default: false
    },
    color_identity: {
    type: [String], // This defines an array of strings
    default: "c"   
},
    cards: [
        {
            cardId:
            { type: mongoose.Schema.Types.ObjectId, ref: 'Card',
            required:true 
        } ,
        quantity: {
            type:Number,
            required:true,
            default:1,
            min:1
        },
            image_uris:{
                type:mongoose.Schema.Types.Mixed,
            },

    }
    ],
    commander: {
        type: String,
    },
    user: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

export default mongoose.model('Deck', deckSchema);