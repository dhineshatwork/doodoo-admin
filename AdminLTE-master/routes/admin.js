var express = require('express');
var mongoose = require('mongoose');
var config = require('../config/database');
var Admin = require('../app/models/admin');
var Category = require('../app/models/category');
var Banner = require('../app/models/bannerpic');
var Service = require('../app/models/service');
var Employee = require('../app/models/employee');
var Order = require('../app/models/order');
var Offer = require('../app/models/offerpic');
var User = require('../app/models/user');
var Notification = require('../app/models/notification');


var FCM = require('fcm-push');


var app = express();
var router = express.Router();

//database connectivity

mongoose.connect(config.database);
app.set('superSecret', config.secret);

var indianCitiesDatabase = require('indian-cities-database');
var cities = indianCitiesDatabase.cities;



//FCM Configuration

var serverKey= 'AAAA3iWJu8A:APA91bGdV29n8BQ_i-rh7Li5tYYb3Z38PEVs-klDIGzBvHapnstGC7Hg0GP8-yLVEnB71lwa_vwAm8cEwT3vshWGTDl16rFl13JwUAGw-HaDpaQD9iFBzMdlyQzZneXIviKD2HXoyJzS';
var fcm = new FCM(serverKey);



/*Sign up api */
router.post('/signup', function (req, res, next) {
	var admininfo = new Admin({

		email: req.body.email,
		password: req.body.password
	});

	admininfo.save(function (err, Asignup) {
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
	Admin.findOne({
		"email": req.body.email
	}, function (err, user) {
		if (user) {

			Admin.findOne({
				"email": req.body.email,
				"password": req.body.password
			}, function (err, user) {
				if (user) {

					res.send({ status: true, user: user });

				} else {
					res.send({ status: false, message: "Password did not match" });
				}
			})

		} else {
			res.send({ status: false, message: "Email not found" });
		}
	})
});



//add categories  and sub categories
router.post('/addCategory', function (req, res, next) {
	var categoriesinfo = new Category({
		name: req.body.name,
		img_src: req.body.img_src

	});
	categoriesinfo.save(function (err, category) {
		//saved
		if (category) {

				/*for (var i = 0; i < req.body.loc_name.length; i++) {

					Category.findOneAndUpdate({"_id": category._id}, {
						$push: {
							"location": {
								"loc_name": req.body.loc_name[i]
							}
						}
					}, {
						safe: true,
						upsert: true,
						new: true
					},function (err, model) {
						if (model) {

							//res.send({ status: true, message: "success" })
						}else{

							//res.send({ status: false, message: "failure" })
						}
					})
				}*/

			res.send({ status: true, message: "success" })

		} else {

			res.send({ status: false, message: "failure" })
		}
	})
});


//Get categories 
router.get('/categorylist', function (req, res, next) {
	Category.find({}, function (err, category) {
		if (category) {

			res.send({ status: true, categorylist: category });

		} else {
			res.send({ status: false, message: "failure" });
		}
	});
})


//Category update
router.post('/updateCategory', function (req, res, next) {

	Category.findOneAndUpdate({
		"_id": req.body.category_id
	}, {
		$set: {
		"name": req.body.name,
		"img_src": req.body.img_src
		}
	}, {
		new: true
	}, function (err, user) {
		if (err) {
			res.send({status: false, message:"failure"})
		} else {

			res.send({ status: true, message: "success" })
		}
	})
});




//delete categories
router.post('/deleteCategory', function (req, res, next) {

	Category.findOne({"_id":req.body.category_id}, function (error, category){
		if (category) {

			category.remove();
			res.send({ status: true, message: "Deleted Successfully" })

		}else{

			res.send({ status: false, message: "Category not found" })
		}});
});


//add sub categories
router.post('/addNewLocation', function (req, res, next) {

	for (var i = 0; i < req.body.loc_name.length; i++) {
					console.log(req.body.loc_name)
					Category.findOneAndUpdate({"_id": req.body.category_id}, {
						$push: {
							"location": {
								"loc_name": req.body.loc_name[i]
							}
						}
					}, {
						safe: true,
						upsert: true,
						new: true
					},function (err, model) {
						if (model) {

							//res.send({ status: true, message: "success" })
						}else{

							//res.send({ status: false, message: "failure" })
						}
					})
				}
	res.send({ status: true, message: "success" })			
	
});


//delete location from
router.post('/deleteLocation', function (req, res, next) {

	Category.findOneAndUpdate({"_id": req.body.category_id}, {
					$pull: {
						"location": {
							"_id": req.body.location_id
						}
					}
				}, {
					safe: true,
					upsert: true,
					new: true
				},function (err, model) {
					if (model) {

						res.send({ status: true, message: "success" })
					}else{
						res.send({ status: false, message: "failure"})
					}
				})
		
});


//add sub categories
router.post('/addSubCategory', function (req, res, next) {
	
	Category.findOneAndUpdate({"_id": req.body.category_id}, {
					$push: {
						"sub_category": {
							"sub_cat_name": req.body.sub_cat_name, 
							"sub_img_src": req.body.sub_img_src
						}
					}
				}, {
					safe: true,
					upsert: true,
					new: true
				},function (err, model) {
					if (model) {

						res.send({ status: true, message: "success" })
					}else{
						res.send({ status: false, message:"failure"})
					}
				})
		
});



//update sub categories
router.post('/updateSubCategory', function (req, res, next) {
	
	Category.findOne({"_id":req.body.category_id,"sub_category._id":req.body.sub_category_id}, function (error, result){
				if(result){

					Category.findOneAndUpdate({"sub_category._id": req.body.sub_category_id}, {
						$set: {
								"sub_category.$.sub_cat_name": req.body.sub_cat_name, 
								"sub_category.$.sub_img_src": req.body.sub_img_src
						}
					}, {
						new: true
					},function (err, model) {
						if (model) {

							res.send({ status: true, message: "success" })
						}else{
							res.send({ status: false, message:"failure"})
						}
					})

				}else{

					res.send({ status: false, message:"failure"})
				}
			})
		
});


//delete categories
router.post('/deleteSubCategory', function (req, res, next) {

	Category.findOneAndUpdate({"_id": req.body.category_id}, {
					$pull: {
						"sub_category": {
							"_id": req.body.sub_category_id
						}
					}
				}, {
					safe: true,
					upsert: true,
					new: true
				},function (err, model) {
					if (model) {

						res.send({ status: true, message: "success" })
					}else{
						res.send({ status: false, message: "failure"})
					}
				})
		
});



//add banner pic
router.post('/addbannerpic', function (req, res, next) {
	Banner.findOne({"email": req.body.email}, function (err, user) {
		if (user) {
			
			for (var i = 0; i < req.body.img_src.length; i++) {
							Banner.findOneAndUpdate({"email": req.body.email}, {
								$push: {
									"banner_img": {"img_src": req.body.img_src[i]}
								}
							}, {
								safe: true,
								upsert: true,
								new: true
							},function (err, model) {
								if (model) {
										
								}
							})

			}

			res.send({ status: true, message: "success" })

		} else {
			var userinfo = new Banner({
				email: req.body.email
			});
			userinfo.save(function (err, Asignup) {
				if (err) return JSON.stringify(err);
				if (Asignup) {
					for (var i = 0; i < req.body.img_src.length; i++) {
						////console.log(req.body.img_src[i])
						Banner.findOneAndUpdate({"email": req.body.email}, {
							$push: {
								"banner_img": {"img_src": req.body.img_src[i]}
							}
						}, {
							safe: true,
							upsert: true,
							new: true
						},function (err, model) {
							if (model) {
							}
						})
					}
					res.send({ status: true, message: "success" })
				} else {
					res.send({ status: false, message: "Failure" })
				}
			})
		}
	})
})


//remove banner pic
router.post('/deleteBannerPic', function (req, res, next) {

	 Banner.findOneAndUpdate({
					"email": req.body.email
				}, {
				$pull: {
					"banner_img": {
					"_id": req.body.banner_id
				}}
				}, {
					safe: true,
					upsert: true,
					new: true
				},
				function (err, model) {

				if (model) {

					res.send({ status: true, message: "Deleted Successfully" })

				} else {
					
					res.send({ status: false, message: "failure" })
				}})	
});


//add offer pic
router.post('/addOfferPic', function (req, res, next) {
	Offer.findOne({"email": req.body.email}, function (err, user) {
		if (user) {
			
			for (var i = 0; i < req.body.img_src.length; i++) {
							Offer.findOneAndUpdate({"email": req.body.email}, {
								$push: {
									"offer_img": {"img_src": req.body.img_src[i]}
								}
							}, {
								safe: true,
								upsert: true,
								new: true
							},function (err, model) {
								if (model) {
										
								}
							})

			}

			res.send({ status: true, message: "success" })

		} else {
			var userinfo = new Offer({
				email: req.body.email
			});
			userinfo.save(function (err, Asignup) {
				if (err) return JSON.stringify(err);
				if (Asignup) {
					for (var i = 0; i < req.body.img_src.length; i++) {
						////console.log(req.body.img_src[i])
						Offer.findOneAndUpdate({"email": req.body.email}, {
							$push: {
								"offer_img": {"img_src": req.body.img_src[i]}
							}
						}, {
							safe: true,
							upsert: true,
							new: true
						},function (err, model) {
							if (model) {
							}
						})
					}
					res.send({ status: true, message: "success" })
				} else {
					res.send({ status: false, message: "Failure" })
				}
			})
		}
	})
})


// add service details
router.post('/addServices', function (req, res, next) {

	var list = [];
	var city;
	var loc = req.body.location;
	
	for (var j = 0; j < cities.length ; j++) {
	      list.push(cities[j].city)	      
	 }

	if(loc == undefined ){
		res.send({ status: false, message: "failure" });
	}else {
		var temp = loc.split(",");
	}

	
	 for( var i = 0; i < temp.length; i++)
	 {

	 	if(temp[i].indexOf(" ") == 0)
    		temp[i] = temp[i].substring(1, temp[i].length);

	 	if (list.indexOf(temp[i]) != -1) {
	 		city = temp[i].toLowerCase();
	 	}
	 }


	Category.findOne({"_id":req.body.category,"sub_category._id":req.body.sub_category}, function (error, result){
		if(result){

			var serviceinfo = new Service({
				category: req.body.category,
				sub_category: req.body.sub_category,
				description: req.body.description,
				price: req.body.price,
				duration: req.body.duration,
				promises: req.body.promises,
				image: req.body.image,
				offers: req.body.offers,
				location: loc,
				category_name: result.name,
				sub_cat_name: result.sub_category[0].sub_cat_name,
				notes: req.body.notes,
				city : city
			});

			serviceinfo.save(function (err, Asignup) {
				if (err) return JSON.stringify(err);
				//saved
				if (Asignup) {

					res.send({ status: true, message: "success" })

				} else {

					res.send({ status: false, message: "Failure" })
				}
			})

				}
			})

});


//remove offer pic
router.post('/deleteOfferPic', function (req, res, next) {

	Offer.findOneAndUpdate({
					"email": req.body.email
				}, {
				$pull: {
					"offer_img": {
					"_id": req.body.offer_id
				}}
				}, {
					safe: true,
					upsert: true,
					new: true
				},
				function (err, model) {

				if (model) {

					res.send({ status: true, message: "Deleted Successfully" })

				} else {
					
					res.send({ status: false, message: "failure" })

				}})
		
});

//Services update
router.post('/servicesUpdate', function (req, res, next) {
	console.log(JSON.stringify(req.body))

	var list = [];
	var city;
	var loc = req.body.location;

	for (var j = 0; j < cities.length ; j++) {
	      list.push(cities[j].city)	      
	 }

	if(loc == undefined){
		res.send({ status: false, message: "failure" });
	}else {
		var temp = loc.split(",");
	}
	
	 for( var i = 0; i < temp.length; i++)
	 {
	 	if(temp[i].indexOf(" ") == 0)
    		temp[i] = temp[i].substring(1, temp[i].length);

	 	if (list.indexOf(temp[i]) != -1) {
	 		city = temp[i];
	 	}
	 }

	Service.findOneAndUpdate({
		"_id": req.body.service_id
	}, {
		$set: {
		"description": req.body.description,
		"price": req.body.price,
		"duration": req.body.duration,
		"promises": req.body.promises,
		"image": req.body.image,
		"offers": req.body.offers,
		"location":req.body.location,
		"city": city
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



//delete categories
router.post('/deleteService', function (req, res, next) {

	Service.findOne({"_id":req.body.service_id}, function (error, service){
		if (service) {

			service.remove();
			res.send({ status: true, message: "Deleted Successfully" })

		}else{

			res.send({ status: false, message: "Service not found" })
		}});
});



// Add New Employee
router.post('/addNewEmployee', function (req, res, next) {

	var st = Math.floor(100000 + Math.random() * 900000);
	var employeeID = "EMP" + st;

	var list = [];
	var city;
	var loc = req.body.location;
	
	for (var j = 0; j < cities.length ; j++) {
	      list.push(cities[j].city)	      
	 }

	if(loc == undefined ){
		console.log("location undefined");
		res.send({ status: false, message: "failure" });
	}else {
		var temp = loc.split(",");
	}

	
	 for( var i = 0; i < temp.length; i++)
	 {

	 	if(temp[i].indexOf(" ") == 0)
    		temp[i] = temp[i].substring(1, temp[i].length);

	 	if (list.indexOf(temp[i]) != -1) {
	 		city = temp[i].toLowerCase();
	 	}
	 }


	var employeeinfo = new Employee({
		name: req.body.name,
		email: req.body.email,
		mobile: req.body.mobile,
		alt_mobile: req.body.alt_mobile,
		address: req.body.address,
		category: req.body.category,
		sub_category: req.body.sub_category,
		profile_pic: req.body.profile_pic,
		location: req.body.location,
		employee_id: employeeID,
		city : city
	});

	employeeinfo.save(function (err, Asignup) {
		//saved
		if (Asignup) {
			res.send({ status: true, message: "success" })

		} else {
			console.log(err);
			res.send({ status: false, message: "Failure" })
		}
	})
});



//Employee update
router.post('/updateEmployeeDetails', function (req, res, next) {
	
	var list = [];
	var city;
	var loc = req.body.location;
	
	for (var j = 0; j < cities.length ; j++) {
	      list.push(cities[j].city)	      
	 }

	if(loc == undefined ){
		res.send({ status: false, message: "failure" });
	}else {
		var temp = loc.split(",");
	}

	
	 for( var i = 0; i < temp.length; i++)
	 {

	 	if(temp[i].indexOf(" ") == 0)
    		temp[i] = temp[i].substring(1, temp[i].length);

	 	if (list.indexOf(temp[i]) != -1) {
	 		city = temp[i].toLowerCase();
	 	}
	 }

	Employee.findOneAndUpdate({
		"_id": req.body.employee_id
	}, {
		$set: {
		"name": req.body.name,
		"email": req.body.email,
		"mobile": req.body.mobile,
		"alt_mobile": req.body.alt_mobile,
		"address": req.body.address,
		"category": req.body.category,
		"sub_category": req.body.sub_category,
		"profile_pic": req.body.profile_pic,
		"location": req.body.location,
		"city": city
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



//delete Employee
router.post('/deleteEmployee', function (req, res, next) {

	Employee.findOne({"_id":req.body.employee_id}, function (error, employee){
		if (employee) {

			employee.remove();
			res.send({ status: true, message: "Deleted Successfully" })

		}else{



			res.send({ status: false, message: "Employee not found" })
		}});
});




//Get employee 
router.get('/employeeList', function (req, res, next) {
	Employee.find({}, function (err, employee) {
		if (employee) {

			res.send({ status: true, employeeList: employee });

		} else {
			res.send({ status: false, message: "failure" });
		}
	});
})





//Get orders 
router.post('/orderList', function (req, res, next) {
	Order.find({"booked":true,"status":req.body.status}, function (err, orders) {
		if (orders) {

			res.send({ status: true, bookingDetails: orders });

		} else {
			res.send({ status: false, message: "failure" });
		}
	});
})



//Accept order
router.post('/acceptOrder', function (req, res, next) {
	Order.findOneAndUpdate({
		"_id": req.body.order_id
	}, {
		$set: {
		"status": "Accepted",
		"employee_id": req.body.employee_id
		}
	}, {
		safe: true,
		upsert: true,
		new: true
	}, function (err, user) {
		if (user) {


			Employee.findOne({'_id': req.body.employee_id}, function (err, emp) {

				//console.log(emp)
					if (emp) {
						console.log(emp)
							Order.findOneAndUpdate({
									"_id": req.body.order_id
								}, {
									$set: {
									"emp_name" :emp.name,
									"emp_email" : emp.email,
									"emp_mobile" : emp.mobile,
									"emp_alt_mobile" : emp.alt_mobile,
									"emp_address" : emp.address,
									"emp_designation" : emp.designation,
									"emp_profile_pic" : emp.profile_pic,
									"emp_location" : emp.location
									}
								}, {
									safe: true,
									upsert: true,
									new: true
								}, function (err, user1) {
									if (user1) {
										Order.findOne({"_id":req.body.order_id}, function (err, orders) {
											if (orders) {

												var message = {
													to: orders.device_id, // required fill with device token or topics
													//collapse_key: 'your_collapse_key', 
													data: {
														id: req.body.order_id,
														page: "booking"
													},
													notification: {
														title: 'Doodo',
														body: "Your order has been Accepted",
														"click_action": "FCM_PLUGIN_ACTIVITY"
													}
												};
												fcm.send(message)

												res.send({
													status: "true",
													message: "success"
												})

											} else {
												res.send({ status: false, message: "failure" });
											}
							});
							
							
						} else {
							res.send({status: false, message:"failure"})
						}
					})
					} else {
						res.send({ status: false, message: "empoyee details failed" });
					}
				});	
			
		} else {
			res.send({status: false, message:"failure"})
		}
	})
});

//Cancel order
router.post('/cancelOrder', function (req, res, next) {
	Order.findOneAndUpdate({
		"_id": req.body.order_id
	}, {
		$set: {
		"status": "Cancelled"
		}
	}, {
		safe: true,
		upsert: true,
		new: true
	}, function (err, user) {
		if (user) {
			Order.findOne({"_id":req.body.order_id}, function (err, orders) {
				if (orders) {
					var message = {
						to: orders.device_id, // required fill with device token or topics
						//collapse_key: 'your_collapse_key', 
						data: {
							id: req.body.order_id,
							page: "booking"
						},
						notification: {
							title: 'Doodo',
							body: "Cancelled",
							"click_action": "FCM_PLUGIN_ACTIVITY"
						}
					};
					fcm.send(message)
					res.send({status: "true",message: "success"})

				} else {
					res.send({ status: false, message: "fcm failure" });
				}
			});

		} else {
			res.send({status: false, message:"Order not found"})
		}
	})
});


//search employee based on loc 
router.post('/searchEmployee', function (req, res, next) {
	console.log(req.body);
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
	 		console.log(city);
	
	 	}
	 }
	 console.log(city);


	Employee.find({"city": city,"category":req.body.category_id,"sub_category": req.body.sub_category}, function (err, employee) {
		if (employee) {

			res.send({ status: true, employeeList: employee });

		} else {
			res.send({ status: false, message: "failure" });
		}
	});
})



//GetDashBoard details
router.get('/getDashBoardDetails', function (req, res, next) {
	User.find({}, function (err, user) {
		if (user) {
			var user_con = user.length;

			Employee.find({}, function (err, employee) {
				if (employee) {
					var emp_con = employee.length;
					
					Order.find({"status":"Pending","booked":true}, function (err, order) {
						if (order) {
							var order_con = order.length;
							Order.find({"status":"Completed"}, function (err, orders) {
								if (orders) {
									var orders_con = orders.length;

									var total = 0;

									/*var tdate = new Date().getDate();
									var tmonth = new Date().getMonth();
									var tyear = new Date().getFullYear();

									for (i = 0; i < order.length; i++) {
										var todayBooked = order[i].booked_on;
										var bmonth = new Date(todayBooked * 1000).getMonth();
										var byear = new Date(todayBooked * 1000).getFullYear();
										if (tmonth == bmonth && tyear == byear) {
											//totalSales += sales[i].total_amt;
											total  = total+parseInt(orders[i].price);
											var date = new Date(todayBooked * 1000)
											sales[i].invoiceDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
											filtered.push(sales[i])
										}
									}*/

									for(var i =0; i<orders.length; i++){

										total  = total+parseInt(orders[i].price);
									 
									}

									console.log(total)
									res.send({status: true, user_count: user_con, emp_count: emp_con, order_count: order_con, revenue: total});
								} else {
									res.send({ status: false, message: "failure" });
								}
							});
						} else {
							res.send({ status: false, message: "failure" });
						}
					});
				} else {
					res.send({ status: false, message: "failure" });
				}
			});
		} else {
			res.send({ status: false, message: "failure" });
		}
	});

})



/*FCM Push Notification */
router.post('/fcmsend', function (req, res, next) {
	
	Order.find({}, function (err, order) {
		if (order) {

			for(i=0; i<order.length;i++){

				var message = {
				//to: 'dGdn7TcaavM:APA91bE9d_vp27HfaELIA-bjxAnPSl1EDXYkWip-kjLR2Hu2RI45DLR5nyOShuSTu9rbpoZJ3SDOJvqDpSAYK3vexxfCb7MrbiB-ak5A4B9NXlLOeuLZamEXVOhX_SIQv1Oqm6iY3JG2', // required fill with device token or topics
				//collapse_key: 'your_collapse_key', 
				to: order[i].device_id,

				notification: {
				title: 'Doodo',
				body: req.body.name,
				"click_action":"FCM_PLUGIN_ACTIVITY"
				}

				};
				fcm.send(message)
				.then(function (response) {
						//console.log("Successfully sent with response: ", response);
						

					})
					.catch(function (err) {
						//console.log("Something has gone wrong!");
						
					})
			}

			var fcminfo = new Notification({
			img_src: req.body.img_src

			});
			fcminfo.save(function (err, firebase) {
				//saved
				if (firebase) {
					//promise style
					res.send({
							"message": "success"
						});
					

				} else {

					res.send({ status: false, message: "failure" })
				}
			})
			
			
		} else {
			res.send({ status: false, message: "failure" });
		}
	});
})


//Get Service Details
router.post('/getServiceDetails', function (req, res, next) {

	var list = [];
	var city;
	var loc = req.body.location;

	for (var j = 0; j < cities.length ; j++) {
	      list.push(cities[j].city)	      
	 }

	if(loc == undefined){
		res.send({ status: false, message: "failure" });
	}else {
		var temp = loc.split(",");
	}
	
	 for( var i = 0; i < temp.length; i++)
	 {
	 	if (list.indexOf(temp[i]) != -1) {
	 		city = temp[i];
	 	}
	 }

	Service.findOne({'category':req.body.category,'sub_category':req.body.sub_category, 'city': city}, function (err, model) {
		if (model) {

			Category.findOne({'_id':req.body.category,"sub_category._id":req.body.sub_category}, function (err, places) {
				if (places) {

					var name = places.name;
					var sub_cat = places.sub_category[0].sub_cat_name;
					model.category_name = name;
					model.sub_cat_name = sub_cat;
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


module.exports = router;
