const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const productSchema= new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },

    productDescription: {
        type: String,
        required: true,
    },
    
    imageUrl: {
        type: Buffer,
        required: true
    },

    brand: {
        type: String,
        required: true
    },

    model: {
        type: String,
        required: true
    },

    stock: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },
},

{timestamps: true}
)

productSchema.plugin(uniqueValidator)

module.exports = mongoose.model("productSchema", productSchema)