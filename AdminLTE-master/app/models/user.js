var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//set up a mongoose model
module.exports = mongoose.model('User', new Schema({

	name: String,
	email: {
		type: String,
		unique: true
	},
	password: String,
	img_url: String,
	address: String,
	mobile: {
		type: String,
		unique: true
	},
	latitude: String,
	longtitude: String

}));

