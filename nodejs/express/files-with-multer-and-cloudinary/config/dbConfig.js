require( 'dotenv' );
const mongoose = require( 'mongoose' );

const url = process.env.DATABASE_URI;
mongoose.connect( `mongodb://localhost/${url}`).then( () => {
    console.log("Database connected successfully")
} ).catch( (e) => {
    console.error("Unable to connect to database", e.message)
})