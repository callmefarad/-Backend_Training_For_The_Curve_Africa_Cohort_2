const express = require( 'express' );
const router = express.Router();
const { createEvent, getEvents, getEvent, updateEvent, removeEvent} = require( '../controllers/eventController' );
const upload = require( "../utils/multer" );


router.route( "/events" )
    .post( upload.single( "titleImage" ), createEvent )
    .get( getEvents )
    
router.route( "/events/:id" )
    .get( getEvent )
    .put( upload.single( "titleImage" ), updateEvent )
    .delete(removeEvent)





module.exports = router;