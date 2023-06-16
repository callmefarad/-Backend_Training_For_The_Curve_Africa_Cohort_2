const mongoose = require( 'mongoose' );

const clubSchema = new mongoose.Schema( {
    league: {
        type: String,
        required: true
    },
    club: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    publicId: {
        type: String
    }
}, { timestamps: true } );

const clubModel = mongoose.model( 'club', clubSchema );

module.exports = clubModel;