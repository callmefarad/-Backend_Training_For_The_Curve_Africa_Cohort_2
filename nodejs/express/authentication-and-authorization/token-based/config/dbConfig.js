require( 'dotenv' ).config();
const mongoose = require( 'mongoose' );

const url = process.env.DATABASE_URI
mongoose.connect( url ).then( () => {
    console.log("Database connected successfully.")
} ).catch( (error) => {
    console.error("Error connecting to database", error.message)
});