const mongoose = require( "mongoose" );

const otpSchema = mongoose.Schema( {
    phone: {
        type: String,
        require: true
    },
    otp: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: {
            expires: 360
        }
    } // this token model will automatically be deleted from the database after 6mins
}, { timestamps: true } );

const otpModel = mongoose.model( 'Otp', otpSchema );

module.exports = otpModel;