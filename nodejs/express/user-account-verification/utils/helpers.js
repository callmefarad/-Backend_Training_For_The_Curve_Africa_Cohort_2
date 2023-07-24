const jwt = require( 'jsonwebtoken' );

// generate token
const genToken = async ( user ) => {
    const token = await jwt.sign( {
        userId: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
    }, process.env.JWT_SECRETE, { expiresIn: "50m" } )
    
    return token;
};


// verify token
const verifyToken = async ( token ) => {
    let user = null
    await jwt.verify(
        token,
        process.env.JWT_SECRETE, async ( error, data ) => {
            if ( error ) {
                throw error
            } else {
                user = data
            }
        } )
    return user;
};

module.exports = {
    genToken,
    verifyToken,
}