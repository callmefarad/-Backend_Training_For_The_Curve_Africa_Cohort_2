const mongoose = require( 'mongoose' );

const profileSchema = new mongoose.Schema( {
    profileName: {
        type: String,
        required: true
    },
    profilePhone: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    }
}, { timestamps: true } );

const profileModel = mongoose.model( 'profile', profileSchema );

module.exports = profileModel