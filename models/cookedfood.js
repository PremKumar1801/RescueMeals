var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');


var cityValidator = [
    validate({
        validator: 'isLength',
        arguments: [2, 50],
        message: 'Please provide a valid city name (between {ARGS[0]} and {ARGS[1]} characters).'
    })
];

var stateValidator = [
    validate({
        validator: 'isLength',
        arguments: [2, 50],
        message: 'Please provide a valid state name (between {ARGS[0]} and {ARGS[1]} characters).'
    })
];

var cookedfoodSchema = new Schema( {
    meal: {
        type: String,
        required: true
    },
    people: {
        type: Number,
        required: true,
        min: [1, 'We require at least 1 person to be served by this donation.']
    },
    city: {
        type: String,
        required: true,
        validate: cityValidator
    },
    state: {
        type: String,
        required: true,
        validate: stateValidator
    },
    
    location: {
        type: {
            latitude: Number,
            longitude: Number
        },
        required: false
    },
    address: {
        type: String,
        required: false
    },
    postedby: {
        type: String,
        required: true
    },
    requeststatus: {
        type: Boolean,
        default: false,
        required: true
    },
    acceptedby: {
        type: String,
        default: 'none'
    },
    
    expiryDate: {
        type: Date,
        required: false
    }
});

module.exports = mongoose.model('Cookedfood',cookedfoodSchema);
