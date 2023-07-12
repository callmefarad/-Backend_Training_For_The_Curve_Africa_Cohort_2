const cloudinary = require( 'cloudinary' )

cloudinary.config({ 
  cloud_name: 'callmefarad', 
  api_key: '993829221415253', 
  api_secret: 'CMmMXgXEKuE-jlxPEvbZjZgorcc' 
});

module.exports = cloudinary;