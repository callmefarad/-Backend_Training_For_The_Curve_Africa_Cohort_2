require("./config/eventDB")
const express = require( "express" );
const eventRoute = require( "./routes/eventRoute" );

const PORT = 3000;
const app = express();
app.use( express.json() );
app.use("/uploads", express.static("uploads") );
app.use("/api", eventRoute)
app.listen( PORT, () => {
    console.log(`App is listening on port: ${PORT}`);
});