require("dotenv").config();
const fs = require("fs");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// using 2 method for sending html in email that contain image
// first using filesystem module to read and access the data (in string) by using callback in parameter
// second using ejs to render ejs html file

async function sendMailActivation(subject, to, from = "yusuftri023@gmail.com") {
  fs.readFile(
    "./public/texts/index.html",
    "utf-8",
    async function (err, contents) {
      if (err) {
        console.log(err);
        return;
      }
      let edithtml = contents.replace(/your email ./, `your email ${to} .`);
      await transporter.sendMail({
        from,
        to,
        subject,
        html: edithtml,
        attachments: [
          {
            filename: "image-1.png",
            path: "./public/texts/images/image-1.png",
            cid: "image1",
          },
          {
            filename: "image-2.png",
            path: "./public/texts/images/image-2.png",
            cid: "image2",
          },
          {
            filename: "image-3.gif",
            path: "./public/texts/images/image-3.gif",
            cid: "image3",
          },
        ],
      });
    }
  );
}

async function sendMailResetPassword(
  subject,
  to,
  urltoken,
  from = "yusuftri023@gmail.com"
) {
  let htmlRender = await ejs.renderFile("./app/views/resetpasswordemail.ejs");
  let edithtml = htmlRender
    .replace(/Your Email :/, `Your Email : ${to}`)
    .replace(/href="google.com"/g, `href="${urltoken}"`);
  await transporter.sendMail({
    from,
    to,
    subject,
    html: edithtml,
    attachments: [
      {
        filename: "image-1.png",
        path: "./app/views/resetpassword/image-1.png",
        cid: "image1",
      },
      {
        filename: "image-2.png",
        path: "./app/views/resetpassword/image-2.png",
        cid: "image2",
      },
      {
        filename: "image-3.png",
        path: "./app/views/resetpassword/image-3.png",
        cid: "image3",
      },
      {
        filename: "image-4.png",
        path: "./app/views/resetpassword/image-4.png",
        cid: "image4",
      },
    ],
  });
}

module.exports = { sendMailActivation, sendMailResetPassword };
