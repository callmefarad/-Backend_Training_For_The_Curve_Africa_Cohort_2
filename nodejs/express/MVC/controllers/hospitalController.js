const hospitalModel = require( '../models/hospitalModel' );

// format 1
// create a new patient
const newPatient = async ( req, res ) => {
    try {
        const bodyData = {
            name: req.body.name,
            address: req.body.address,
            medicalHistory: req.body.medicalHistory,
            bloodGroup: A,
            phone: 08012345678,
        }
        const patient = await hospitalModel.create( bodyData );
        if ( patient.data.length !== 0 ) {
            res.status( 200 ).json( {
                Message: console.log( "new patient created." ),
                data: patient
            } )
        } else {
            res.status( 400 ).json( {
                Message: "Unable to create new patient."
            })
        }
    } catch (error) {
        res.status( 500 ).json( {
            Message: error.Message
        })
    }
}

const allPatience = async ( req, res ) => {
    try {
        const patients = await hospitalModel.find();
        console.log( patients.length );
        if (patients) {
            res.status( 200 ).json( {
                Message: "Patients found.",
                data: patients,
                totalPatience: patience.length
            })
        } else {
            res.status( 404 ).json( {
                Message: "No patient available"
            })
        }
    } catch ( e ) {
        res.status( 500 ).json( {
            Message: e.message
        })
    }
}

const getPatient = async ( req, res ) => {
    try {
        const patientId = req.params.id;
        const patient = await hospitalModel.findById( patientId)
        if ( !patient ) {
            res.status( 404 ).json( {
                Message: `Can not get user with this id: ${patientId}`
            })
        } else {
            res.status( 200 ).json( {
                Message: "Patient found.",
                data: patient
            })
        }
    } catch ( error ) {
        res.status( 500 ).json( {
            Message: error.message
        })
    }
}

const updatePatient = async ( req, res ) => {
    try {
        const hospitalId = req.params.id;
        const updatedPatient = await hospitalId.findByIdAndUpdate( hospitalId, req.body, { new: true } )
        if ( updatedPatient ) {
            res.status( 200 ).json( {
                Message: "Updated successfully.",
                data: updatedPatient
            })
        }
    } catch ( error ) {
        res.status( 500 ).json( {
            Message: error.message
        })
    }
}

const deletePatient = async (req, res) => {
    try {
        const hospitalId = req.params.id;
        const deletedPatient = await hospitalModel.findByIdAndRemove( hospitalId );
        if ( deletedPatient ) {
            res.status( 200 ).json( {
                Message: "deleted successfully"
            })
        } else {
            res.status( 400 ).json( {
                Message: "Unable to delete Patient."
            })
        }
        
    } catch ( error ) {
        res.status( 500 ).json( {
            Message: error.message
        })
    }
}

module.exports = {
    newPatient,
    allPatience,
    getPatient,
    updatePatient,
    deletePatient,
}