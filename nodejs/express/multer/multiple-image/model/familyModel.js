const mongoose = require( 'mongoose' );

const familySchema = new mongoose.Schema( {
    fatherName: {
        type: String,
        required: true
    },
    motherName: {
        type: String,
        required: true
    },
    childrenImages: {
        type: Array,
        required: true
    }
}, { timestamps: true } );

const familyModel = mongoose.model( 'family', familySchema );

module.exports = familyModel;
