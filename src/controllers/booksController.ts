import Book from "../models/BookModel.js";
import { type Response,type Request } from "express";
import { Query } from "../lib/types.js";

export default async function bookController(req:Request,res:Response){
    try{


        const itemsPerPage=10;
        let lastPage=0;
    
        let query=req.query as Query;
        console.log(query);
        let title=query.title;
        let genre=query?.genre?.split(",").filter((e)=>e!="");
        let minimumRating=parseInt(query.minimumRating);
        let page=parseInt(query.page)||1;
        page=page<1?1:page;
    
        let results;
        if(!title && (!genre ||genre.length==0) && !minimumRating)
        {
            let lastItem =await Book.find().countDocuments();
            lastPage=Math.ceil(lastItem/itemsPerPage);
            lastPage=lastPage<1?1:lastPage;
    
            page=page>lastPage?lastPage:page;
            let skipItems=(page-1)*itemsPerPage<=0?0:(page-1)*itemsPerPage;
            results =await Book.find().skip(skipItems).limit(itemsPerPage);
            res.json({"results":results,"lastPage":lastPage});
    
        }
        else{
            title=title||"";
            minimumRating=minimumRating||0;
            genre=genre||[];

            let queryObject:{title?:any,genre?:any,rating?:any}={
                rating:{$gte:minimumRating}
            }

            if(title!="")
            {
                let titleRegex = new RegExp(title,"i");
                queryObject.title=titleRegex;
            }
            if(genre.length>0)
            {
                queryObject.genre={$all:genre};
            }
    

            console.log(queryObject);
            let lastItem =await Book.find(queryObject).countDocuments();
    
            lastPage=Math.ceil(lastItem/itemsPerPage);
            lastPage=lastPage<1?1:lastPage;

            page=page>lastPage?lastPage:page;
            let skipItems=(page-1)*itemsPerPage<=0?0:(page-1)*itemsPerPage;
    
            results = await Book.find(queryObject).skip(skipItems).limit(itemsPerPage);
            res.json({"results":results,"lastPage":lastPage});
        }
    }
    catch(e){
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
    }