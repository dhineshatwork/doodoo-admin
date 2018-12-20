var express = require('express');
var mongoose = require('mongoose');
var config = require('../config/database');
var Category = require('../app/models/category');
var Banner = require('../app/models/bannerpic');
var User = require('../app/models/user');
var Service = require('../app/models/service');
var Employee = require('../app/models/employee');
var Order = require('../app/models/order');
var Feedback = require('../app/models/feedback');
var Offer = require('../app/models/offerpic');
var Notification = require('../app/models/notification');
var DeviceID = require('../app/models/deviceID');


var app = express();
var router = express.Router();

var indianCitiesDatabase = require('indian-cities-database');
var cities = indianCitiesDatabase.cities;


var FCM = require('fcm-push');

var serverKey= 'AAAA3iWJu8A:APA91bGdV29n8BQ_i-rh7Li5tYYb3Z38PEVs-klDIGzBvHapnstGC7Hg0GP8-yLVEnB71lwa_vwAm8cEwT3vshWGTDl16rFl13JwUAGw-HaDpaQD9iFBzMdlyQzZneXIviKD2HXoyJzS';
var fcm = new FCM(serverKey);

//database connectivity
mongoose.connect(config.database);
app.set('superSecret', config.secret);


//Node mailer
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
/*var smtpConfig = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // use SSL
	auth: {
		user: 'jagandravid7@gmail.com',
		pass: ''
	}
};

var transporter = nodemailer.createTransport(smtpConfig);*/
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'jagandravid7@gmail.com',
        accessToken: 'ya29.GluyBf-pMZpXhaHyxfqgEBir12q9iiaiKqGWfWqu4JtAv_P6jSTPY_dzbnbmrt4qbCIr3j_V-qyxCi2-TdeL1reuxvEFr196_6ROnNIZu2yJdNKmBZxnfzU1WEJZ'
    }
});

/*transporter.set('oauth2_provision_cb', (user, renew, callback)=>{
    let accessToken = userTokens[user];
    console.log(accessToken)
    if(!accessToken){
        return callback(new Error('Unknown user'));
    }else{
        return callback(null, accessToken);
    }
});
*/




/*Sign up api */
router.post('/signup', function (req, res, next) {
	var userinfo = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		img_url: req.body.img_url,
		address: req.body.address,
		mobile: req.body.mobile,
		latitude : req.body.latitude,
		longtitude : req.body.longtitude

	});

	userinfo.save(function (err, Asignup) {
		if (err) return JSON.stringify(err);
		
		//saved
		if (Asignup) {

			res.send({ status: true, message: "success" })

		} else {

			res.send({ status: false, message: "Failure" })
		}
	})
});


// Signin api
router.post('/signin', function (req, res, next) {
	User.findOne({
		$or:[ {'email':req.body.email}, {'mobile':req.body.email}]
	}, function (err, user) {
		if (user) {
			User.findOne({
				$or:[ {'email':req.body.email}, {'mobile':req.body.email} ],
				"password": req.body.password
			}, function (err, user) {
				if (user) {

					res.send({ status: true, user: user });

				} else {
					res.send({ status: false, message: "password did not match" });
				}
			})

		} else {
			res.send({ status: false, message: "email not found" });
		}
	})
});




//User Profile  update
router.post('/profileUpdate', function (req, res, next) {
	console.log(JSON.stringify(req.body))
	User.findOneAndUpdate({
		"_id": req.body.user_id
	}, {
		$set: {
		"name": req.body.name,
		"email": req.body.email,
		"password": req.body.password,
		"img_url": req.body.img_url,
		"address": req.body.address,
		"mobile": req.body.mobile
		}
	}, {
		new: true
	}, function (err, user) {
		if (err) {
			res.send({status: false, message:"failure"})
		} else {
			res.send({status: true, message: "Updated Successfully"})
		}
	})
});





