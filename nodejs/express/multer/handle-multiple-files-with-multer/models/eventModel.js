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
    eventImages: [
        {
        type: String,
        required: true
    },
    ]
}, { timestamps: true } )

const eventModel = mongoose.model( 'event', eventSchema );
module.exports = eventModel;