const mongoose = require( 'mongoose' );


mongoose.connect( 'mongodb://localhost/curveDB' ).then( () => {
    console.log("Database connection successful")
} ).catch( () => {
    console.log("Database connection failed")
});