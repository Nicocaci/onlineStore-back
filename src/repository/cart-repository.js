import CartDao from "../dao/cart-dao.js";

class CartRepository {
    async newCart() {
        try {
            const cart = await CartDao.createCart();
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async obtenerCarritos() {
        try {
            const carts = await CartDao.getCart();
            if (!carts) throw new Error("No se encontró ningun carrito");
            return carts;
        } catch (error) {
            throw error;
        }
    }

    async obtenerCarritoId(cartId) {
        try {
            const carritoId = await CartDao.getCartId(cartId);
            return carritoId;
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId,productId,quantity) {
        try {
            return await CartDao.addProductCart(cartId, productId, quantity);
        } catch (error) {
            throw error; 
        }
    }

    async removeProudctFromCart(cartId,productId,quantity) {
        try {
            return await CartDao.removeProductFromCart(cartId,productId,quantity)
        } catch (error) {
            throw error;
        }
    }
    
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            return await CartDao.updateProductQuantity(cartId, productId, quantity);
        } catch (error) {
            throw error;
        }
    }

    async updateCart(cartId, products) {
        try {
            return await CartDao.updateCart(cartId,products);
        } catch (error) {
            throw error;
        }
    }

    async deleteCart(cartId) {
        try {
            const cart = await CartDao.deleteCart(cartId);
            if ( !cart) throw new Error("No se encontró ningun carrito con ese Id");
            return cart;
        } catch (error) {
            throw error;
        }
    }
}

export default new CartRepository();