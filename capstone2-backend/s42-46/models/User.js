const mongoose = require("mongoose");

			const userSchema = new mongoose.Schema({
				firstName : {
					type : String,
					required : (true, "First name is required")
				},
				lastName : {
					type : String,
					required : (true, "Last name is required")
				},
				email : {
					type : String,
					required : (true, "Email is required")
				},
				mobileNo : {
					type : Number,
				},
				password : {
					type : String,
					required : (true, "Password is required")
				},
				isAdmin : {
					type : Boolean,
					default : false
				},
				orderedProduct : [
						{
							orderId : {
								type : String,
							},
							totalAmount : {
								type : Number,
							},
							purchasedOn : {
								type : Date,
								default : new Date()
							},
							isCancelled : {
								type : Boolean,
								default : false
							},
							products : [
								{
									_id : {
										type : String,
									},
									productId : {
										type : String,
									},
									name : {
										type : String,
									},
									quantity : {
										type : Number,
									}
								}
							]
						}
					]

			});



module.exports = mongoose.model("User", userSchema);