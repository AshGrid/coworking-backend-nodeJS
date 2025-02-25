const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    number_of_people: {
        type: Number,
        required: true,

    },
    is_occupied: {
        type: Boolean,
        required: true,
        default: false
    }

});

module.exports = mongoose.model('Room', roomSchema);