var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//set up a mongoose model
module.exports = mongoose.model('Employee', new Schema({
	name: String,
	email: String,
	mobile: String,
	alt_mobile: String,
	address: String,
	category: String,
	sub_category: String,
	profile_pic: String,
	availability_status: {
		type: Boolean,
		default: true 
	},
	location: String,
	employee_id: String,
	city: String

}));

