require( 'dotenv' ).config();
const mongoose = require( 'mongoose' );

const url = process.env.DATABASE_URI
mongoose.connect( url ).then( () => {
    console.log( 'Connect successfully.')
} ).catch( (e) => {
    console.log(e.message)
});