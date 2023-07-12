require( "dotenv" ).config();
const mongoose = require( 'mongoose' );

const url = process.env.DATABASE_URL
mongoose.connect( url ).then( () => {
    console.log("Database connected successfully.")
} ).catch( (error) => {
    console.error("There was an error connecting to the database", error)
});