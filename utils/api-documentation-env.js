const { readFile, writeFile } = require("fs");
module.exports = {
  apiDocumentationInitialization: function () {
    readFile("./api_documentation.json", "utf-8", function (err, contents) {
      if (err) {
        console.log(err);
        return;
      }
      let replaced;
      if (
        process.env.NODE_ENV === "development" &&
        !contents.includes(`"url": "http://localhost"`)
      ) {
        replaced = contents.replace(/"url": ".+"/, `"url": "http://localhost"`);
      }
      if (
        process.env.NODE_ENV === "production" &&
        !contents.includes(`"url": "https://bank-system-api.onrender.com"`)
      ) {
        replaced = contents.replace(
          /"url": ".+"/,
          `"url": "https://bank-system-api.onrender.com"`
        );
      }

      if (replaced) {
        writeFile(
          "./api_documentation.json",
          replaced,
          "utf-8",
          function (err) {
            console.log(err);
          }
        );
      }
    });
  },
};
