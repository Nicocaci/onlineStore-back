import CartService from "../service/cart-service.js";

class CartController {
        async createCart(req, res) {
        try {
            const newCart = await CartService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getCart(req, res) {
        try {
            const cart = await CartService.obtenerCarritos();
            res.status(201).json(cart);
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getCartById(req, res) {
        const cid = req.params.id;
        try {
            const cart = await CartService.obtenerCarritoId(cid);
            if (!cart) {
                return res.status(404).json({ message: "No se encontro ningun carrito" });
            }
            res.status(201).json(cart);
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    async getProductsCart(req, res) {
        const cid = req.params.id;
        try {
            const cart = await CartService.obtenerCarritoId(cid);
            if (!cart) {
                return res.status(404).json({ message: "No se encontro ningun carrito" });
            }
            res.status(201).json(cart);
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }


    async addProductToCart(req, res) {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity || 1;

        try {
            const addProduct = await CartService.addProductToCart(cid, pid, quantity);
            res.status(201).json(addProduct.products);
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }


    async removeProductFromCart(req, res) {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;

        try {
            const removeProduct = await CartService.removeProductFromCart(cid, pid, quantity);
            res.status(201).json(removeProduct.products);
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateProductQuantity(req, res) {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;

        try {
            const updateProduct = await CartService.updateProductQuantity(cid, pid, quantity);
            res.status(201).json(updateProduct.products)
        } catch (error) {
            console.log(error.message);

            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateCart(req, res) {
        const cid = req.params.id;
        const products = req.body.products;
        try {
            const updateCart = await CartService.updateCart(cid, products);
            res.status(201).json(updateCart.products)
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async deleteCart(req, res) {
        const cid = req.params.cid;
        try {
            const deleteCart = await CartService.deleteCart(cid);
            res.status(201).json(deleteCart)
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    // En el controlador:
    async clearCart(req, res) {
        const cid = req.params.cid;
        try {
            const updatedCart = await CartService.clearCartProducts(cid);
            res.status(200).json(updatedCart);
        } catch (error) {
            console.error("Error al vaciar carrito:", error);
            res.status(500).json({ error: "Error interno al vaciar carrito" });
        }
    }

    async getCartByToken(req, res) {
        try {
            const cartId = req.user.cart; // viene del token decodificado

            const cart = await CartModel.findById(cartId).populate("products.product");
            if (!cart) {
                return res.status(404).json({ message: "Carrito no encontrado" });
            }

            res.status(200).json(cart);
        } catch (error) {
            console.error("Error al obtener el carrito por token:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    };
}

export default new CartController();