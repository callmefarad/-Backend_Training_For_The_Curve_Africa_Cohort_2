const express = require( 'express' );
const router = express.Router();
const { signUp, signIn, signOut, verifyEmail, resendVerificationEmail } = require( '../controllers/userController' );

router.route( "/users/sign-up" )
    .post( signUp )

router.route( "/users/verify-email/:token" )
    .get( verifyEmail );

router.route( "/users/resend-verification-email" )
    .post( resendVerificationEmail );
    
router.route( "/users/sign-in" )
    .post( signIn )
    
router.route( "/users/sign-out" )
    .post(signOut)
    

module.exports = router;