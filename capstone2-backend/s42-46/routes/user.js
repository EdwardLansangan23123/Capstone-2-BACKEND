const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../auth");
// Register
router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => res.send(resultFromController))
});

// Check Email if already exist
router.post("/checkEmail", (req, res) => {
	userController.checkEmailExists(req.body).then(resultFromController => res.send(resultFromController))
});

// User authentication
router.post("/login", (req, res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController));
});

// Ordering a product
router.post("/order-a-product", auth.verify, (req, res) =>{
		let data = {
		productId: req.body.productId,
		quantity: req.body.quantity,
		userId: auth.decode(req.headers.authorization).id
	};

	userController.userOrder(data).then(resultFromController => res.send(resultFromController));
	
});

// Getting user details
router.get("/details", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization)
	userController.userDetails({userId : userData.id}).then(resultFromController => res.send(resultFromController));
})

// Change quantity
router.put("/change-quantity/:userId/:orderId/:productId", auth.verify, async (req, res) => {
  try {
    const data = {
      orderId: req.params.orderId,
      productId: req.params.productId,
      quantity: req.body.quantity,
      transactionId: req.params.transactionId,
      userId: auth.decode(req.headers.authorization).id
    };


    const resultFromController = await userController.changeQuantity(data);
    res.send(resultFromController);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


// Retrieving all orders = admin only

router.get("/list-of-orders", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);
	if(userData.isAdmin == true){
	userController.listOrders(req.body).then(resultFromController => res.send(resultFromController));
	} else {
		res.send(false);
	}
});


// Retrieving totalAmount orders of an authenticated user 


router.get('/totalAmount', auth.verify, async (req, res) => {
  try {
    const userId = auth.decode(req.headers.authorization).id;
    const totalAmount = await userController.getUserOrders(userId);
    res.status(200).json({ totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Retrieving list of orders of an authenticated user
router.get("/list-of-orders/user-level", auth.verify, async (req, res) => {
  try {
    const userData = auth.decode(req.headers.authorization);
    const data = {
      userId: userData.id,
    };

    const orders = await userController.userOrderList(data);
    res.send(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Cancel an order

router.put("/cancel-order/:userId/:orderId", auth.verify, (req, res) => {
  const userId = req.params.userId;
  const orderId = req.params.orderId;
  userController.cancelOrder(userId, orderId)
    .then(resultFromController => res.send(resultFromController))
    .catch(error => {
      console.log('Error cancelling order:', error);
      res.status(500).send('Internal Server Error');
    });
});


// Set user as admin (Admin Only)

router.put("/change-to-admin/:userId", auth.verify, (req, res) => {
	userController.setAsAdmin(req.params, req.body).then(resultFromController => res.send(resultFromController));
});


// Remove as admin


router.put("/remove-as-admin/:userId", auth.verify, (req, res) => {

	userController.removeAsAdmin(req.params, req.body).then(resultFromController => res.send(resultFromController));
});


router.put("/change-to-admin", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);
	if(userData.isAdmin == true){

		let data = {
			userId: req.body.userId
		}
	userController.setAdmin(data).then(resultFromController => res.send(resultFromController));
	} else {
		res.send(false);
	}
});
// Change password
router.put("/changePassword/:userId", auth.verify, (req, res) => {

	userController.changePassword(req.params, req.body).then(resultFromController => res.send(resultFromController));
});

// Get all users


router.get("/all", auth.verify, (req, res) => {

	userController.getUsers().then(resultFromController => res.send(resultFromController));
});


// Update user data 
router.patch("/:userId", auth.verify, (req, res) => {

	userController.updateDetails(req.params, req.body).then(resultFromController => res.send(resultFromController));
});



module.exports = router;


