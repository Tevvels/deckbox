
import { config} from 'dotenv'
config();

import mongoose from 'mongoose'
const uri = process.env.MONGO_URI;

async function main(){
    try{
        await mongoose.connect(uri);
        console.log('successfully connected to mongodb');

    } catch(err){
        console.error(`error connecting to mongoDB:`,err);
    }
}

main();

mongoose.connection.on('connect',()=>{
    console.log('mongoose defualt connection is open');
});

mongoose.connection.on('disconnect',()=>{
    console.log('mongoose default connection is disconnected');
});

process.on('SIGINT',async ()=>{
    await mongoose.connection.close();
    console.log('Mongoose default connection disconnected trhough app termination.');
    process.exit(0);
});
