var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//set up a mongoose model
module.exports = mongoose.model('Banner', new Schema({
	email: String,
	banner_img:[{
		img_src: String
	}]

}));

