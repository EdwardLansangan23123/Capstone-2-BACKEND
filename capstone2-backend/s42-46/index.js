const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product")


app.use(cors());

mongoose.connect("mongodb+srv://edward-255:admin123@zuitt-bootcamp.gvevrth.mongodb.net/test",
	{
		useNewUrlParser : true,
		useUnifiedTopology : true

	}
);

//mongodb+srv://edward-255:admin123@zuitt-bootcamp.gvevrth.mongodb.net/?retryWrites=true&w=majority

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'))

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/users", userRoutes);
app.use("/products", productRoutes);

if(require.main === module){
	// Will used the defined port number for the application whenever an environment variable is available or will use port 4000 if none is defined
	// This syntax will allow flexibility when using the application locally or as a hosted applicaton
	app.listen(process.env.PORT || 4000, () => {
		console.log(`API is now online on port ${process.env.PORT || 4000}`)
	})
}


module.exports = app;