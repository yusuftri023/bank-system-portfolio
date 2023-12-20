const multer = require("multer");
const path = require("path");

const filename = (req, file, callback) => {
  const fileName = Date.now() + path.extname(file.originalname);
  callback(null, fileName);
};

const generateStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, destination);
    },
    filename,
  });
};

module.exports = {
  image: multer({
    storage: generateStorage(`./public/images/`),
    fileFilter: (req, file, callback) => {
      const allowedMimeType = ["image/jpeg", "image/jpg", "image/png"];

      if (allowedMimeType.includes(file.mimetype)) {
        callback(null, true);
      } else {
        const err = new Error(
          `Only ${allowedMimeType.join(", ")} allowed to upload`
        );
        callback(err, false);
      }
    },
    onError: (err, next) => {
      next(err);
    },
  }),
  application: multer({
    storage: generateStorage(`./public/applications/`),
    fileFilter: (req, file, callback) => {
      const allowedMimeType = ["application/pdf", "application/vnd.ms-excel"];

      if (allowedMimeType.includes(file.mimetype)) {
        callback(null, true);
      } else {
        const err = new Error(
          `Only ${allowedMimeType.join(", ")} allowed to upload`
        );
        callback(err, false);
      }
    },
    onError: (err, next) => {
      next(err);
    },
  }),
  video: multer({
    storage: generateStorage(`./public/videos/`),
    fileFilter: (req, file, callback) => {
      const allowedMimeType = ["video/mp4"];

      if (allowedMimeType.includes(file.mimetype)) {
        callback(null, true);
      } else {
        const err = new Error(
          `Only ${allowedMimeType.join(", ")} allowed to upload`
        );
        callback(err, false);
      }
    },
    onError: (err, next) => {
      next(err);
    },
  }),
  text: multer({
    storage: generateStorage(`./public/texts/`),
    fileFilter: (req, file, callback) => {
      const allowedMimeType = ["text/plain"];

      if (allowedMimeType.includes(file.mimetype)) {
        callback(null, true);
      } else {
        const err = new Error(
          `Only ${allowedMimeType.join(", ")} allowed to upload`
        );
        callback(err, false);
      }
    },
    onError: (err, next) => {
      next(err);
    },
  }),
};
