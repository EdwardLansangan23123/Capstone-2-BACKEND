const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth")
const Product = require("../models/Product");

// User Registration
module.exports.registerUser = (reqBody) => {
	// Creates a variable "newUser" and instantiate a new "User" object using the mongoose model
	// Uses the information from the request body to provide all the necessary information
	let newUser = new User({
		firstName : reqBody.firstName,
		lastName : reqBody.lastName,
		email : reqBody.email,
		password : bcrypt.hashSync(reqBody.password, 10)
	});

	// Saves the created object to our database
	return newUser.save().then((user, error) => {
		// User registration failed
		if(error) {
			return false
		} else {
			return true
		};
	})
};


// CheckEmail if already exist
module.exports.checkEmailExists = (reqBody) => {
	return User.find({email : reqBody.email}).then(result =>{
		if(result.length > 0 ) {
			return true;
		} else {
			return false;
		}
	})
};

// User authentication

module.exports.loginUser = (reqBody) => {
	return User.findOne({email : reqBody.email}).then(result => {

		if(result == null) {
			return false;
		} else {
			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password)
			if(isPasswordCorrect) {
				// Generate an access token
				// Uses the "creatAccessToken" method defined in the "auth.js" file
				// Returning an object back to the frontend application is common practice to ensure information is properly labeled
				return {access : auth.creationAccessToken(result)}
			} else {
				return false;
			}
		}
	})
};

// Placing an order
module.exports.userOrder = async (data) => {
  try {
    const product = await Product.findById(data.productId);
    if (!product) {
      return false;
    }

    const user = await User.findById(data.userId);
    if (!user) {
      return false;
    }

    const orderedProduct = {
      productId: product._id,
      name: product.name,
      quantity: data.quantity,
    };

    const order = {
      orderId: generateOrderId(),
      totalAmount: orderedProduct.quantity * product.price,
      purchasedOn: new Date(),
      products: [orderedProduct],
    };

    user.orderedProduct.push(order);

    await user.save();

    const products = {
      userId: user._id,
      orderId: order.orderId,
    };
    product.userOrders.push(products);
    await product.save();

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

function generateOrderId() {
  return "" + Math.random().toString(36).substr(2, 9);
}


// Get user details
module.exports.userDetails = (data) => {
	return User.findById(data.userId).then(result => {
		if(result == null) {
			return false;
		} else {

			result.password = "";

			return result;
		}
	})
}

// Change Quantity


module.exports.changeQuantity = async (data) => {
  try {
    const result = await User.findOneAndUpdate(
      {
        _id: data.userId,
        "orderedProduct.orderId": data.orderId,
        "orderedProduct._id": data.transactionId,
      },
      {
        $set: {
          "orderedProduct.$[order].products.$[product].quantity": data.quantity,
          "orderedProduct.$[order].totalAmount": data.productPrice * data.quantity,
        },
      },
      {
        new: true,
        arrayFilters: [
          { "order.orderId": data.orderId },
          { "product._id": data.productId },
        ],
      }
    );

    if (result) {
      return true;
    } else {
      return "Order not found";
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};


// Retrieving all orders = admin only
// List all products
module.exports.listOrders = async () => {
  try {
    const products = await Product.find({});
    if (!products) {
      return `No products found`;
    }
    
    let orders = [];
    products.forEach((product) => {
      if (product.userOrders.length > 0) {
        orders = [...orders, ...product.userOrders];
      }
    });
    
    return orders;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// UserOrders = totalAmount
module.exports.getUserOrders = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return `User not found`;
    }
    const orders = user.orderedProduct;
    const activeOrders = orders.filter((order) => !order.isCancelled);
    const totalAmount = activeOrders.reduce((acc, order) => acc + order.totalAmount, 0);

    console.log(`Total amount of orders: ${totalAmount}`);
    return totalAmount;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// UserOrders = list
module.exports.userOrderList = async (data) => {
  try {
    const user = await User.findById(data.userId);
    if (!user) {
      return `User not found`;
    }
    const orders = user.orderedProduct;
    return orders;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Remove products from cart
// module.exports.removeProducts = async (data) => {
// 	try {
// 		const user = await User.findById(data.userId);
// 		if (!user) {
// 		  return `User not found`;
// 		}

// 		const orders = user.orderedProduct;
// 		const cancel = data.productId
// 		const orderedProductIndex = orders.findIndex(product => product._id == cancel);

// 		if (orderedProductIndex == -1) {
// 			return `Ordered product not found`;
// 		}

// 		user.orderedProduct.splice(orderedProductIndex, 1);
// 		await user.save();

// 		return `Product cancelled successfully`;

// 	} catch (error) {
// 		console.error(error);
// 		return false;
// 	}
// }

module.exports.cancelOrder = async (userId, orderId) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId, "orderedProduct.orderId": orderId, },
      { $set: { "orderedProduct.$.isCancelled": true } },
      { new: true }
    );

    if (!user) {
      return "Order not found";
    }

    const product = await Product.findOneAndUpdate(
      { "userOrders.orderId": orderId },
      { $set: { "orders.$.isCancelled": true } },
      { new: true }
    );

    if (!product) {
      return "Product not found";
    }

    const cancelledOrder = user.orderedProduct.find((order) => order.orderId.toString() === orderId);
    return cancelledOrder;

  } catch (error) {
    throw error;
  }
};



// Set user as admin (Admin only)

module.exports.setAsAdmin = (reqParams, reqBody) => {

  let updatedAdminStatus = {
    isAdmin: true
  };
  return User.findByIdAndUpdate(reqParams.userId, updatedAdminStatus).then((user, error) => {
    if(error) {
      return false;
    } else {
      return updatedAdminStatus;
    };
  });
};


// Remove user as an admin

module.exports.removeAsAdmin = (reqParams, reqBody) => {

  let updatedAdminStatus = {
    isAdmin: false
  };
  return User.findByIdAndUpdate(reqParams.userId, updatedAdminStatus).then((user, error) => {
    if(error) {
      return false;
    } else {
      return updatedAdminStatus;
    };
  });
};


// Get all users

module.exports.getUsers = () => {

  return User.find({}).then(result => {
    return result;
  });
};


// Change password
module.exports.changePassword = (reqParams, reqBody) => {

  let changedPassword = {
    password: bcrypt.hashSync(reqBody.password, 10)
  };
  return User.findByIdAndUpdate(reqParams.userId, changedPassword).then((user, error) => {
    if(error) {
      return false;
    } else {
      return true;
    };
  });
};

// [UPDATE USER DATA: START]

module.exports.updateDetails = (reqParams, reqBody) => {

  let editProfile = {
    firstName: reqBody.firstName,
    lastName: reqBody.lastName,
    email: reqBody.email,
    mobileNo: reqBody.mobileNo
  };
  return User.findByIdAndUpdate(reqParams.userId, editProfile).then((user, error) => {
    if(error) {
      return false;
    } else {
      return true;
    };
  });
};

