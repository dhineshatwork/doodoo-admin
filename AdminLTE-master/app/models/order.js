var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//set up a mongoose model
module.exports = mongoose.model('Order', new Schema({
	user_id: String,
	user_name: String,
	category: String,
	sub_category: String,
	category_name: String,
	sub_category_name: String,
	description: String,
	price: String,
	duration: String,
	promises: String,
	image: String,
	notes:String,
	location: String,
	lat:String,
	lng:String,
	status: {
		type: String,
		default: "Pending"
	},
	booked: Boolean,
	booking_id: String,
	booked_on: String,
	device_id: String,
	cus_mobile: String,
	employee_id: String,
	emp_name: String,
	emp_email: String,
	emp_mobile: String,
	emp_alt_mobile: String,
	emp_address: String,
	emp_designation: String,
	emp_profile_pic: String,
	emp_location: String
	},
	{
		timestamp:true
	}));

