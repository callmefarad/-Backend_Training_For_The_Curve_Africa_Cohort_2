const express = require( 'express' );
const router = express.Router();
const { createFamily, getFamilies, getFamily, updateFamily, deleteFamily} = require( "../controllers/familyController" );
const upload = require('../utils/multer')


router.post( "/families", upload.fields([{name: "childrenImages", maxCount: 10}]), createFamily );
router.get( "/families", getFamilies );
router.get( "/families/:id", getFamily );
router.put( "/families/:id", upload.fields([{name: "childrenImages", maxCount: 10}]), updateFamily );
router.delete( "/families/:id", deleteFamily );

module.exports = router;