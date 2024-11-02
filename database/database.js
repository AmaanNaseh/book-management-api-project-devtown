// Creating 1 Book, 2 authors & 1 publication in database, it'l work for many books too

const books = [
    {
        ISBN: "12345Book",
        title: "Tesla!!!",
        pubDate: "2021-08-05", //yy mm dd
        language: "en",
        numPage: 250,
        author: [1,2], //author array with id (names confusing, 2 authors may have same name too)
        publications: [1], //id, 1 publication as 1 book
        category: ["tech", "space", "education"]
    }
];

const author = [
    {
        id: 1,
        name: "Author1",
        books: ["12345Book", "secretBook"] // By ISBN not title
    },

    {
        id: 2,
        name: "Elon Musk",
        books: ["12345Book"]
    }
];

const publication = [
    {
        id: 1,
        name: "writeX",
        books: ["12345Book"]
    },
    {
        id: 2,
        name: "writeX2",
        books: [] 
    }
];

// It is an external dataset so we need to tell it to be exported to use in other Js file (security don't allows it)

module.exports = {books, author, publication} //module means whole file, exports is method, {} means whichever array of object we want to export.