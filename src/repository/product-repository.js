import ProductDao from "../dao/product-dao.js";

class ProductRepository {
    async crearProducto(data) {
        try {
            const nuevoProducto = await ProductDao.crearProducto(data);
            return nuevoProducto;
        } catch (error) {
            throw new Error('Error interno del REPO' + error.message)
        }
    }

    async obtenerProductos() {
        try {
            const productos = await ProductDao.obtenerProductos();
            if(!productos) throw new Error('No se encontro ningun producto');
            return productos;
        } catch (error) {
            throw new Error('Error interno del REPO' + error.message)
        }
    }

    async obtenerProductoID(prodId){
        try {
            const producto = await ProductDao.obterProductoId(prodId);
            if(!producto) throw new Error('No existe ningún producto con ese ID');
            return producto;
        } catch (error) {
            throw new Error('Error interno del REPO' + error.message)
        }
    }

    async obtenerProdCategoria(categoria){
        try {
            const producto = await ProductDao.obtenerProductoCategoria(categoria);
            if(!producto) throw new Error('No existe ningún producto con esa categoria');
            return producto;
        } catch (error) {
            throw new Error('Error interno del REPO' + error.message)
        }
    }

    async actualizarProducto(prodId, data){
        try {
            const productoActualizado = await ProductDao.actualizarProducto(prodId,data);
            if(!productoActualizado) throw new Error('Error al actualizar el producto');
            return productoActualizado;
        } catch (error) {
            throw new Error('Error interno del REPO' + error.message)
        }
    }
    async eliminarProducto(prodId){
        try {
            const producto = await ProductDao.eliminarProducto(prodId);
            if(!producto) throw new Error('Error al eliminar el producto');
            return producto;
        } catch (error) {
            throw error;
        }
    }
}

export default new ProductRepository();