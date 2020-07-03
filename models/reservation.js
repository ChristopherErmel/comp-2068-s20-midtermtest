// You need to define the schema for a reservation
// The fields you require are:
// associated user
// numOfOccupants (number of occupants)
// roomType (options are 'single bed', 'double bed', 'queen', 'king')
// checkIn (just date, not time)
// checkOut (just date, not time)

const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    numOfOccupants: {
        type: Number,
        required: true
    },
    roomType: {
        type: String,
        enum: ['single bed', 'double bed', 'queen', 'king'],
        default: 'single bed'
    },
    checkIn: {
        type: String,
        required: true
    },
    checkOut: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Reservation', ReservationSchema);