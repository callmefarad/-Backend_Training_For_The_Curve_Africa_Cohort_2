const express = require( 'express' );
const router = express.Router();
const upload = require( '../utils/multer' );
const { createProfile, getProfiles, getProfile, updateProfile, deleteProfile } = require( '../controllers/person' );
const validateProfile = require('../middleware/hapiJoy')



router.post( '/profiles', validateProfile, upload.single('profileImage'), createProfile );
router.get( '/profiles', getProfiles );
router.get( '/profiles/:id', getProfile );
router.put( '/profiles/:id', validateProfile, upload.single('profileImage'), updateProfile );
router.delete( '/profiles/:id', upload.single('profileImage'), deleteProfile );

module.exports = router;