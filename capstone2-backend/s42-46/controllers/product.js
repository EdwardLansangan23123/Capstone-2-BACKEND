const Product = require("../models/Product");
const User = require("../models/User");

// 
module.exports.addProduct = (reqBody) => {

	let newProduct = new Product({
		name : reqBody.name,
		description : reqBody.description,
		price : reqBody.price,
		image : reqBody.image
	});


	// Saves the created object to our database

	return newProduct.save().then((course, error) =>{
		if(error) {
			return false;

		} else {
			return true;
		}
	})
};

module.exports.allProducts = () => {

	return Product.find({}).then(result => {
		return result;
	})

}

module.exports.activeProducts = () => {

	return Product.find({isActive : true}).then(result => {
		return result;
	})

}


module.exports.getSpecificProduct = (reqParams) => {
  return Product.findById(reqParams.productId)
    .then(result => {
      return result;
    });
};

module.exports.updateProductInfo = (reqParams, reqBody) => {

	let updatedProduct = {
		name : reqBody.name,
		description : reqBody.description,
		price : reqBody.price,
		image: reqBody.image
	};

	return Product.findByIdAndUpdate(reqParams.productId, updatedProduct).then((product, error) =>{
		if(error) {
			return false;
		} else {
			return true;
		}
	})
}


module.exports.archiveProduct = (reqParams, reqBody) => {

	let archivedProduct = {
		isActive : false
	};

	return Product.findByIdAndUpdate(reqParams.productId, archivedProduct).then((product, error) =>{
		if(error) {
			return false;
		} else {
			return true;
		}
	})
}


module.exports.activateProduct = (reqParams, reqBody) => {

	let archivedProduct = {
		isActive : true
	};

	return Product.findByIdAndUpdate(reqParams.productId, archivedProduct).then((product, error) =>{
		if(error) {
			return false;
		} else {
			return true;
		}
	})
}


// [SET TO INACTIVE: START]

module.exports.hideProduct = (data, reqParams, reqBody) => {

	if (data.isAdmin) {
		let hiddenProduct = {
			isActive: false
		};
		return Product.findByIdAndUpdate(reqParams.productId, hiddenProduct).then((product, error) => {
			if(error) {
				return false;
			} else {
				return true;
			};
		});
	} else {
		return false;
	};
};



