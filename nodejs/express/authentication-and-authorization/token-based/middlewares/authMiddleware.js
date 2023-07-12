const jwt = require( 'jsonwebtoken' );

// auth middleware
const userAuth = ( req, res, next ) => {
    const hasAuthorization = req.headers.authorization;
    if ( !hasAuthorization ) {
        res.status( 404 ).json( {
            message: 'No authorization found.'
        })
    } 
    const token = hasAuthorization.split( ' ' )[ 1 ];
    try {
        const decodedToken = jwt.verify( token, process.env.JWT_SECRETE )
        req.user = JSON.stringify(decodedToken);
        req.userId = decodedToken.userId;
        req.userEmail = decodedToken.email;
        req.username = decodedToken.username;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

module.exports = {
    userAuth,
};