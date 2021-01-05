const multer = require("multer");
const mkdirp = require("mkdirp");
const fs = require("fs");

const getDirImage = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDay();
  return `./public/upload/${year}/${month}/${day}`;
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = getDirImage();

      mkdirp(dir)
        .then(made => cb(null, dir))
        .catch(err => console.error(err));
    },
    filename: function (req, file, cb) {
      const newFile = getDirImage() + "/" + file.originalname;
      if(fs.existsSync(newFile))
        file.originalname = Date.now() + "-" + file.originalname;

      cb(null, file.originalname);

    }
  });

const uploadImage = multer({
  storage
});

module.exports = uploadImage;