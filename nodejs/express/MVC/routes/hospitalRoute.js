const express = require( 'express' );
const router = express.Router();
const {
    newPatient,
    allPatience,
    getPatient,
    updatePatient,
    deletePatient,
} = require("../controllers/hospitalController")


router.post('/patients', newPatient);
router.get('/patients', allPatience);
router.get('/patients/:id', getPatient);
router.put('/patients/:id', updatePatient);
router.get('/patients/:id', deletePatient);

module.exports = router;