//Get categorylist 
router.post('/categorylist', function (req, res, next) {
	
	var place = req.body.location;
	var loc = place.toLowerCase();

	var list = [];
	var city;

	for (var j = 0; j < cities.length ; j++) {
       	list.push(cities[j].city)	      
      }

	if(loc == undefined){
		res.send({ status: false, message: "failure" });
	}else {
		var temp = loc.split(",");
	}

	for( var j = 0; j < list.length; j++){
		list[j] = list[j].toLowerCase();
	}

	 for( var i = 0; i < temp.length; i++){

	 	if(temp[i].indexOf(" ") == 0){
    		temp[i] = temp[i].substring(1, temp[i].length);
	 	}

	 	if (list.indexOf(temp[i]) != -1) {
	 		city = temp[i];
	 		
	
	 	}
	 }
	Service.find({"city": city})
	.populate({
		path:'category',
		modal:Category,
		
	})
	.exec(function (err, places) {
		if (places) {

			places = places.filter(function(cat) {
				if(!!cat.category && cat.category != null){
					return cat
				}
			});
			res.send({ status: true, category: places });
			/*var k=[];
		
			for(var i=0;i<=places.length;i++){

				console.log(places[i].category)

				Category.find({'_id': places[i].category}, function (err, orders) {
				if (orders) {

					console.log(orders)



					//res.send({ status: true, orderList: places });

				} else {
					//res.send({ status: false, message: "failure" });
					console.log(err)
				}
				});

				if (i<places.length) {

						k.push(orders);
					}
				
			}
			

			res.send({ status: true, results: k });

		} else {
			res.send({ status: false, message: "failure" });
		}*/
	}else{
		console.log('err',err)
		res.send({ status: false, message: "failure" });
	}
});
})


//Get subcategories 
router.post('/subCategorylist', function (req, res, next) {
	Category.findOne({'_id':req.body.category_id}, function (err, category) {
		if (category) {

			res.send({ status: true, categorylist: category });

		} else {
			res.send({ status: false, message: "failure" });
		}
	});
})


//Getbanner Pic
router.get('/getbannerpic', function (req, res, next) {
	Banner.findOne({}, function (err, pic) {
		if (pic) {
			res.send(pic);
		} else {
			res.send({ status: false, message: "failure" });
		}
	});

})

//GetOffer Pic
router.get('/getOfferPic', function (req, res, next) {
	Offer.findOne({}, function (err, pic) {
		if (pic) {
			res.send({status: true, pic});
		} else {
			res.send({ status: false, message: "failure" });
		}
	});

})
 

router.post('/getServiceDetails', function (req, res, next) {
	Service.findOne({'category':req.body.category,'sub_category':req.body.sub_category}, function (err, model) {
		if (model) {


			Category.findOne({'_id':req.body.category,"sub_category._id":req.body.sub_category}, function (err, places) {
				if (places) {

					var name = places.name;
					var sub_cat = places.sub_category[0].sub_cat_name;
					model.category_name = name;
					model.sub_cat_name = sub_cat;
					model.cat_img = places.img_src;
					res.send({ status: true, serviceDetails: model});

				} else {
					res.send({ status: false, message: "fai" });
				}
			});

			//res.send({ status: true, serviceDetails:model});
		} else {
			res.send({ status: false, message: "failure" });
		}
	});

})


//Get search list
router.post('/search', function (req, res, next) {
	var place = req.body.location;
	var loc = place.toLowerCase();
	var key = req.body.keyword;

	var list = [];
	var city;

	for (var j = 0; j < cities.length ; j++) {
       	list.push(cities[j].city)	      
      }

	if(loc == undefined){
		res.send({ status: false, message: "failure" });
	}else {
		var temp = loc.split(",");
	}

	for( var j = 0; j < list.length; j++){
		list[j] = list[j].toLowerCase();
	}

	 for( var i = 0; i < temp.length; i++){

	 	if(temp[i].indexOf(" ") == 0){
    		temp[i] = temp[i].substring(1, temp[i].length);
	 	}

	 	if (list.indexOf(temp[i]) != -1) {
	 		city = temp[i];
	 		
	
	 	}
	 }

	Service.find({ 'city': city, $or:[
		//{location: new RegExp(key, 'igm')},
		{description: new RegExp(key, 'igm')},
		{promises: new RegExp(key, 'igm')},
		{price: new RegExp(key, 'igm')},
		{category_name: new RegExp(key, 'igm')},
		{sub_cat_name: new RegExp(key, 'igm')},
		{notes: new RegExp(key, 'igm')}]})
		.populate({
		 	path: 'category',
	        model: Category,
		})
		.exec( function (err, places) {
		if (places) {
				 console.log(city)


			res.send({ status: true, results: places });
			//res.end();

		} else {
			res.send({ status: false, message: "failure" });
		}
	});
})





