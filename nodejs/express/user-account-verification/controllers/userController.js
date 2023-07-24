const userModel = require( '../models/userModel' );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );
const { emailTransporter } = require( '../utils/emailTransport' );
const {genToken, verifyToken} = require( '../utils/helpers' );


// create a nodemailer transporter
// const transporter = nodemailer.createTransport( {
//     service: "Gmail",
//     auth: {
//         user: process.env.USER_EMAIL,
//         pass: process.env.USER_PASSWORD,
//     }
// });

// SignUp
const signUp = async ( req, res ) => {
    try {
        // get all data from the request body
        const { username, email, password } = req.body;
        // check if the entry email exist
        const user = await userModel.findOne( { email } );
        if ( user ) {
            res.status( 400 ).json( {
                message: `user with this email: ${email} already exist.`
            })
        } else {
            // salt the password using bcrypt
            const saltedRound = await bcrypt.genSalt( 10 );
            // hash the salted password using bcrypt
            const hashedPassword = await bcrypt.hash( password, saltedRound );

            // create a token
            // const token = await jwt.sign( { email }, process.env.JWT_SECRETE, { expiresIn: "50m" } );
        
            // create a user
            const newUser = new userModel( {
                username,
                email,
                password: hashedPassword
            } );

            const token = await genToken(newUser);
            
            // send verification email
            const link = `${ req.protocol }://${ req.get( "host" ) }/api/users/verify-email/${ token }`;
            const subject = "Account Verification";
            const html = `Please click on the link to verify your email: <a href="${ link }">Verify Email</a>`;
            const mailOptions = {
                email,
                subject,
                html,
            };

            // await transporter.sendMail( mailOptions );
            await emailTransporter( mailOptions );

            // save the user
            const savedUser = await newUser.save();

            // return a response
            res.status( 201 ).json( {
            message: `Check your email: ${savedUser.email} to verify your account.`,
            data: savedUser,
            token
        })
        }
    } catch (error) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

// verify email
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // extract the id from the token
        const { userId } = await verifyToken( token );
        if ( userId ) {
            // get the user with the extracted token
            const user = await userModel.findById( userId );
            // changed the verified status of the user to be true
            user.isVerified = true;
            // save the changes made
            await user.save();

            // update the user's complete data based on the changes made to the model field "isVerified"
            const updatedUser = await userModel.findByIdAndUpdate( userId, user )
             // const updatedUser = await userModel.findOneAndUpdate( {email}, user );
            
            // send a response to the client containing the updated user info
            res.status( 200 ).json( {
            message: "User verified successfully",
            data: updatedUser,
        })
        } else {
            res.status( 404 ).json( {
                message: "user is not found."
            })
        }
        // res.status( 200 ).redirect( `${ process.env.BASE_URL }/login` );

    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

// resend verification
const resendVerificationEmail = async (req, res) => {
    try {
        // get user email from request body
        const { email } = req.body;

        // find user
        const user = await userModel.findOne( { email } );
        if ( !user ) {
            return res.status( 404 ).json( {
                error: "User not found"
            } );
        }

        // create a token
        const token = await jwt.sign( { email }, process.env.JWT_SECRETE, { expiresIn: "50m" } );
        
        const link = `${ req.protocol }://${ req.get( "host" ) }/api/users/verify-email/${ token }`;
        const subject = "Account Verification";
        const html = `Please click on the link to verify your email: <a href="${ link }">Verify Email</a>`;
            
        const mailOptions = {
            email,
            subject,
            html,
        };

         // await transporter.sendMail( mailOptions );
        await emailTransporter( mailOptions );

        res.status( 200 ).json( {
            message: `Verification email sent successfully to your email: ${user.email}`
        } );

    } catch ( error ) {
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
        const user = await userModel.findOne( { email } );
        // check if email exist
        if ( !user) {
            res.status( 404 ).json( {
                message: `User with this email: ${email} is not found.`
            })
        } else {
            if ( !user.isVerified ) {
                res.status( 400 ).json( {
                    message: "User is not verified, Please check your email to verify your account or use the reverification link"
                } )
            } else {
                     // compare user password with the saved password.
                const isPassword = await bcrypt.compare( password, user.password );
                // check for password error
                if ( !isPassword ) {
                    res.status( 400 ).json( {
                    message: "Incorrect password"
                })
            } else {
                // save the generated token to "token" variable
                const token = await genToken( user );
                // return a response
                res.status( 200 ).json( {
                    message: "Sign In successful",
                    token: token
                })
            }
            }
        }
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

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

const changePassword = async(req, res)=>{
    try {
        // extract the user password from the request body.
        const { password } = req.body;
        // extract the id of the current logged in user from the url parameter
        const { id } = req.params;

        // get the current logged in user
        const currentUser = await userModel.findById( id );
        // salt the password gotten from the request body
        const saltedPassword = await bcrypt.genSalt( 10 );
        // hash the password with the salt algorithm
        const hashedPassword = bcrypt.hash( password, saltedPassword );
        // update the current user password and hash it before saving it to the database
        const updatedUser = await userModel.findByIdAndUpdate(currentUser, {password: hashedPassword}, {new: true});
        if (!updatedUser) {
            res.status(400).json({
                message: 'Failed to Change Password.'
            })
        } else {
            res.status(200).json({
                message: 'Password Changed Successfully',
                data: currentUser
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const forgotPassword = async (req, res)=>{
    try {
        // extract the current user email from the request body
        const { email } = req.body;
        // get the current user by the email entered to the request body
        const user = await userModel.findOne( { email } );
        // check for user error
        if (!user) {
            res.status(404).json({
                message: 'No user with such email.'
            })
        } else {
            // generate a token
            const token = await genToken( user );
            const subject = 'Password Reset'
            const link = `${ req.protocol }://${ req.get( "host" ) }/api/users/reset-password/${ token }`;
            const html = `kindly use this link to <a href="${ link }">reset your password</a>. This link expires in five(5) minutes.`
            const mailOptions = {
                email,
                subject,
                html,
            };

            // await transporter.sendMail( mailOptions );
            await emailTransporter( mailOptions );
            res.status(200).json({
                message: 'Email sent successfully, please check your Email for the link to reset your Password'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

const resetPassword = async (req, res) => {
    try {
        // get the token from the url
        const { token } = req.params;
        // get the user password from the request body
        const { password } = req.body;
        // get the current user id from the url
        const { id } = req.params;
        // get the current user with the password from the url
        const user = await userModel.findById( id );
        // check for errors
        if (!user) {
            res.status(404).json({
                message: 'User not found'
            })
        } else {
            // salt the password
            const saltedPassword = bcrypt.genSalt(10);
            // hash the password with the salt algorithm
            const hashedPassword = bcrypt.hashedPassword( password, saltedPassword );
            // update the current user with the password entered in the request body
            const updatedUser = await userModel.findByIdAndUpdate( user, { password: hashedPassword }, { new: true } );
            // verify the user token
            const verify = await verifyToken( token );
            if ( !verify ) {
                res.status( 400 ).json( {
                    message: "Expired token."
                })
            } else {
                if ( !updatedUser ) {
                    res.status( 400 ).json( {
                        message: "Error updating user"
                    })
                } else {
                    res.status( 200 ).json( {
                        message: "User password reset successfully."
                    })
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}



module.exports = {
    signUp,
    signIn,
    signOut,
    verifyEmail,
    resendVerificationEmail,
    changePassword,
    forgotPassword,
    resetPassword,
}
