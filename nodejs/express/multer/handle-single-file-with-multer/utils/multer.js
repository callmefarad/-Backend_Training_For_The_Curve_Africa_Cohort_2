const multer = require('multer');

const storage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
        cb(null, './uploads')
    },
    filename: ( req, file, cb ) => {
        cb(null, file.originalname)
    }
} );

fileFilter = ( req, file, cb ) => {
    if ( file.mimetype.startsWith( "image/" )){
        cb(null, true)
    } else {
        cb(new Error("Only image file is supported"), false)
    }
}

fileSize = {
    limits: 1024 * 1024 * 5,
}

const upload = multer( {
    storage,
    fileFilter,
    fileSize
})

module.exports = upload;