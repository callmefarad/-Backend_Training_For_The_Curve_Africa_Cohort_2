const express = require( 'express' );
const router = express.Router();
const recordController = require( '../controllers/recordController' );
const authMiddleware = require( '../middlewares/authMiddleware' );

router.post( '/records', authMiddleware.isLoggedIn, recordController.createRecord );
router.get( '/all-records', recordController.readRecords );
router.get( '/records', authMiddleware.isLoggedIn, recordController.readAllRecordsOfSpecificUser );
router.get('/records/:id', authMiddleware.isLoggedIn, recordController.readRecord);
router.put('/records/:id', authMiddleware.isLoggedIn, recordController.updateRecord);
// router.delete('/records/:id', recordController.deleteRecord);
router.delete('/records/:id', authMiddleware.isLoggedIn, recordController.deleteRecord);

module.exports = router;