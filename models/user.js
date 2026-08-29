var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');
mongoose.set('useCreateIndex',true);

var nameValidator = [

    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'Please provide a valid full name using only letters and spaces (e.g., Jane Doe).',

    }),

    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Your name must be strictly between {ARGS[0]} and {ARGS[1]} characters in length.'
    }),
];

var usernameValidator = [

    validate({
        validator: 'isAlphanumeric',
        message: 'Usernames can only consist of letters and numbers (no special characters).',

    }),

    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Please pick a username between {ARGS[0]} and {ARGS[1]} characters long.'
    }),
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W]).{8,25}$/,
        message : 'For security, your password must contain an uppercase letter, a lowercase letter, a number, and a symbol.'
    }),

    validate({
        validator: 'isLength',
        arguments: [8, 25],
        message: 'Passwords must be exactly {ARGS[0]} to {ARGS[1]} characters long.'
    }),
];

var emailValidator = [

    validate({
        validator: 'isEmail',
        message: 'Please provide a valid, correctly formatted email address.',

    }),

    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Email addresses cannot exceed {ARGS[1]} characters.'
    }),
];

var userSchema = new Schema( {
    name: {
        type:String,
		required:true,
		validate:nameValidator,
    },
	username: {
		type:String,
		unique:true,
        required:true,
		validate:usernameValidator,
	},
	password: {
		type:String,
        required:true,
        validate:passwordValidator,
        select:false,
	},
	email: {
		type:String,
		unique:true,
        required:true,
        validate:emailValidator
	},
    role : {
        type : String,
        required : true
    },
    institute : {
        type : String,
        required : true
    },
    cart : [{
        itemid : String,
        count : Number,
        name : String,
        price : Number,
        tag : String
    }],
	active: {
        type: Boolean,
        default: false,
        required: true
    },
	temporarytoken: {
		type:String,
		required:true
	}
});

userSchema.pre('save', function(next) 
{
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password,null,null,function(err,hash) {
		if(err) return next(err);
		user.password = hash;
		next();
	});
});

userSchema.plugin(titlize, {
    paths: [ 'name'], 
});

userSchema.methods.comparepassword=function(password){
	return bcrypt.compareSync(password,this.password);
};




module.exports = mongoose.model('User',userSchema);


