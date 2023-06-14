require( './config/curveDB' );
const express = require( 'express' );
const studentRouter = require('./routes/studentRoute')
const PORT = 9000;


const app = express();
app.use( express.json() );
app.use( "/uploads", express.static( "uploads" ) );

app.use('/api', studentRouter)

app.listen( PORT, () => {
    console.log(`listening to port: ${ PORT }`);
});