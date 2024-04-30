import fs from 'fs';
import { type Response,type Request } from "express";

import path from 'path';
import { fileURLToPath } from 'url';

import { IBook,Query } from '../lib/types';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 


export default async function offlineBookController(req:Request,res:Response){
        const itemsPerPage=10;
        let lastPage=0;
    
        let query=req.query as Query;
        console.log(query);
        let title=query.title;
        let genre=query?.genre;
        let minimumRating=parseInt(query.minimumRating);
        let page=parseInt(query.page)||1;
        page=page<1?1:page;
    
        let results;


        const RawBooks=fs.readFileSync(path.join(path.dirname(__dirname),'/DB/seed.json'),"utf-8");
        const Book:IBook[]=JSON.parse(RawBooks.toString());
    
        if(!title && (!genre ||genre.length==0) && !minimumRating)
        {
    
            let lastItem = Book.length;
            lastPage=Math.ceil(lastItem/itemsPerPage);
            lastPage=lastPage<1?1:lastPage;

            page=page>lastPage?lastPage:page;
            let skipItems=(page-1)*itemsPerPage<=0?0:(page-1)*itemsPerPage;
            results = Book.slice(skipItems,skipItems+itemsPerPage);
    
            res.json({"results":results,"lastPage":lastPage});
        }
        else{
            title=title||"";
            genre=genre||"";
            
            minimumRating=minimumRating||0;
    
            let titleRegex = new RegExp(title,"i");

            let genreComparatorsArray=genre.split(",");
            let genreComparatorsRegex=genreComparatorsArray.map((e)=> new RegExp(e,"i"));
            
            let allResults=Book.filter((b)=>( genreComparatorsRegex.filter((e)=>!e.test(b.genre.join(""))).length==0 && titleRegex.test(b.title) && b.rating>=minimumRating)).sort((b,a)=>(titleRegex.exec(b.title)?.index ??Number.MAX_SAFE_INTEGER)- (titleRegex.exec(a.title)?.index ?? Number.MAX_SAFE_INTEGER))

            let lastItem = allResults.length;
    
            lastPage=Math.ceil(lastItem/itemsPerPage);
            lastPage=lastPage<1?1:lastPage;

            page=page>lastPage?lastPage:page;
            let skipItems=(page-1)*itemsPerPage<=0?0:(page-1)*itemsPerPage;
    
            results = allResults.slice(skipItems,skipItems+itemsPerPage);
            res.json({"results":results,"lastPage":lastPage});
        }
    }