const jwt = require( 'jsonwebtoken' );
const bcrypt = require( 'bcrypt' );
const _ = require("lodash");
const otpGenerator = require( 'otp-generator' );
// vonage
const { Vonage } = require('@vonage/server-sdk')

// import the models
const userModel = require( '../models/userModel' );
const otpModel = require( '../models/otpModel' );



const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
})


// register user
const signUp = async (req, res) => {
    const { name, email, password, phone } = req.body;
    // check for existing user with their number
    const user = await userModel.findOne( {
        phone
    } )
    if ( user ) {
        res.status( 400 ).json( {
            message: "User already exists."
        })
    } else {
        // generate a one time password OTP
        // const OTP = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

        const OTP = generateNumericOTP();

        console.log( OTP );
        console.log("something")

        // use vonage to send sms
        const from = "Ubani Friday"
        const to = `+234${phone}`
        const text = `Verify your account with the OTP ${OTP} before you can login to your account.`

        async function sendSMS() {
        await vonage.sms.send({to, from, text})
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
        }

        sendSMS();

        // salt the OTP with the salt algorithm
        const saltedOtp = await bcrypt.genSalt( 10 );
        // hash the OTP
        const hashedOtp = await bcrypt.hash( OTP, saltedOtp );

        // create new OTP object from its model
        const newOtp = new otpModel( {
            name,
            email,
            password,
            phone,
            otp: hashedOtp,
        } );
        
        await newOtp.save();

        // send a response
        res.status( 200 ).json( {
            message: "OTP sent successfully.",
            data: newOtp,
        })
    }
}

// verify otp and save user
const verifyOtp = async ( req, res ) => {
    const { phone } = req.body;
    const user = userModel.findOne({phone})
    const allOtp = await otpModel.find( {
        phone
    } )
    if ( allOtp.length === 0 ) {
        res.status( 400 ).json( {
            message: "Your OTP has expired."
        })
    } else {
        // check for active or correct otp from various otp sent(get the last otp sent)
        const correctOtp = allOtp[ allOtp.length - 1 ];
        // compare the active otp with that on the database
        const validUser = await bcrypt.compare( req.body.otp, correctOtp.otp );

        // verify that the phone is correct
        if ( correctOtp.phone === phone && validUser ) {
            const newUser = new userModel(
                _.pick( req.body, [ 'phone' ] ) );
            // generate a token
            const token = await generateToken( user )
            
            // save the user
            const savedUser = await newUser.save();

            // delete the OTP in the database when the user is successfully verified
            await otpModel.deleteMany( {
                phone: correctOtp.phone,
            })

            // send a response
            res.status( 200 ).json( {
                message: "You are verified successfully.",
                data: savedUser,
                token,
            })
        } else {
            res.status( 400 ).json( {
                message: "Incorrect OTP submitted."
            })
        }
    }
}
// generate a token
const generateToken = async (user) => {
    const token = jwt.sign( {
        id: user._id,
        phone: user.phone
    },
        process.env.JWT_SECRET,
        { expiresIn: "5d" } )
    return token;
}

// generate 6 digit random otp
function generateNumericOTP() {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}


module.exports = {
    signUp,
    verifyOtp,
}