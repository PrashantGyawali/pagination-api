import Book from '../models/BookModel';
import seed from "./seed.json"

async function seedDB() {
    const Books=seed
    const books=JSON.parse(Books.toString());

    Book.insertMany(books).then(()=>{
        console.log("Seeding successful");
    }).catch((err)=>{
        console.log(err);
    })
    let sample=await Book.find().limit(5);
    return sample;
}

export default seedDB;