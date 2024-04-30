import express, { urlencoded,json, type Express } from "express";
import initializeDB from "./DB/db.js";
import seedDB from "./DB/seeding.js";
import bookController from "./controllers/booksController.js";
import offlineBookController from "./controllers/offlineBookController.js";
import cors from "cors";
import { rateLimit } from 'express-rate-limit'
import "dotenv/config";


const app:Express = express();




// Basic rate limiter
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})



app.use(urlencoded({extended:true}));
app.use(json());
console.log(process.env.FRONTEND_URL);
app.use(cors({
    origin:[`http://localhost:${process.env.PORT||3000}`,process.env.FRONTEND_URL||"http://localhost:5173"],
}));

app.use(limiter);

// Artificial Delay
app.use((req,res,next)=>{setTimeout(next,2000)});







// if error in connecting to DB, use offline controller
initializeDB().then(()=>{
    app.get("/books",bookController);
}).catch((err)=>{
    console.log("DB error:",err);
    app.get("/books",offlineBookController);
})

app.get("/offline/books",offlineBookController);

app.get("/",(req,res)=>{
    res.send("Hello World");
})

// app.get("/seed",async (req,res)=>{
//     let sample=await seedDB();
//     res.json(sample);
// })






app.listen(process.env.PORT||3000,()=>{
    console.log("Server is running on port 3000");
});


