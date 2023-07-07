const express = require( 'express' );
const router = express.Router();
const {
    createRecord,
    getRecords,
    getRecord,
    updateRecord,
    deleteRecord,
} = require( '../controllers/recordController' )
const {userAuth} = require( '../middlewares/authMiddleware')


router.route( '/records', userAuth)
    .post( createRecord )
    .get( getRecords )
    

router.route( '/records/:id', userAuth )
    .get( getRecord )
    .put( updateRecord )
    .delete(deleteRecord)



module.exports = router;
