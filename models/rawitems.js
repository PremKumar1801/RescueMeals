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

var rawitemsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'The quantity must be 1 or greater.']
    },
    unit: {
        type: String,
        required: false,
        default: 'kg'
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

module.exports = mongoose.model('Rawitems',rawitemsSchema);


