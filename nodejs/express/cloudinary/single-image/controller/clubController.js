const clubModel = require( '../model/clubModel' );
const cloudinary = require( "cloudinary" ).v2;

const createClub = async (req, res) => {
    try {
        const { league, club } = req.body;

        const result = await cloudinary.uploader.upload( req.file.path );
        // const publicId = getPublicIdFromUrl( req.file.path );
        const newClub = new clubModel( {
            league,
            club,
            logo: result.secure_url,
            // logo: req.file.path,
            publicId: result.public_id,
        } )
        
        const savedClub = await newClub.save();
        // console.log(`old club: ${savedClub}`);
        if ( !savedClub ) {
            res.status( 400 ).json( {
                message: "Unable to create club"
            })
        } else {
            res.status( 201 ).json( {
                message: "Club created successfully",
                data: savedClub
            })
        }
    } catch ( e ) {
        res.status( {
            message: e.message
        })
    }
}

const getClubs = async ( req, res ) => {
    const club = await clubModel.find();
    try {
        if ( club ) {
            res.status( 200 ).json( {
                data: club
            })
        } else {
            res.status( 404 ).json( {
                message: 'Clubs not found such club.'
            })
        }
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}

const getClub = async ( req, res ) => {
    const clubId = req.params.id;
    const club = await clubModel.findById(clubId);
    try {
        if ( !club ) {
            res.status( 404 ).json( {
                message: `Club with id: ${clubId} not found.`
            })
        } else {
            res.status( 200 ).json( {
                data: club
            })
        }
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}

const updateClub = async ( req, res ) => {
    try {
    const { id } = req.params;
    const { league, club } = req.body;

    let clubs = await clubModel.findById(id);
    if (!clubs) {
      return res.status(404).json({ error: 'club not found' });
    }

    if (req.file) {
      // Delete the previous image from Cloudinary
      await cloudinary.uploader.destroy(clubs.logo);
    } else {
        // Upload the new image to Cloudinary
        const result = await cloudinary.uploader.upload( req.file.path );

      // Update the profileImage field with the new image URL
        clubs.logo = result.secure_url;
        clubs.logo = req.file.path;
        // clubs.publicId = result.public_id;
        clubs.league = league || clubs.league;
    clubs.club = club || clubs.club;

    await clubs.save();
    // console.log( `new club: ${clubs}` );

    res.json(clubs);
    }
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to update image' });
  }

    // const test = "https://res.cloudinary.com/callmefarad/image/upload/v1686905711/club_images/fhzj5gkpvwpu4rbht7nu.png"
    // const startIndex = test.lastIndexOf( '/' ) + 1;
    // const endIndex = test.lastIndexOf( '.' ) 
    // console.log( test.substring( startIndex, endIndex ));
}


const deleteClub = async ( req, res ) => {
    try {
        const clubId = req.params.id;
        const check = await clubModel.findById(clubId)
        // const clubs = await clubModel.findByIdAndDelete( id );
        console.log(check.logo)
        if ( check ) {
      // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(check.publicId);
    //   await cloudinary.uploader.destroy(clubs.publicId);
            await clubModel.findByIdAndDelete( clubId );
      res.json({ message: 'clubs deleted successfully' });
    } else {
      res.status(404).json({ error: 'clubs not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete clubs' });
  }
}



const getPublicIdFromUrl = (url) => {
    const startIndex = url.lastIndexOf( '/' ) + 1;
    const endIndex = url.lastIndexOf( '.' )
    return url.substring( startIndex, endIndex );
}


module.exports = {
    createClub,
    getClubs,
    getClub,
    updateClub,
    deleteClub,
}