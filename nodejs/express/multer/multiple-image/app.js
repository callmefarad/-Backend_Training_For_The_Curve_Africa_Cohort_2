require('./config/dbConfig')
const express = require( 'express' );
const familyRouter = require('./routes/familyRouter')


const app = express();
app.use( express.json() );
app.use( '/uploads', express.static( "uploads" ) );
app.use( '/api', familyRouter );

module.exports = app;