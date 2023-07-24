require( 'dotenv' ).config();
const mongoose = require( 'mongoose' );

const url = process.env.DATABASE_URI
mongoose.connect(`${url}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
    console.log("Connected to database successfully.")
}).catch((error)=>{
    console.error("Error connecting to database", error)
})