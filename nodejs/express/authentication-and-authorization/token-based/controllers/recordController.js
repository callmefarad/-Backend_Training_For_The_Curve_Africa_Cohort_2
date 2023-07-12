const recordModel = require( '../models/recordModel' );

const createRecord = async ( req, res ) => {
    try {
        const { math, english } = req.body;
        const record = new recordModel( {
            math,
            english
        } )
        const savedRecord = await record.save();
        res.status( 201 ).json( {
            data: savedRecord
        })
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

const getRecords = async ( req, res ) => {
    try {
        const records = await recordModel.find();
        res.status( 201 ).json( {
            data: records
        })
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

const getRecord = async ( req, res ) => {
    const { id } = req.params;
    try {
        const record = await recordModel.findById( id );
        res.status( 201 ).json( {
            data: record
        })
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}
const updateRecord = async ( req, res ) => {
    const { id } = req.params;
    const { math, english } = req.body;
    try {
        const record = {
            math,
            english
        }
        const updateRecord = await recordModel.findByIdAndUpdate(id, record, {new: true} );
        res.status( 201 ).json( {
            data: updateRecord
        })
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}
const deleteRecord = async ( req, res ) => {
    const { id } = req.params;
    try {
        await recordModel.findByIdAndDelete(id);
        res.status( 201 ).json( {
            message: "Record deleted successfully."
        })
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

module.exports = {
    createRecord,
    getRecords,
    getRecord,
    updateRecord,
    deleteRecord
}