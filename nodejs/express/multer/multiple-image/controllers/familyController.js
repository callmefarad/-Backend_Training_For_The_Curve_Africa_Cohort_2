const familyModel = require( '../model/familyModel' );
const fs = require( 'fs' );

// new family
const createFamily = async ( req, res, next ) => {
        const { fatherName, motherName } = req.body;
        const childrenImages = req.files[ "childrenImages" ].map( ( file ) => file.filename );
        const newFamily = new familyModel( {
            fatherName,
            motherName,
            childrenImages
        } )
    try {
        const savedFamily = await newFamily.save();
        if ( savedFamily ) {
            res.status( 201 ).json( {
                message: "Created successfully",
                data: savedFamily
            })
        } else {
            res.status( 400 ).json( {
                message: "Error creating family"
            })
        }
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

const getFamilies = async ( req, res ) => {
    try {
        const families = await familyModel.find();
        if ( families.length === 0 ) {
            res.status( 200 ).json( {
                message: "No family found.",
                data: []
            })
        } else {
            res.status( 200 ).json( {
                data: families,
                totalFamily: families.length
            })
        }
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}
const getFamily = async ( req, res ) => {
    try {
        const { id } = req.params;
        const family = await familyModel.findById( id );
        if ( !family ) {
            res.status( 404 ).json( {
                message: `Family with id: ${id} not found.`
            })
        } else {
            res.status( 200 ).json( {
                data: family
            })
        }
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

const updateFamily = async ( req, res ) => {
    const { id } = req.params;
    const family = await familyModel.findById( id );
    try {
        const { fatherName, motherName } = req.body;
        const bodyData = {
            motherName: motherName || family.motherName,
            fatherName: fatherName || family.fatherName,
            childrenImages: family.childrenImages,
        }

        if ( req.files && req.files[ "childrenImages" ] ) {
            const oldFamilyImagePath = `uploads/${ family.childrenImages }`;
            if ( fs.existsSync( oldFamilyImagePath ) ) {
                fs.unlinkSync( oldFamilyImagePath );
            }
            bodyData.childrenImages = req.files[ "childrenImages" ].map((file)=>file.filename);
        }
        
        const updatedFamily = await familyModel.findByIdAndUpdate( id, bodyData, { new: true } )
        if ( !updatedFamily ) {
            res.status(404).json({ message: "Family can not be updated."})
        } else {
            res.status( 200 ).json( {
                message: "Updated successfully.",
                data: updatedFamily
            })
        }
        
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}

const deleteFamily = async ( req, res ) => {
    const { id } = req.params;
    const family = await familyModel.findById( id );
    try {
        if ( !family ) {
            res.status( 404 ).json( {
                message: "Family not found"
            })
        } else {
            const oldFamilyImagePath = `upload/${ family.childrenImages }`;
            if ( fs.existsSync( oldFamilyImagePath ) ) {
                fs.unlinkSync( oldFamilyImagePath)
            }
        }
        await familyModel.findByIdAndDelete( id );
        res.status( 200 ).json( {
            message: 'Family deleted successfully'
        })
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}

module.exports = {
    createFamily,
    getFamilies,
    getFamily,
    updateFamily,
    deleteFamily,
}