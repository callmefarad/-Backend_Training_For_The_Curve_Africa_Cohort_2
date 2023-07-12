require( './config/dbConfig' );
const express = require( 'express' );
const profileRoute = require('./routes/person')

PORT = 6000;
const app = express();
app.use( express.json() );
app.use( '/uploads', express.static( "uploads" ) )
app.use( '/api', profileRoute );

app.listen( PORT, () => {
    console.log(`listening to port: ${PORT}`)
})