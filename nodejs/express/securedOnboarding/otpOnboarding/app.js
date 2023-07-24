require( './config/dbConfig' );
const express = require( 'express' );
const app = express();
const userRouter = require('./routes/userRouter')

app.use( express.json() );
app.use('/api', userRouter)

module.exports = app;

