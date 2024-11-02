const mongoose = require("mongoose");

// Create Publication Schema
const PublicationSchema = mongoose.Schema(
    {
        id: Number,
        name: String,
        books: [String]
    }
);

const PublicationModel = mongoose.model("publications", PublicationSchema); 

module.exports = PublicationModel; 