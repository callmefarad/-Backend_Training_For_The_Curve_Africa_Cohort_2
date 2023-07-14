const userModel = require( '../models/userModel' );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );

// SignUp
const signUp = async ( req, res ) => {
    try {
        // get all data from the request body
        const { username, email, password } = req.body;
        // check if the entry email exist
        const isEmail = await userModel.findOne( { email } );
        if ( isEmail ) {
            res.status( 400 ).json( {
                message: `user with this email: ${email} already exist.`
            })
        } else {
            // salt the password using bcrypt
            const saltedRound = await bcrypt.genSalt( 10 );
            // hash the salted password using bcrypt
            const hashedPassword = await bcrypt.hash( password, saltedRound );
        
            // create a user object containing the update record
            const data = {
                username,
                email,
                password: hashedPassword
            }

            // create and save the user object
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
        // extract the user email and password
        const { email, password } = req.body;
        // find user by their registered email
        const isEmail = await userModel.findOne( { email } );
        // check if email exist
        if ( !isEmail ) {
            res.status( 404 ).json( {
                message: `User with this email: ${email} is not found.`
            })
        } {
            // compare user password with the saved password.
            const isPassword = await bcrypt.compare( password, isEmail.password );
            // check for password error
            if ( !isPassword ) {
                res.status( 400 ).json( {
                    message: "Incorrect password"
                })
            } else {
                // save the generated token to "token" variable
                const token = await genToken( isEmail );
                // return a response
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

// // signOut
// const blackList = []
// const signOut = async (req, res) => {
//     try {
//         // check for content in the authorization head
//         const authHeader = req.headers.authorization;
//         // get the token from the authorization head
//         const token = authHeader.split( " " )[ 1 ];
//         // remove the token from the authentication head and place it in the blacklist array.
//         await blackList.push( token );
//         // return a success response
//         res.status(200).json({
//         status: "Success",
//         message: "User logged out successfully.",
//         });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

const signOut = async (req, res) => {
    try {
        // get the token from the authorization head
        const token = req.headers.authorization;

        // find the user by the token
        const user = await userModel.find( { token } );

        if ( !user ) {
            return res.status( 401 ).json( {
                message: "Invalid token"
            })
        }

        // clear the token
        user.token = '';

        // save the user with the saved token
        // await user.save();

        return res.status( 200 ).json( {
            message: "User signed out successfully"
        })
    } catch ( error ) {
        console.error( "Something went wrong", error.message );
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
    }, process.env.JWT_SECRETE, {expiresIn: "50m"} )
    
    return token;
}

module.exports = {
    signUp,
    signIn,
    signOut
}
