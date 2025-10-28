import express from "express";
import ProductController from "../controllers/product-controller.js";
import upload from "../config/multerConfig.js";

const router = express.Router()


router.post('/', upload.fields([
    {name:'img', maxCount:10}
]), ProductController.crearProducto);
router.get('/', ProductController.obtenerProductos);
router.get('/categoria/:pId', ProductController.obtenerProductoCategoria);
router.get('/:pId', ProductController.obtenerProductoId);
router.put('/:pId', upload.single('img'), ProductController.actualizarProducto);
router.delete('/:pId', ProductController.eliminarProducto);

export default router;