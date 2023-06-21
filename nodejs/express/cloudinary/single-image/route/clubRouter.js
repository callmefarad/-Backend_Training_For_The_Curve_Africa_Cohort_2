const express = require( 'express' );
const router = express.Router();
const { createClub, getClubs, getClub, updateClub, deleteClub} = require( '../controller/clubController' )
const {upload} = require( '../utils/cloudinary' );

router.post( '/clubs', upload.single('logo'), createClub )
// router.post( '/clubs', createClub )
router.get( '/clubs', getClubs )
router.get( '/clubs/:id', getClub )
router.put( '/clubs/:id', upload.single('logo'), updateClub )
// router.put( '/clubs/:id', updateClub )
router.delete( '/clubs/:id', deleteClub )

module.exports = router;