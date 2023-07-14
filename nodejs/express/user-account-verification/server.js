require('./config/dbConfig')
const express = require( 'express' );
const userRouter = require( './routers/userRouter' );
const recordRouter = require( './routers/recordRouter' );

const app = express();
const PORT = 7000;
app.use( express.json() )
app.get( "/test", ( req, res) => {
    res.send("User Account Verification")
})

app.use( '/api', userRouter );
app.use( '/api', recordRouter );
app.listen( PORT, () => {
    console.log( `Server is listening to port: ${ PORT }` );
} );