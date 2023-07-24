require( "dotenv" ).config();
const mongoose = require( "mongoose" );

const url = process.env.LOCAL_MONGODB_URL
mongoose.connect( url )
    .then( () => {
        console.log( "Database connection successful" );
    } )
    .catch( ( error ) => {
        console.error( "Error connecting to database", error )
    } );

 