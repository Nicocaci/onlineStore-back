import ProductRepository from "../repository/product-repository.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../uploads");

function eliminarArchivoSiExiste(nombreArchivo) {
    const rutaCompleta = path.join(uploadsDir, nombreArchivo);
    if (fs.existsSync(rutaCompleta)) {
        fs.unlinkSync(rutaCompleta);
    }
}

class ProductService {
    async crearProducto(data) {
        try {
            const nuevoProducto = await ProductRepository.crearProducto(data);
            return nuevoProducto;
        } catch (error) {
            throw new Error('Error interno del REPO' + error.message)
        }
    }

    async obtenerProductos() {
        try {
            const productos = await ProductRepository.obtenerProductos();
            if (!productos) throw new Error('No se encontro ningun producto');
            return productos;
        } catch (error) {
            throw new Error('Error interno del REPO' + error.message)
        }
    }

    async obtenerProductoID(prodId) {
        try {
            const producto = await ProductRepository.obtenerProductoID(prodId)
            if (!producto) throw new Error('No existe ningún producto con ese ID');
            return producto;
        } catch (error) {
            throw new Error('Error interno del REPO' + error.message)
        }
    }

    async obtenerProdCategoria(categoria) {
        try {
            const producto = await ProductRepository.obtenerProdCategoria(categoria);
            if (!producto) throw new Error('No existe ningún producto con esa categoria');
            return producto;
        } catch (error) {
            throw new Error('Error interno del REPO' + error.message)
        }
    }

    async actualizarProducto(prodId, data) {
        try {
            const productoActualizado = await ProductRepository.actualizarProducto(prodId, data);
            if (!productoActualizado) throw new Error('Error al actualizar el producto');
            return productoActualizado;
        } catch (error) {
            throw new Error('Error interno del REPO' + error.message)
        }
    }
    async eliminarProducto(prodId) {
        try {
            const producto = await ProductRepository.eliminarProducto(prodId);
            if (!producto) throw new Error('Error al eliminar el producto');
            if (producto.imagen?.length > 0) {
                producto.imagen.forEach(eliminarArchivoSiExiste);
            }
            return producto;
        } catch (error) {
            throw error;
        }
    }
}

export default new ProductService();