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

// Get events near a latitude and longitude
// radius should be provided in meters
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

function distanceSearchRadius(meters) {
    return meters / 6378152.1408;
}

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

router.post('/', async (req, res) => {
    let now = new Date();
    const newEvent = new Event({
        location: { type: "Point", coordinates: [req.body.location.longitude, req.body.location.latitude] },
        foursquareData: { id: req.body.foursquareData.id, name: req.body.foursquareData.name, address: { formattedString: req.body.foursquareData.address.formattedString }, category: { name: req.body.foursquareData.category.name, id: req.body.foursquareData.category.id }},
        name: req.body.name,
        createdBy: req.body.createdBy,
        linkedUsers: [req.body.createdBy],
        description: req.body.description,
        createdAt: now,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
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