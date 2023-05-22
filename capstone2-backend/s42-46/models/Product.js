const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "Name is required"],
  },

  image : {
  	type : Object,
  	required : [true, "Image is required!"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  userOrders: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "UserId is required"],
      },
      orderId: {
        type: String,
        ref: "Order",
      },
      isCancelled: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
      },
      purchasedOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
