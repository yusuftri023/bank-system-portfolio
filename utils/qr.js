const express = require("express");
const router = express.Router();
const fs = require("fs");
const qr = require("node-qr-image");

router.use("/qr/png", (req, res) => {
  const qr_png = qr.image("https://www.youtube.com/watch?v=mIWplmdkwDk", {
    type: "png",
    ec_level: "H",
    size: 500,
  });
  qr_png.pipe(fs.createWriteStream("./public/qr-images/qr-image-test3.png"));
});
