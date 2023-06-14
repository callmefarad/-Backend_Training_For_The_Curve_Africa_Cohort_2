require( './config/dbConfig' );
const express = require( 'express' );
const hospitalRouter = require('./routes/hospitalRoute')

// const PORT = process.env.PORT || 9000;
const PORT = process.env.PORT || 9000;
const app = express();
app.use( express.json() );
// allow for x-www-form-encoded
app.use(express.urlencoded({extended: true}))

app.use("/api", hospitalRouter);

app.listen( PORT, () => {
    console.log(`listening to port ${PORT}`);
});