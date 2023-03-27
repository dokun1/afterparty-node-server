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
            cb(null, path);
        }
    })
});


/**
 * @swagger
 * /photos/eventId
 *   get:
 *     summary: Return all photos for a given event
 *     description: Return all photos for a given event
 *     responses:
 *       200:
 *         description: a list of photo objects for an event
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Photo"
 */
router.get('/:eventId', async (req, res) => {
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

/**
 * @swagger
 * /photos/eventId/userId/upload:
 *   post:
 *     summary: Add a new photo for a given event from a given user
 *     description: Add a new photo for a given event from a given user
 *     responses:
 *       201:
 *         description: Returns a photo object that has just been created
 *         content:
 *           application/json:
 *             schema:
 *               type: photo
 *               items:
 *                 $ref: "#/components/schemas/Photo"
 */
router.post('/:eventId/:userId/upload', upload.single("uploadedImage"), async (req, res) => {
    res.status(201);
    let now = new Date();
    const newPhoto = new Photo({
        eventId: req.params.eventId,
        createdBy: req.params.userId,
        createdAt: now,
        fullSizeUrl: req.file.location,
        thumbnailUrl: null,
        likes: 0,
        comments: 0
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