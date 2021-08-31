//.ENV
const dotenv = require("dotenv");
dotenv.config();

//FIREBASE
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.storageBucket,
});
const bucket = admin.storage().bucket();
const db = admin.firestore();

//Fetch or AXOIS
const fetch = require("node-fetch");

//FILE SYSTEM
const FileType = require("file-type");
const path = require("path");
const os = require("os");
const fs = require("fs");

async function uploadImageToFirebase() {
  console.log("You call this function !!!");
  let image_id = "14627536262204";
  let url = `https://api-data.line.me/v2/bot/message/${image_id}/content`;
  let response = await fetch(url, {
    headers: {
      Authorization: "Bearer " + process.env.channelAccessToken,
    },
  });
  let buffer = await response.buffer();
  // MAKE FILE NAME
  let random_name = "_" + Math.random().toString(36).substr(2, 9);
  let file_type = await FileType.fromBuffer(buffer);
  let filename = random_name + "." + file_type.ext;
  // PRINT INFORMATION
  console.log(random_name);
  console.log(file_type);
  console.log(filename);

  const tempLocalFile = path.join(os.tmpdir(), filename);
  console.log(tempLocalFile);
  fs.writeFileSync(tempLocalFile, buffer);
  bucket.upload(
    tempLocalFile,
    { public: true },
    async function (err, file, apiResponse) {
      console.log("Uploaded !!!", apiResponse.mediaLink);
      let media = await db
        .collection("medias")
        .add({ mediaLink: apiResponse.mediaLink });
      console.log("Added document with ID: ", media.id);

      fs.unlinkSync(tempLocalFile);
    }
  );
}

uploadImageToFirebase();
