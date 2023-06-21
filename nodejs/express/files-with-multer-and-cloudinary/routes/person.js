const express = require( 'express' );
const router = express.Router();
const upload = require( '../utils/multer' );
const { createProfile, getProfiles, getProfile, updateProfile, deleteProfile} = require( '../controllers/person' )



router.post( '/profiles', upload.single('profileImage'), createProfile );
router.get( '/profiles', getProfiles );
router.get( '/profiles/:id', getProfile );
router.put( '/profiles/:id', upload.single('profileImage'), updateProfile );
router.delete( '/profiles/:id', upload.single('profileImage'), deleteProfile );

module.exports = router;