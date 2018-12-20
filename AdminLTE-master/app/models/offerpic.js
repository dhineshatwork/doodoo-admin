var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//set up a mongoose model
module.exports = mongoose.model('Offer', new Schema({
	email: String,
	offer_img:[{
		img_src: String
	}]

}));

