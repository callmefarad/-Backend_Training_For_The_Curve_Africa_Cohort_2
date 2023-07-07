const express = require( 'express' );
const router = express.Router();
const { signUp, signIn } = require( '../controllers/userController' );

router.route( "/users/sign-up" )
    .post( signUp )
    
router.route( "/users/sign-in" )
    .post(signIn)
    

module.exports = router;