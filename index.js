require("dotenv").config(); // Day 25, for MongoDB Data

const express = require("express");
const bodyParser = require("body-parser"); // express dependency to execute post request
const mongoose = require("mongoose"); // Day 25

// importing databse.js file in index.js file
const database = require("./database/database"); // ./ as in same hierarchy (else path)
// Day 26 : Made database folder to paste database.js file in it so change path to ./database/database

// IMPORT MONGOOSE MODELS (model name same, require js file)
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

exp = express();

exp.use(bodyParser.urlencoded({ extended: true }));
exp.use(bodyParser.json());

/* 
mongoose.connect("api-key",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
).then(() => console.log("Connection has been established"))
// Without , {true, false}, it's running fine but connection not established if we use these values
*/

mongoose
  .connect(
    // Day 25
    process.env.MONGO_URL
  ) // For secure database, using environment variable name from .env file.
  .then(() => console.log("Connection has been established"));

/* 
Route           /
Description     Get all the Book
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

exp.get("/", async (req, res) => {
  const getAllBooks = await BookModel.find(); // Finding all books & Storing them here

  return res.json(getAllBooks); // as data is already in json format so print that without new key & whole data as value
});

/* 
Route           /is
Description     Get specific Book on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

exp.get("/is/:isbn", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn }); // we want to find only 1 book as isbn is unique
  // we are finding 1 book having isbn i.e. passed in request.

  // We want to write msg if no book, but we can't use === logic in MongoDB as it don't understand, it's not a language. It has property null.
  // If getSpecificBook (0 or 1) is null, if statement will not get executed. We want getSpecificBook to be 0 but whole condition = 1
  // to execute if statement.

  // null, !0 = 1 & !1 = 0.
  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/* 
Route           /c
Description     Get specific Book on category
Access          PUBLIC
Parameter       category
Methods         GET
*/
exp.get("/c/:category", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({
    category: req.params.category,
  }); // checking category matches req category or not.

  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/* 
Route           /lang
Description     Get Books on language
Access          PUBLIC
Parameter       language
Methods         GET
*/
exp.get("/lang/:language", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({
    language: req.params.language,
  });

  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the language of ${req.params.language}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

// AUTHORS : to get all authors (no parameter required as all author names only)
/* 
Route           /author
Description     Get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

exp.get("/author", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});
// Currently no authors collection & names in it.

// To get specific author based on id
/* 
Route           /author/authorid
Description     Get specific author based on id
Access          PUBLIC
Parameter       id
Methods         GET
*/

exp.get("/author/authorid/:id", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.findOne({ id: req.params.id });

  if (!getSpecificAuthor) {
    return res.json({ error: `No book found for the id of ${req.params.id}` });
  }

  return res.json({ author: getSpecificAuthor });
});

// To get all authors based on ISBN no. of book
/* 
Route           /author/book
Description     Get all authors based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

exp.get("/author/book/:isbn", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.findOne({
    books: req.params.isbn,
  }); // .includes used or not

  if (!getSpecificAuthor) {
    return res.json({
      error: `No book found for the isbn of ${req.params.isbn}`,
    });
  }

  return res.json({ author: getSpecificAuthor });
});

// PUBLICATIONS : to get all publications (no parameter required as all author names only)
/* 
Route           /publications
Description     Get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

exp.get("/publications", async (req, res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json(getAllPublications);
});

//To get publication based on id
/* 
Route           /publications/pubid
Description     Get specific publication based on id
Access          PUBLIC
Parameter       id
Methods         GET
*/

exp.get("/publications/pubid/:id", async (req, res) => {
  const getSpecificPublication = await PublicationModel.findOne({
    id: parseInt(req.params.id),
  });

  if (!getSpecificPublication) {
    return res.json({ error: `No publication exists at id ${req.params.id}` });
  }

  return res.json({ publication: getSpecificPublication });
});

//To get publications based on books isbn
/* 
Route           /publications/book
Description     Get publications based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

exp.get("/publications/book/:isbn", async (req, res) => {
  const getSpecificPublication = await PublicationModel.findOne({
    books: req.params.isbn,
  }); // .includes used or not

  if (!getSpecificPublication) {
    return res.json({
      error: `No publication exists for book isbn ${req.params.isbn}`,
    });
  }

  return res.json({ publications: getSpecificPublication });
});

// Inserting a new book
/* 
Route           /book/new
Description     Add new books
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

// No need of await if no find fn, just creating a database. We can put it, no error.
exp.post("/book/new", async (req, res) => {
  const { newBook } = req.body; // for fetching new book from body, de-structure it as we will pass book in body in object format.
  // postman body of request is put in new book.

  const addNewBook = BookModel.create(newBook); // earlier, post req & push in database but in MongoDB, we have keywords like create
  // To create new book data inside model/database.
  // kept it in constant to console log further, direct create is also enough.

  return res.json({
    books: addNewBook, // to see added book only, for full book database, create const getAllBooks & use .find().
    message: "Book was Added!",
  });

  // Post/Insert data or key value pair in postman & check root route & MongoDB Database too.
});

// Inserting a new author
/* 
Route           /author/new
Description     Add new authors
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

exp.post("/author/new", async (req, res) => {
  const { newAuthor } = req.body;
  const addNewAuthor = AuthorModel.create(newAuthor);

  return res.json({
    author: addNewAuthor,
    message: "Author added Successfully!",
  });
});

/* 
Route           /publications/new
Description     Add new publications
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
exp.post("/publications/new", async (req, res) => {
  const { newPublication } = req.body;
  const addNewPublication = PublicationModel.create(newPublication);

  return res.json({
    publication: addNewPublication,
    message: "Publication added successfully",
  });
});

// PUT DELETE

/* 
Route           /book/update
Description     Update book on ISBN
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

exp.put("/book/update/:isbn", async (req, res) => {
  // find based on isbn & update at same time,
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn, // parameter isbn to match req API URL isbn & update title of that book
    },
    {
      title: req.body.bookTitle, // unique, not array so no array oeprators used
    },
    {
      new: true, // it'll update book in backend & show new book/newly updated data in frontend (of MongoDB, POSTMAN, etc.).
    }
  ); // very simple fn in MongoDB

  return res.json({
    books: updatedBook,
  });
});

// Updating New Author & Book simultaneously
/* 
Route           /book/author/update
Description     Update/Add new author
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

exp.put("/book/author/update/:isbn", async (req, res) => {
  // Update book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        // to push data in array, without repetition if clicked by mistake, it can be done without addToSet too.
        author: req.body.newAuthor, //what to push
      },
    },
    {
      new: true,
    }
  ); // to see in response in POSTMAN

  // Update author database

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor, // to find unique author
    },
    {
      $addToSet: {
        // not update but to add something in array
        books: req.params.isbn,
      },
    },
    {
      new: true,
    }
  );

  res.json({
    books: updatedBook,
    authors: updatedAuthor,
    message: "New Author was added",
  });
});

// Simultaneously updating book & publication database.
/* 
Route           /publications/update/book
Description     Update/Add new publication
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

exp.put("/publications/update/book/:isbn", async (req, res) => {
  // Update publication database (book isbn)
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: req.body.pubId,
    },
    {
      $addToSet: {
        books: req.params.isbn,
      },
    },
    {
      new: true,
    }
  );

  // Update book database (publication id)
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        publications: req.body.pubId,
      },
    },
    {
      new: true,
    }
  );

  return res.json({
    books: updatedBook,
    publications: updatedPublication,
    message: "Update is successful",
  });
});

// DELETE

// Delete a book whose isbn matches passed isbn in Postman url
/* 
Route           /book/delete
Description     Delete a book
Access          PUBLIC
Parameter       isbn
Methods         DELETE
*/
exp.delete("/book/delete/:isbn", async (req, res) => {
  const updatedBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn, //just provide ISBN to delete unique book
  }); // easy syntax for delete in MongoDB

  // Let's check what will it return after deleting a book from original database book array before delete
  return res.json({
    books: updatedBookDatabase, // It has deleted book in it
  });
});

// Delete author from book
/* 
Route           /book/delete/author
Description     Delete author from book
Access          PUBLIC
Parameter       isbn
Methods         DELETE
*/
exp.delete("/book/delete/author/:isbn", (req, res) => {
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const updatedAuthors = book.author.filter(
        (author) => author !== req.body.author
      );

      book.author = updatedAuthors;
      return; // returning from this loop. Good practice to stop program gracefully
    }
  });

  return res.json({ books: database.books });
});

// Delete author from book & book from author (passing 2 parameters in API URL)
/* 
Route           /book/delete/author
Description     Delete an author from book & book from author
Access          PUBLIC
Parameter       isbn, authorId
Methods         DELETE
*/

exp.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
  // Update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      // then check author array of that isbn
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );

      book.author = newAuthorList;
    }
  });

  // Update the author database
  database.author.forEach((eachAuthor) => {
    if (eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );

      eachAuthor.books = newBookList;
      return;
    }
  });

  return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted!!!",
  });
});

exp.listen(3000, () => {
  console.log("Server running on port 3000");
});
