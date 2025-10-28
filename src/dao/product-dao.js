import ProductModel from "./models/product-model.js";
import mongoose from "mongoose";

class ProductDao {
    async crearProducto(data) {
        try {
            const nuevoProducto = await ProductModel.create(data);
            return nuevoProducto;
        } catch (error) {
            throw new Error('Error al crear producto:' + error.message);
        }
    }

    async obtenerProductos() {
        try {
            const productos = await ProductModel.find();
            if (!productos) throw new Error("No hay productos creados");
            return productos;
        } catch (error) {
            throw new Error('Error al obtener el listado de productos:' + error.message);
        }
    }

    async obterProductoId(prodId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(prodId)) {
                throw new Error("ID inválido");
            }
            const productoId = await ProductModel.findById(prodId);
            if(!productoId) throw new Error('No existe ningun producto con ese ID');
            return productoId;
        } catch (error) {
            throw new Error('Error al obtener el producto' + error.message);
        }
    }
    
    async obtenerProductoCategoria(categoria){
        try {
            const productoCat = await ProductModel.find({categoria});
            if(!productoCat) throw new Error('No existe producto con esa categoria');
            return productoCat;
        } catch (error) {
            throw new Error('Error al obtener el producto' + error.message);
        }
    }

    async actualizarProducto(prodId,data) {
        try {
            const actualizarProducto = await ProductModel.findByIdAndUpdate(prodId, data, {new:true});
            if(!actualizarProducto) throw new Error('Producto no encontrado');
            return actualizarProducto;
        } catch (error) {
            throw new Error('Error al actualizar producto' + error.message)
        }
    }

    async eliminarProducto(prodId) {
        try {
            const producto = await ProductModel.findByIdAndDelete(prodId);
            if(!producto) throw new Error('Producto no encontrado');
            return producto;
        } catch (error) {
            throw error;
        }
    }
}
export default new ProductDao();