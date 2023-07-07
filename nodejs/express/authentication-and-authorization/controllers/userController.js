const userModel = require( '../models/userModel' );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );

// SignUp
const signUp = async ( req, res ) => {
    try {
        const { username, email, password } = req.body;
        const isEmail = await userModel.findOne( { email } );
        if ( isEmail ) {
            res.status( 400 ).json( {
                message: `user with this email: ${email} already exist.`
            })
        } else {
            const saltedRound = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash( password, saltedRound );
        
            const data = {
                username,
                email,
                password: hashedPassword
            }

            const user = await userModel.create( data );
            res.status( 201 ).json( {
            message: "User registration successful.",
            data: user
        })
        }
    } catch (error) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

// signIn
const signIn = async ( req, res ) => {
    try {
        const { email, password } = req.body;
        const isEmail = await userModel.findOne( { email} );
        if ( !isEmail ) {
            res.status( 404 ).json( {
                message: `User with this email: ${email} is not found.`
            })
        } {
            const isPassword = await bcrypt.compare( password, isEmail.password );
            if ( !isPassword ) {
                res.status( 400 ).json( {
                    message: "Incorrect password"
                })
            } else {
                const token = await genToken( isEmail );
                res.status( 200 ).json( {
                    message: "Sign In successful",
                    token: token
                })
            }
        }
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

const genToken = async ( user ) => {
    const token = await jwt.sign( {
        userId: user._id,
        username: user.username,
        email: user.email,
        password: user.password
    }, process.env.JWT_SECRETE, {expiresIn: "50m"} )
    
    return token;
}

module.exports = {
    signUp,
    signIn,
}
