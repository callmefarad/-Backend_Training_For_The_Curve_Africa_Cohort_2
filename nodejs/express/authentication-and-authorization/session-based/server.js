require( './config/db' );
const express = require( 'express' );
const session = require('express-session');
const authRoutes = require( './routes/userRoute' );
const recordRoutes = require( './routes/recordRoutes' );


const PORT = 1000;
const app = express();

// allows data to be passed through request body
app.use( express.json() );

// Set up the session middleware
app.use(
  session({
    secret: process.env.SECRETE,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);

app.use( '/api', authRoutes );
app.use( '/api', recordRoutes );
app.listen(PORT, ()=>{
    console.log(`App is listening to port: ${PORT}`);
})