var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const { find } = require('./../models/photoModel');
const Photo = require('./../models/photoModel');
const AWS = require("aws-sdk");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require('multer');
const multerS3 = require('multer-s3');
const sizeOf = require('image-size');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1"
});

const s3 = new AWS.S3();

// router.get('/:id', async (req, res) => {
//     const id = req.params.id;
//     Photo.findById(id, (error, documents) => {
//         if (error) { 
//             res.sendStatus(404); 
//         } else {
//             let returnedPhoto = documents[0].toiOSClient();
//             res.status(200);
//             res.json(returnedPhoto);
//         }
//     });
// });

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'afterparty-staging-images',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            const fileName = Date.now().toString() + "-" + file.originalname;
            const path = req.params.eventId + "/fullSize/" + fileName;
            console.log("Will upload to path: " + path);
            cb(null, path);
        }
    })
});

function uploadThumbnail(originalImage) {
    sizeOf(originalImage, (err, dimensions) => {
        if (err) {
          console.log(err);
        } else {
          console.log(dimensions.width, dimensions.height);
        }
    });
}

router.get('/:eventId', async (req, res) => {
    console.log("route hit");
    let parameters = {};
    let eventId = req.params.eventId;
    if (eventId != null) {
        parameters.eventId = {
            $regex: eventId
        }
    }
    let eventPhotos = await Photo.find(parameters).sort({ createdAt: -1 });
    let returnedPhotos = eventPhotos.map(photo => photo.toiOSClient());
    res.status(200);
    res.json({"photos": returnedPhotos});
});

router.post('/:eventId/:userId/upload', upload.single("uploadedImage"), async (req, res) => {
    res.status(201);
    let now = new Date();
    const newPhoto = new Photo({
        eventId: req.params.eventId,
        createdBy: req.params.userId,
        createdAt: now,
        fullSizeUrl: req.file.location,
        thumbnailUrl: null
    });
    await newPhoto.save((error, result) => {
        if (error) {
            console.log(error);
            res.status(400);
            res.json({"error": "Could not save photo"});
        } else {
            res.status(201);
            let response = result.toiOSClient();
            res.json(response);
        }
    });
});
  
module.exports = router;