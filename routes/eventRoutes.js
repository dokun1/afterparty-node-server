var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const { find } = require('./../models/eventModel');
const Event = require('./../models/eventModel');

// Get events near a latitude and longitude
// radius should be provided in meters
router.get('/', async (req, res) => {
    if (!req.query.latitude) { 
        res.status(400)
        res.json({'error': 'your events request must include a latitude.'});
    }
    if (!req.query.longitude) {
        res.status(400)
        res.json({'error': 'your events request must include a longitude.'});
    }
    var radius = req.query.radius ?? 50;
    let nearbyEvents = await Event.find({
        location: {
            $geoWithin: {
                $centerSphere: [[req.query.longitude, req.query.latitude],distanceSearchRadius(radius) ]
            }
        }
    });
    let returnedEvents = nearbyEvents.map(event => event.toiOSClient());
    res.status(200);
    res.json({"events": returnedEvents});
});

function distanceSearchRadius(meters) {
    return meters / 6378152.1408;
}

router.get('/:eventId', async (req, res) => {
    await Event.findById(req.params.eventId, (error, documents) => {
        if (error) { 
            res.sendStatus(404); 
        } else {
            res.status(200);
            res.json(documents);
        }
    });
});

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
            console.log(result);
            res.json({'result': 'success'});
        }
    })
});

module.exports = router;