//Place an order by user
router.post('/placeOrder', function (req, res, next) {

	var st = Math.floor(100000 + Math.random() * 900000);
	var bookingId = "DODOO" + st;

	var orderinfo = new Order({

		user_id: req.body.user_id,
		user_name: req.body.user_name,
		category: req.body.category,
		category_name:req.body.category_name,
		sub_category: req.body.sub_category,
		sub_category_name: req.body.sub_category_name,
		description: req.body.description,
		price: req.body.price,
		duration: req.body.duration,
		promises: req.body.promises,
		notes:req.body.notes,
		image: req.body.image,
		location: req.body.location,
		booked: req.body.booked,
		booked_on: req.body.booked_on,
		cus_mobile: req.body.mobile ,
		device_id: req.body.device_id,
		booking_id: bookingId,
		lat:req.body.lat,
		lng:req.body.lng

	});

	orderinfo.save(function (err, category) {
		//saved
		if (category) {

			res.send({ status: true, message: "success"})

		} else {

			res.send({ status: false, message: "failure" })
		}
	})
});


//Get oredrsummary 
router.post('/orderSummary', function (req, res, next) {
	Order.find({'user_id': req.body.user_id}, function (err, orders) {
		if (orders) {

			res.send({ status: true, orderList: orders });

		} else {
			res.send({ status: false, message: "failure" });
		}
	})
})



//add to cart
router.post('/addToCart', function (req, res, next) {
	var orderinfo = new Order({
	
		user_id: req.body.user_id,
		category: req.body.category,
		category_name:req.body.category_name,
		sub_category: req.body.sub_category,
		sub_category_name: req.body.sub_category_name,
		description: req.body.description,
		price: req.body.price,
		duration: req.body.duration,
		promises: req.body.promises,
		notes:req.body.notes,
		image: req.body.image,
		booked: req.body.booked,
		device_id: req.body.device_id

	});

	orderinfo.save(function (err, category) {
		//saved
		if (category) {

			res.send({ status: true, message: "success"})

		} else {

			res.send({ status: false, message: "failure" })
		}
	})
});

//order place from cart
router.post('/placeOrderCart', function (req, res, next) {
	console.log(JSON.stringify(req.body))
	var st = Math.floor(100000 + Math.random() * 900000);
	var bookingId = "DODOO" + st;
	Order.findOneAndUpdate({
		"_id": req.body._id
	}, {
		$set: {
		user_id: req.body.user_id,
		user_name: req.body.user_name,
		category: req.body.category,
		sub_category: req.body.sub_category,
		description: req.body.description,
		price: req.body.price,
		duration: req.body.duration,
		promises: req.body.promises,
		notes:req.body.notes,
		image: req.body.image,
		location: req.body.location,
		booked: req.body.booked,
		booked_on: req.body.booked_on,
		cus_mobile: req.body.mobile ,
		device_id: req.body.device_id,
		booking_id: bookingId
		}
	}, {
		new: true
	}, function (err, user) {
		if (err) {
			res.send({status: false, message:"failure"})
		} else {
			//user.user_name= req.body.user_name
			var message = {
				to: user.device_id, // required fill with device token or topics
				//collapse_key: 'your_collapse_key', 
				data: {
					id: req.body.order_id,
					page: "booking"
				},
				notification: {
					title: 'Doodo',
					body: "your Order has been Placed",
					"click_action": "FCM_PLUGIN_ACTIVITY",
					"icon": "fcm_push_icon"
				}
			};
			fcm.send(message, function(err, response){
		        if (err) {
		           res.send({status: false, message:"failure"})
		        } else {
		        	res.send({
				status: true,
				message: "success"
			})
		            console.log("Successfully sent with response: ", response);
		        }
		    });

			
			//res.send({status: true, message: "success"})
		}
	})
});


//Remove order
router.post('/cancelOrder', function (req, res, next) {
	Order.findOneAndUpdate({
		"_id": req.body.order_id
	}, {
		$set: {
		"status": "Cancelled"
		}
	}, {
		new: true
	}, function (err, user) {
		if (err) {
			console.log(err)
			res.send({status: false, message:"update failure"})
		}
		if (user) { 
				

			var message = {
				to: user.device_id, // required fill with device token or topics
				//collapse_key: 'your_collapse_key', 
				data: {
					id: req.body.order_id,
					page: "booking"
				},
				notification: {
					title: 'Doodo',
					body: "your Order has been Cancelled",
					"click_action": "FCM_PLUGIN_ACTIVITY",
					"icon": "fcm_push_icon"
				}
			};
			fcm.send(message, function(err, response){
		        if (err) {
		            console.log("Something has gone wrong!");
		        } else {
		            console.log("Successfully sent with response: ", response);
		        }
		    });

			res.send({
				status: true,
				message: "success"
			})

								
							
		}
	})
});



