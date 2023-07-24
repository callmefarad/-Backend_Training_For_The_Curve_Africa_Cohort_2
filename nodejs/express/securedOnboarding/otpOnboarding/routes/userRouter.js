const express = require( 'express' );
const router = express.Router();
const { signUp, verifyOtp } = require( '../controllers/userController' )



// signUp
router.route( '/user/signup' )
    .post( signUp );

// verify user
router.route( '/user/signup/verify' )
    .post( verifyOtp );

module.exports = router;