var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//set up a mongoose model
module.exports = mongoose.model('Service', new Schema({
	category: {
		type:  Schema.ObjectId,
		ref: 'Category'
	},
	sub_category: String,
	description: String,
	price: String,
	duration: String,
	promises: String,
	image: String,
	location: String,
	category_name: String,
	cat_img:String,
	sub_cat_name: String,
	offers: String,
	notes: String,
	city: String

}));

