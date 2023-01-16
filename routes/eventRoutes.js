var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const { find } = require('./../models/eventModel');
const Event = require('./../models/eventModel');

// Get events near a latitude and longitude
router.get('/', async (req, res) => {
    if (!req.query.latitude) { 
        res.status(400)
        res.json({'error': 'your events request must include a latitude.'});
    }
    if (!req.query.longitude) {
        res.status(400)
        res.json({'error': 'your events request must include a longitude.'});
    }
    let latitude = req.query.latitude;
    let longitude = req.query.longitude;
    var radius = 50;
    if (req.query.radius) { radius = req.query.radius }
    Event(find)
});

router.get('/:eventId', async (req, res) => {
    Event.findById(req.params.eventId, (error, documents) => {
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
        place: { geocodes: { latitude: req.body.place.geocodes.latitude, longitude: req.body.place.geocodes.longitude}},
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