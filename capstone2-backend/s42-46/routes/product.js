const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const auth = require("../auth");


router.post("/", auth.verify, (req, res) =>{
	const userData = auth.decode(req.headers.authorization);
	if(userData.isAdmin == true){
		productController.addProduct(req.body).then(resultFromController => res.send(resultFromController));
	} else {
		res.send(false);
	}

});

router.get("/all-products", (req, res) =>{
	productController.allProducts().then(resultFromController => res.send(resultFromController))

});


router.get("/active-products", (req, res) =>{
	productController.activeProducts().then(resultFromController => res.send(resultFromController))

});


router.get("/:productId", (req, res) =>{
	productController.getSpecificProduct(req.params).then(resultFromController => res.send(resultFromController))
});

router.put("/:productId", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);
	if(userData.isAdmin == true){
	productController.updateProductInfo(req.params, req.body).then(resultFromController => res.send(resultFromController));
	} else {
		res.send(false);
	}
});


router.put("/archive/:productId", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);
	if(userData.isAdmin == true){
	productController.archiveProduct(req.params, req.body).then(resultFromController => res.send(resultFromController));
	} else {
		res.send(false);
	}
});


router.put("/activate/:productId", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);
	if(userData.isAdmin == true){
	productController.activateProduct(req.params, req.body).then(resultFromController => res.send(resultFromController));
	} else {
		res.send(false);
	}
});

// [SET TO INACTIVE: START]

router.put("/hide/:productId", auth.verify, (req,res) => {

	const data = {
		isAdmin: auth.decode(req.headers.authorization).isAdmin
	};

	productController.hideProduct(data, req.params, req.body).then(resultFromController => res.send(resultFromController));
});






module.exports = router;
