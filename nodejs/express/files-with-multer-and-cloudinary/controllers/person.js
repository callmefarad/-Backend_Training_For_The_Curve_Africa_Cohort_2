const profileModel = require( '../models/person' );
const cloudinary = require( '../utils/cloudinary' );
const fs = require( 'fs' );


// create new profile
const createProfile = async ( req, res ) => {
    try {
        const {profileName, profilePhone} = req.body

        // upload image to cloudinary
        const result = await cloudinary.uploader.upload( req.file.path )
        
        // create profile
        const profile = new profileModel( {
            profileName,
            profilePhone,
            profileImage: result.secure_url,
        } )
        
        // save the new profile
        const newProfile = await profile.save();
        console.log( newProfile );

        // delete the image from the local directory
        await fs.unlinkSync( req.file.path )
        
        if ( newProfile ) {
            console.log( newProfile );
            res.status( 201 ).json( {
                message: "Profile created successfully",
                data: newProfile,
            })
        } else {
            res.status( 400 ).json( {
                message: "Unable to create profile"
            })
        }

    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}

const getProfiles = async ( req, res ) => {
    try {
        const profiles = await profileModel.find();
        if ( profiles === null ) {
            res.status( 200 ).json( {
                message: "No profile found.",
                data: []
            })
        } else {
            res.status( 200 ).json( {
                data: profiles
            })
        }
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}

// get a profile
const getProfile = async ( req, res ) => {
    try {
        const { id } = req.params;
        const profile = await profileModel.findById( id );
        if ( !profile ) {
            res.status( 404 ).json( {
                message: `No profile with id ${id}`
            })
        } else {
            res.status( 200 ).json( {
                data: profile,
            })
        }
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}

// update profile
const updateProfile = async ( req, res) => {
    try {
         const profile = await profileModel.findById(req.params.id);
    if (profile) {
      // Delete the existing image from local upload folder and Cloudinary
      if (profile.profileImage) {
        const publicId = profile.profileImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      
      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      
      // Update the profile data in MongoDB
      profile.profileName = req.body.profileName;
      profile.profilePhone = req.body.profilePhone;
      profile.profileProfileImage = result.secure_url;
      await profile.save();
      // Delete file from local upload folder
      fs.unlinkSync(req.file.path);

      res.json({ message: 'profile updated successfully', data: profile });
    } else {
      res.status(404).json({ error: 'profile not found' });
    }
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

// delete profile 
const deleteProfile = async ( req, res ) => {
    try {
        const profile = await profileModel.findById(req.params.id);
    if (profile) {
      // Delete the image from local upload folder and Cloudinary
      if (profile.profileImage) {
        const publicId = profile.profileImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Delete the profile from MongoDB
      await profileModel.findByIdAndDelete(req.params.id);

      res.json({ message: 'profile deleted successfully' });
    } else {
      res.status(404).json({ error: 'profile not found' });
    }
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}

module.exports = {
    createProfile,
    getProfiles,
    getProfile,
    updateProfile,
    deleteProfile,
}