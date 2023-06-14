const express = require( 'express' );
const studentModel = require( '../models/studentModel' );
const fs = require( 'fs' );


// create new student profile
const createProfile = async ( req, res ) => {
    const { name, course } = req.body;
    const profile = new studentModel( {
        name,
        course,
        profileImage: req.files[ "profileImage" ][ 0 ].filename,
    } );
    try {
        const savedProfile = await profile.save();
        if ( savedProfile ) {
            res.status( 201 ).json( {
                message: "Profile saved successfully",
                data: savedProfile
            })
        } else {
            res.status( 400 ).json( {
                message: "Could not create profile"
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
        const profiles = await studentModel.find();
        if ( profiles.length === 0 ) {
            res.status( 400 ).json( {
                message: "No profile is available"
            })
        } else {
            res.status( 200 ).json( {
                message: "All profiles",
                data: profiles,
                totalProfiles: profiles.length
            })
        }
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}

const getProfile = async ( req, res ) => {
    try {
        const profileId = req.params.id;
        const profile = await studentModel.findById( profileId );
        if ( !profile ) {
            res.status( 404 ).json( {
                message: "No profile found."
            })
        } else {
            res.status( 200 ).json( {
                data: profile
            })
        }
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}

const updateProfile = async (req, res) => {
  const profileId = req.params.id;
  const profile = await studentModel.findById( profileId );
  try {
    const { name, course } = req.body;
    const updateFields = {
      name: name || profile.name,
      course: course || profile.course,
      profileImage: profile.profileImage,
      };

    // check if the profileImage is to be updated
    if (req.files && req.files["profileImage"]) {
      const oldProfileImagePath = `uploads/${profile.profileImage}`;
      // Delete the old image if it exists
      if (fs.existsSync(oldProfileImagePath)) {
        fs.unlinkSync(oldProfileImagePath);
      }
      updateFields.profileImage = req.files.profileImage[0].filename;
    }

    const updatedProfile = await studentModel.findByIdAndUpdate(
      profileId,
      updateFields,
      { new: true }
      );
      console.log(updatedProfile)
    if (updatedProfile) {
      res.status(200).json({
        message: 'Updated successfully',
        data: updatedProfile,
      });
    } else {
      res.status(404).json({
        message: 'Profile not found.',
      });
    }
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

// Delete a particular profile
const deleteProfile = async (req, res) => {
  const profileId = req.params.id;
  try {
    const profile = await studentModel.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found.',
      });
    }
    const profileImagePath = `uploads/${profile.profileImage}`;
    if (fs.existsSync(profileImagePath)) {
      fs.unlinkSync(profileImagePath);
    }
    await studentModel.findByIdAndDelete(profileId);
    res.status(200).json({
      message: 'Profile deleted successfully',
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

module.exports = {
    createProfile,
    getProfiles,
    getProfile,
    updateProfile,
    deleteProfile
}