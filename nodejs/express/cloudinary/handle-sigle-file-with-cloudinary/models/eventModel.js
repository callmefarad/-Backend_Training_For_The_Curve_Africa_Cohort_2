const mongoose = require( 'mongoose' );

const eventSchema = new mongoose.Schema( {
    eventTitle: {
        type: String,
        required: true
    },
    eventContent: {
        type: String,
        required: true
    },
    titleImage: {
        type: String,
        required: true
    },
    cloudinary_id: {
        type: String
    }
}, { timestamps: true } )

const eventModel = mongoose.model( 'event', eventSchema );
module.exports = eventModel;