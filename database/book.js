const mongoose = require("mongoose");

// Create book schema (blueprint so mention  key : datatype of value only instead of actual data)
// As we will create database in MongoDB Account.
const BookSchema = mongoose.Schema(
    {
        ISBN: String,
        title: String,
        pubDate: String,
        language: String,
        numPage: Number,
        author: [Number],
        publications: [Number], //array of numbers
        category: [String] //array of string
    }
);

// We can't directly use schema but in terms of model
const BookModel = mongoose.model("books", BookSchema); // In MongoDB, we created 1 database having collection as books (Database -- Browse Collections)

// It tells whatever things you want to push using BookModel, it'll be pushed to books database in MongoDB.
// Booky is project name, database/collection name is books.

module.exports = BookModel; // to export module to use in index.js