var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const { find } = require('./../models/eventModel');
const Event = require('./../models/eventModel');
const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1"
});

const s3 = new AWS.S3();

function setUpNewImageFolder(event) {
    const folderName = event.id.toString() + "/";
    const params = {
      Bucket: 'afterparty-staging-images',
      Key: folderName,
      Body: ''
    };
    s3.putObject(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Successfully created folder ${folderName} in S3 bucket`);
      }
    });
}

function distanceSearchRadius(meters) {
    return meters / 6378152.1408;
}

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get a list of events that are active
 *     description: Returns a list of events that can be joined
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Event"
 */
router.get('/', async (req, res) => {
    let parameters = {};
    const eventName = req.query.eventName;
    if (eventName != null) {
        if (eventName.trim().length < 3) {
            res.status(400);
            return res.json({"error": "A request containing a name query parameter needs to be at least three characters long"});
        } else {
            parameters.name = {
                $regex: eventName,
                $options: 'i'
            }
        }
    }
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    if ((latitude == null && longitude != null) || (latitude != null && longitude == null)) {
        res.status(400)
        res.json({'error': 'Your events request must include both a latitude and longitude.'});
    } else if (latitude != null && longitude != null) {
        var radius = req.query.radius ?? 50;
        parameters.location = {
            $geoWithin: {
                $centerSphere: [[req.query.longitude, req.query.latitude],distanceSearchRadius(radius) ]
            }
        }
    }
    let possibleMatches = await Event.find(parameters);
    let returnedEvents = possibleMatches.map(event => event.toiOSClient());
    res.status(200);
    res.json({"events": returnedEvents});
});

/**
 * @swagger
 * /events/id:
 *   get:
 *     summary: Get an event by its id
 *     description: Returns a single event per its identifier
 *     responses:
 *       200:
 *         description: an event
 *         content:
 *           application/json:
 *             schema:
 *               type: event
 *               items:
 *                 $ref: "#/components/schemas/Event"
 */
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    Event.findById(id, (error, documents) => {
        if (error) { 
            res.sendStatus(404); 
        } else {
            res.status(200);
            res.json(documents);
        }
    });
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Add a new event
 *     description: Opens a new valid event that can be joined
 *     responses:
 *       201:
 *         description: Returns an event that has just been created
 *         content:
 *           application/json:
 *             schema:
 *               type: event
 *               items:
 *                 $ref: "#/components/schemas/Event"
 */
router.post('/', async (req, res) => {
    let now = new Date();
    let endDate = new Date(req.body.endDate);
    let destroyDate = newDate(endDate);
    destroyDate.setHours(endDate.getHours() + 24);
    const newEvent = new Event({
        location: { type: "Point", coordinates: [req.body.location.longitude, req.body.location.latitude] },
        foursquareData: { id: req.body.foursquareData.id, name: req.body.foursquareData.name, address: { formattedString: req.body.foursquareData.address.formattedString }, category: { name: req.body.foursquareData.category.name, id: req.body.foursquareData.category.id }},
        name: req.body.name,
        createdBy: req.body.createdBy,
        linkedUsers: [req.body.createdBy],
        description: req.body.description,
        createdAt: now,
        startDate: new Date(req.body.startDate),
        endDate: endDate,
        destroyDate: destroyDate,
        lastUpdated: now
    });

    await newEvent.save((error, result) => {
        if (error) {
            console.log(error);
            res.status(400);
            res.json({'error': 'Could not create new object'});
        } else {
            res.status(201);
            let response = result.toiOSClient();
            setUpNewImageFolder(response);
            res.json(response);
        }
    })
});

module.exports = router;