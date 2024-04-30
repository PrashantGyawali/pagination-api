import { Schema,model,type Model } from "mongoose"
import { IBook } from "../lib/types";

type BookModel = Model<IBook> ;


const BookSchema= new Schema<IBook>({
    title:{type:String,required:true},
    author:{type:[String],required:true},
    publish_year:{type:Number,required:true},
    genre:{type:[String],required:true},
    key:{type:String,required:true},
    rating:{type:Number,required:true},
    imageId:{type:String,required:true}
})

const Book:BookModel= model<IBook,BookModel>("books",BookSchema);

export default Book;