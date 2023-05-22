const jwt = require("jsonwebtoken");
const secret = "BookingAPI";


module.exports.creationAccessToken = (user) => {
	const data = {
		id : user._id,
		email : user.email,
		isAdmin : user.isAdmin
	};


	return jwt.sign(data, secret, {});
}


module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;

	if (typeof token !== "undefined"){
		console.log(token)

		token = token.slice(7, token.length);

		return jwt.verify(token, secret, (err, data) => {

			if(err) {
				return res.send({auth : "failed"})
			
			} else {
				next();
			}

		})
	} else {
		return res.send({auth : "failed"})
	};
};


// Token decryption

module.exports.decode = (token) => {
	// token received and is not undefined
	if(typeof token !== "undefined") {
		token = token.slice(7, token.length);

		return jwt.verify(token, secret, (err, data) => {

			if(err){
				return null;
			} else {
				return jwt.decode(token, {complete:true}.payload);
			}
		})
	// Token does not exist
	} else {
		return null;
	}
}


