const mongoose = require('mongoose');

const chairSchema = new mongoose.Schema({
    number_associated: {
        type: Number,
        required: true,
    },
    is_occupied: {
        type: Boolean,
        required: true,
        default: false
    }
});

// Prevent OverwriteModelError
module.exports = mongoose.models.Chair || mongoose.model('Chair', chairSchema);
