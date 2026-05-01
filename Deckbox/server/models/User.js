import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String, // hashed 
    resetToken: String,
    resetTokenExpiry: Date
});
export default mongoose.model('User', userSchema);  
