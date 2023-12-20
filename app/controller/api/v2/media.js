const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const qr = require("node-qr-image");
const imagekit = require("../../../../utils/imagekit");
const { error } = require("console");

module.exports = {
  uploadImage: (req, res) => {
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;

    return res.status(200).json({
      status: true,
      message: "success",
      data: {
        image_url: imageUrl,
      },
    });
  },
  uploadFile: (req, res) => {
    const fileUrl = `${req.protocol}://${req.get("host")}/applications/${
      req.file.filename
    }`;

    return res.status(200).json({
      status: true,
      message: "success",
      data: {
        file_url: fileUrl,
      },
    });
  },
  uploadVideo: (req, res) => {
    const videoUrl = `${req.protocol}://${req.get("host")}/videos/${
      req.file.filename
    }`;

    return res.status(200).json({
      status: true,
      message: "success",
      data: {
        video_url: videoUrl,
      },
    });
  },
  uploadText: (req, res) => {
    const textUrl = `${req.protocol}://${req.get("host")}/texts/${
      req.file.filename
    }`;

    return res.status(200).json({
      status: true,
      message: "success",
      data: {
        text_url: textUrl,
      },
    });
  },
  qrGenerate: (req, res) => {
    let qr_png;
    if (typeof req.body.string === "object" && req.body.string !== null) {
      const jsonString = JSON.stringify(req.body.string);
      qr_png = qr.image(jsonString, { type: "png", ec_level: "H", size: 500 });
    } else {
      qr_png = qr.image(req.body.string, {
        type: "png",
        ec_level: "H",
        size: 500,
      });
    }

    const date = new Date();
    const dateString = Intl.DateTimeFormat("sv-SE");
    const formattedTime = dateString.format(date);
    const currentTime = date.getTime();
    if (!fs.existsSync(`./public/qr-images/${formattedTime}`)) {
      fs.mkdirSync(`./public/qr-images/${formattedTime}`);
    }

    qr_png.pipe(
      fs.createWriteStream(
        `./public/qr-images/${formattedTime}/qr-image-${currentTime}.png`
      )
    );
    const qrUrl = `${req.protocol}://${req.get(
      "host"
    )}/qr-images/${formattedTime}/qr-image-${currentTime}.png`;
    res.status(200).json({
      status: "success",
      message: "qr code generation complete",
      qrUrl: qrUrl,
    });
  },
  imagekitUpload: async (req, res, next) => {
    try {
      const stringFile = req.file.buffer.toString("base64");
      const uploadImage = await imagekit.upload({
        fileName: req.file.originalname,
        file: stringFile,
      });
      req.uploadImage = uploadImage;
      next();
    } catch (error) {
      throw error;
    }
  },
  qrGenerateToUpload: async (req, res) => {
    try {
      let qr_png;
      if (typeof req.body.string === "object" && req.body.string !== null) {
        const jsonString = JSON.stringify(req.body.string);
        qr_png = qr.image(jsonString, {
          type: "png",
          ec_level: "H",
          size: 500,
        });
      } else {
        qr_png = qr.image(req.body.string, {
          type: "png",
          ec_level: "H",
          size: 500,
        });
      }
      const date = new Date();
      const dateString = Intl.DateTimeFormat("sv-SE");
      const formattedTime = dateString.format(date);
      const currentTime = date.getTime();
      await imagekit.createFolder({
        folderName: `${formattedTime}`,
        parentFolderPath: "/",
      });
      const uploadFile = await imagekit.upload({
        fileName: `qr-image-${currentTime}`,
        file: qr_png,
        folder: `/${formattedTime}/`,
      });
      return res.status(200).json({
        status: true,
        code: 200,
        message: "QR code has been uploaded",
        data: {
          fileName: uploadFile.name,
          fileUrl: uploadFile.url,
          type: uploadFile.fileType,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