//Remove order
router.post('/completedOrder', function (req, res, next) {
	Order.findOneAndUpdate({
		"_id": req.body.order_id
	}, {
		$set: {
		"status": "Completed"
		}
	}, {
		new: true
	}, function (err, user) {
		if (user) {
					
			var orderinfo = new Feedback({
				order_id: req.body.order_id,
				emp_id: req.body.emp_id,
				user_id: req.body.user_id,
				review: req.body.review,
				completed_percent: req.body.completed_percent,
				img_src: req.body.img_src,
				rating: req.body.rating

			});

			orderinfo.save(function (err, Asignup) {
				if (err) return JSON.stringify(err);
				
				//saved
				if (Asignup) {

					res.send({ status: true, message: "success" })

				} else {

					res.send({ status: false, message: "Failure" })
				}
			})


		} else {
			res.send({status: false, message:"failure"})
		}
	})
});

router.post('/empDetails',function(req,res,next){
	Employee.find({'_id': req.body.empId}, function (err, orders) {
		if (orders) {

			res.send({ status: true, empdetails: orders });

		} else {
			res.send({ status: false, message: "failure" });
		}
	});
})



//Admin notification pic
router.get('/notification', function (req, res, next) {
	Notification.find({}, function (err, model) {
		if (model) {

			res.send({ status: true, images:model});

		} else {
			res.send({ status: false, message: "Images not found" });
		}
	});

})


/*DeviceID Registration  */
router.post('/registerDeviceID', function (req, res, next) {

	DeviceID.findOne({device_id: req.body.device_id}, function (err, model) {
		if (model) {

			res.send({ status: true, message: "deviceID already registered"});

		} else {

				var userinfo = new DeviceID({
				    deviceID: req.body.device_id

				});

				userinfo.save(function (err, Asignup) {
					//saved
					if (Asignup) {

						res.send({ status: true, message: "success" })

					} else {

						res.send({ status: false, message: "Failure" })
					}
				})
				
		}
	});

});


//Admin notification pic
router.post('/forgetPassword', function (req, res, next) {
	User.findOne({"email":req.body.email},function(err,gotMail){
		if(gotMail){
			console.log(gotMail)
			// setup email data with unicode symbols
			var mailOptions = {
				from: '"DODOO"<Dodoo@gmail.com>', // sender address
				to: req.body.email, // list of receivers
				subject: 'Forgot Password', // Subject line
				text: 'Forgot Password !', // plain text body
				html: '<b>Hello '+gotMail.name+'!</b><br><h2>your password is '+gotMail.password+'</h2>' // html body

			};

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error);
					res.send({
						"status":false,
						"message": error
					});
				}
				if (info) {
					console.log('Message %s sent: %s', info.messageId, info.response);
					res.send({
						"status":true,
						"message": info
					});
				}
			});
		}else{
			res.send({"status":false,"message":"Email not found"})
		}
	})
	
})

router.get('/test',function(req,res){
	var message = {
				//to: 'dGdn7TcaavM:APA91bE9d_vp27HfaELIA-bjxAnPSl1EDXYkWip-kjLR2Hu2RI45DLR5nyOShuSTu9rbpoZJ3SDOJvqDpSAYK3vexxfCb7MrbiB-ak5A4B9NXlLOeuLZamEXVOhX_SIQv1Oqm6iY3JG2', // required fill with device token or topics
				//collapse_key: 'your_collapse_key', 
				//to: devices[i].device_id,
				to:'dnUpJQ7x9Oc:APA91bEYzHo-4zL3oAO0bIbIyJK2s4D43f2JuVbPmen6EHxR7xMfohsT4VgiypQrUPnG890tppfqYqvERIJWnHWD-mTsVqnSJQ2JvIqfT4RcjBMec6Lhfhh-9d0q1wvgGLYPuWRQntkZ',
				data: {
					id: 'req.body.order_id',
					page: "booking"
				},
				notification: {
					title: 'Doodo',
					body: "your Order has been Cancelled",
					"click_action": "FCM_PLUGIN_ACTIVITY",
					"icon": "fcm_push_icon"
				}
			}
				fcm.send(message)
				.then(function (response) {
					console.log("Successfully sent with response: ", response);
						res.send(response)

					})
					.catch(function (err) {
						console.log("Something has gone wrong!");
						res.send(err)
					})
})



module.exports = router;
