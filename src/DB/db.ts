import mongoose from "mongoose";
import 'dotenv/config'

async function initializeDB(){ 
    const conn =  await mongoose.connect(process.env.DB_URI||"",{dbName:process.env.DB_NAME||"BooksDB"})
    console.log(`Mongo db connected: ${conn.connection.host}`);
}

export default initializeDB;