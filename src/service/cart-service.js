import CartRepository from "../repository/cart-repository.js";
import CartModel from "../dao/models/cart-model.js";

class CartService {
    async newCart() {
        try {
            const cart = await CartRepository.newCart();
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async obtenerCarritos() {
        try {
            const carts = await CartRepository.obtenerCarritos();
            if (!carts) throw new Error("No se encontró ningun carrito");
            return carts;
        } catch (error) {
            throw error;
        }
    }

    async obtenerCarritoId(cartId) {
        try {
            const carritoId = await CartRepository.obtenerCarritoId(cartId);
            return carritoId;
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId,productId,quantity) {
        try {
            return await CartRepository.addProductToCart(cartId, productId, quantity);
        } catch (error) {
            throw error; 
        }
    }

    async removeProductFromCart(cartId,productId,quantity) {
        try {
            return await CartRepository.removeProudctFromCart(cartId,productId,quantity);
        } catch (error) {
            throw error;
        }
    }
    
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            return await CartRepository.updateProductQuantity(cartId, productId, quantity);
        } catch (error) {
            throw error;
        }
    }

    async updateCart(cartId, products) {
        try {
            return await CartRepository.updateCart(cartId,products);
        } catch (error) {
            throw error;
        }
    }

    async clearCartProducts(cartId) {
    // Buscar el carrito y eliminar todos los productos
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = []; // vaciar array de productos

    await cart.save();

    return cart;
}

    async deleteCart(cartId) {
        try {
            const cart = await CartRepository.deleteCart(cartId);
            if ( !cart) throw new Error("No se encontró ningun carrito con ese Id");
            return cart;
        } catch (error) {
            throw error;
        }
    }
}

export default new CartService();