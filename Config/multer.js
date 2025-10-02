const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(
            null,
            path.join(__dirname, "/uploads")
        );
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },

});