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
    
router.post( "/records", userAuth, createRecord );
router.get( "/records", userAuth, getRecords );
router.get( "/records/:id", userAuth, getRecord );
router.put( "/records/:id", userAuth, updateRecord );
router.delete( "/records/:id", userAuth, deleteRecord );



module.exports = router;
