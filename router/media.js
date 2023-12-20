const express = require("express");
const router = express.Router();
const storage = require("../utils/multer");
const controller = require("../app/controller/api/v2/media");

router.post(
  "/api/v2/images",
  storage.image.single("image"),
  controller.uploadImage
);
router.post(
  "/api/v2/files",
  storage.application.single("file"),
  controller.uploadFile
);
router.post(
  "/api/v2/videos",
  storage.video.single("video"),
  controller.uploadVideo
);
router.post(
  "/api/v2/texts",
  storage.text.single("text"),
  controller.uploadText
);

router.post("/api/v2/qr-images", controller.qrGenerateToUpload);
module.exports = router;
