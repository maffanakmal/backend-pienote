const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    // Destination disimpan dimana?
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../files"))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extension = path.extname(file.originalname).toLocaleLowerCase()
        cb(null, file.fieldname + '-' + uniqueSuffix + extension)
    }
})

const upload = multer({ 
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}, // Membatasi ukuran file agar tidak lebih dari 5 mb 
})

module.exports = upload