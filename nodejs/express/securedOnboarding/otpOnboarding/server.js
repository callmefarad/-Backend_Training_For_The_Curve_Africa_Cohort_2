const app = require( './app' );

const port = process.env.PORT || 8000;

app.listen( port, () => {
    console.log(`App is listening to port ${port}`);
})
