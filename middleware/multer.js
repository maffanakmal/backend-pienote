const multer = require("multer");

const storage = multer.diskStorage({
    destination: (_, file, cb) => {
        cb(null, "public/images");
    },
    filename: (_, file, cb) => {
        const filename = new Date().getTime().toString() + "-" + file.originalname;
        cb(null, filename);
    },
});

const fileFilter = (_, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        return cb(null, true);
    }
    cb(new Error("Only .png, .jpg, .jpeg formats are allowed"), false);
};

const upload = multer({ storage, fileFilter }).single("image");

module.exports = upload;
