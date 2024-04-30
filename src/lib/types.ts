type Query = {
    title?:string;
    genre:string;
    minimumRating:string;
    page:string
}

interface IBook{
    title:string;
    author:string[];
    publish_year:number;
    genre:string[];
    key:string;
    rating:number;
    imageId:string;
}

export type {IBook,Query}