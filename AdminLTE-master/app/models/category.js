var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//set up a mongoose model
module.exports = mongoose.model('Category', new Schema({
	
	name: String,
	img_src: String,

	sub_category:[{
		sub_cat_name: String,
		sub_img_src: String
	}],

},
{
	timestamp:true
}));

