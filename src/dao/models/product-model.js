import mongoose, { trusted } from "mongoose";

const productSchemma = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    marca: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    estado: {
        type:Boolean,
        default: true
    },
    img: {
        type: [String],
        
    }
})

const ProductModel = mongoose.model("products", productSchemma);

export default ProductModel;