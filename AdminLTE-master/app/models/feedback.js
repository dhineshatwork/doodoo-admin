var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//set up a mongoose model
module.exports = mongoose.model('Feedback', new Schema({
	
	order_id: String,
	emp_id: String,
	user_id: String,
	review: String,
	completed_percent: String,
	img_src: String,
	rating: String
	
}));

