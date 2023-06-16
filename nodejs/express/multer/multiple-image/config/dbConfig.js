require( 'dotenv' ).config();
const mongoose = require( 'mongoose' );

const url = process.env.FAMILY_DB
mongoose.connect( url ).then( () => {
    console.log("Successfully connected to familyDB.")
} ).catch( (error) => {
    console.log(error.message)
});