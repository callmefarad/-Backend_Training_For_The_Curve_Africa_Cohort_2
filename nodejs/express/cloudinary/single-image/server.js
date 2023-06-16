require( './config/dbConfig' );
const express = require( 'express' );
const clubRouter = require('./route/clubRouter')
const PORT = 1000;

const app = express();
app.use( express.json() );
app.use( '/uploads', express.static( "upload" ) );

app.use( '/api', clubRouter );
app.listen( PORT, () => {
    console.log( 'listening on port' + PORT );
})