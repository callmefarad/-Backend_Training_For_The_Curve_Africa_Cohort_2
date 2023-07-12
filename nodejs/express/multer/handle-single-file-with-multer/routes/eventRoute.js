const express = require( 'express' );
const router = express.Router();
const { createEvent, getEvents, getEvent, updateEvent, removeEvent} = require( '../controllers/eventController' );
const upload = require( "../utils/multer" );
const validateEvent = require('../middleware/validateEvent')


router.route( "/events" )
    .post( validateEvent, upload.single( "titleImage" ), createEvent )
    .get( getEvents )
    
router.route( "/events/:id" )
    .get( getEvent )
    .put( validateEvent, upload.single( "titleImage" ), updateEvent )
    .delete(removeEvent)





module.exports = router;