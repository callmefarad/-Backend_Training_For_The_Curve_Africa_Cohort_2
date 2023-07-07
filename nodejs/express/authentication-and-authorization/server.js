require('./config/dbConfig')
const express = require( 'express' );
const userRouter = require( './routers/userRouter' );
const recordRouter = require( './routers/recordRouter' );

const app = express();
const PORT = 9000;
app.use( express.json() )
app.get( "/test", ( req, res) => {
    res.send("User Authentication and Authorization")
})

app.use( '/api', userRouter );
app.use( '/api', recordRouter );
app.listen( PORT, () => {
    console.log( `Server is listening to port: ${ PORT }` );
} );