


const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({ rooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/room', async (req, res) => {
    try {
        const room = await Room.findOne(); // This will fetch only one room (first room)

        if (!room) {
            return res.status(404).json({ message: 'No room found' });
        }

        res.status(200).json({ room }); // Return the single room
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create a new table
router.post('/', async (req, res) => {
    const { number_of_people } = req.body;

    try {
        const room = new Room({
            number_of_people,

        });

        await room.save();
        res.status(201).json({ message: 'Room added successfully', room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.put('/:roomId/occupancy', async (req, res) => {
    const { roomId } = req.params;


    try {
        // Find the room by its ID
        const room = await Room.findById(roomId);

        // If room is not found, return a 404 error
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Toggle the is_occupied field (if true, set to false, and vice versa)
        room.is_occupied = !room.is_occupied;

        // Save the updated room
        await room.save();

        // Respond with the updated room
        res.status(200).json({ message: 'Room occupancy updated', room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;