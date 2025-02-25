const express = require('express');
const router = express.Router();
const Chair = require('../models/chair');
const Table = require("../models/Table");

router.put('/:chairId/toggle', async (req, res) => {
    try {
        const chair = await Chair.findById(req.params.chairId);
        if (!chair) {
            return res.status(404).json({ message: 'Chair not found' });
        }

        // Toggle the isOccupied state
        chair.is_occupied = !chair.is_occupied;
        await chair.save();

        res.json(chair);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/chairs', async (req, res) => {
    const { number_of_chairs } = req.body; // e.g., how many chairs to create

    try {
        const chairsData = Array.from({ length: number_of_chairs }, (_, i) => ({
            number_associated: i + 1,
            is_occupied: false,
        }));

        const createdChairs = await Chair.insertMany(chairsData);

        res.status(201).json({
            message: `${createdChairs.length} chair(s) created successfully.`,
            chairs: createdChairs,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/addChair', async (req, res) => {
    const { number_associated } = req.body; // e.g., how many chairs to create

    try {

        if (number_associated === undefined ) {
            return res.status(400).json({ message: 'Please provide both number_associated' });
        }
        const chair = new Chair({
            number_associated,

        });

        const newChair = await chair.save();
        res.status(201).json({
            message: 'Chair created successfully',
            chair: newChair,
        });




    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const chairs = await Chair.find();
        res.json(chairs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const chair = await Chair.findById(req.params.id);

        if (!chair) {
            return res.status(404).json({ error: "Chair not found" });
        }

        res.json(chair);
    } catch (error) {
        res.status(500).json({ error: "Error fetching chair: " + error.message });
    }
});


module.exports = router;