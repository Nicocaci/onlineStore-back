import ProductService from "../service/product-service.js";
import ProductModel from "../dao/models/product-model.js";
import fs from 'fs';
import path from 'path';

class ProductController {
    async crearProducto(req, res) {
        const { nombre, categoria, marca, descripcion, precio, estado, img } = req.body;
        const imagenes = req.files?.img?.map(file => file.filename) || [];
        try {
            const nuevoProducto = await ProductService.crearProducto({
                nombre,
                categoria,
                marca,
                descripcion,
                precio,
                estado,
                img: imagenes
            })
            res.status(201).json({
                message: "Producto creado correctamente",
                nuevoProducto
            })
        } catch (error) {
            console.error("Error al crear el producto:", error);
            res.status(500).json({
                error: error.message
            })
        }
    }

    async obtenerProductos(req, res) {
        try {
            const productos = await ProductService.obtenerProductos();
            res.status(200).json(productos)
        } catch (error) {
            res.status(500).json({
                error: "Error interno del controlador de productos"
            })
        }
    }
    async obtenerProductoId(req, res) {
        const prodId = req.params.pId;
        try {
            const producto = await ProductService.obtenerProductoID(prodId);
            if (!producto) {
                return res.status(404).json({ message: "No se encontro ningun producto con ese ID" });
            }
            res.status(200).json(producto)
        } catch (error) {
            console.log("Error al obtener ese producto:", error);
            res.status(500).json({ error: "Error interno del controlador de productos" });
        }
    }

    async obtenerProductoCategoria(req, res) {
        const prodcategoria = req.params.pId;
        try {
            const producto = await ProductService.obtenerProdCategoria(prodcategoria);

            // Asegurarse de que siempre sea un array
            const productArray = Array.isArray(producto) ? producto : [producto];
            if (!productArray.length) {
                return res.status(404).json({ message: "No se encontró ningún producto con esa categoría" });
            }
            res.status(200).json(productArray);
        } catch (error) {
            console.log("Error al obtener productos por categoría:", error);
            res.status(500).json({ error: "Error interno del controlador de productos" });
        }
    }
    async actualizarProducto(req, res) {
        const prodId = req.params.pId;
        const data = req.body;
        try {
            //Producto actual
            const productoActual = await ProductModel.findById(prodId);
            if (!productoActual) {
                res.status(404).json({
                    message: "Producto no encontrado"
                })
            }
            // Si se subió una imagen nueva
            if (req.file) {
                const nuevaImagen = req.file.filename;
                data.imagen = [nuevaImagen]; // tu modelo usa array

                // Eliminar imagen anterior del disco
                if (productoActual.imagen?.[0]) {
                    const rutaAnterior = path.join('uploads', productoActual.imagen[0]);
                    if (fs.existsSync(rutaAnterior)) {
                        fs.unlinkSync(rutaAnterior);
                    }
                }
            }
            await ProductService.actualizarProducto(prodId, data);
            res.json({
                message: "Producto actualizado correctamente"
            })
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            res.status(500).json({ error: "Error interno del controlador de productos" });
        }
    }

    async eliminarProducto(req, res) {
        const prodId = req.params.pId;
        try {
            const productoEliminado = await ProductService.eliminarProducto(prodId);
            if (!productoEliminado) {
                return res.status(404).json({ message: "Producto no encontrado para eliminar" })
            }
            res.status(200).json({ message: "Producto eliminado correctamente" })
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }

    }
}
export default new ProductController();