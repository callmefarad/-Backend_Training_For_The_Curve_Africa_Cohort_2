const cloudinary = require( 'cloudinary' ).v2;
const { CloudinaryStorage } = require( 'multer-storage-cloudinary' );
const multer = require( "multer" );


cloudinary.config({ 
  cloud_name: 'callmefarad', 
  api_key: '993829221415253', 
  api_secret: 'CMmMXgXEKuE-jlxPEvbZjZgorcc' 
} );

const storage = new CloudinaryStorage( {
    cloudinary,
    // params: {
    //     folder: 'club_images',
    //     allowed_formats: ['jpg', 'png', 'jpeg']
    // },
});

const upload = multer( { storage } );

module.exports = upload;