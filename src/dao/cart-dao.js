import CartModel from "./models/cart-model.js";
import ProductModel from "./models/product-model.js";

class CartDao {
    async createCart() {
        try {
            const nuevoCart = new CartModel();
            return await nuevoCart.save()
        } catch (error) {
            throw error;
        }
    }

    async getCart() {
        try {
            const carts = await CartModel.find();
            if (!carts) throw new Error('No se encontró ningun carrito');
            return carts;
        } catch (error) {
            throw error;
        }
    }

    async getCartId(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate("products.product");
            if (!cart) throw new Error('No se encontró ningun carrito con ese ID');
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async addProductCart(cartId, productId, quantity) {
        try {
            // Buscamos un carrito
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new Error("No se encontró ninugn carrito")

            //Buscamos un producto para validar existencia
            const product = await ProductModel.findById(productId);
            if (!product) throw new Error("No se encontró ningun producto");

            //Verificamos si el producto ya está en el carrito
            //NOTA: p.product es ObjectId, no objeto, asi que lo comparamos directo productId
            const productIndex = cart.products.findIndex(p =>
                p.product.toString() === productId.toString()
            );

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }


            //Guardar carrito actualizado
            await cart.save();

            //Traer carrito actualizar con populate para devolverlo
            const updateCart = await CartModel.findById(cartId).populate("products.product");
            return updateCart;

        } catch (error) {
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId, quantity = 1) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new Error("No se encontró ningún carrito");

            const product = await ProductModel.findById(productId);
            if (!product) throw new Error("No se encontró ningún producto");

            const productIndex = cart.products.findIndex(
                (p) => p.product.toString() === productId
            );

            if (productIndex === -1)
                throw new Error("El producto no se encuentra en el carrito");

            if (cart.products[productIndex].quantity <= quantity) {
                cart.products.splice(productIndex, 1);
            } else {
                cart.products[productIndex].quantity -= quantity;
            }

            await cart.save();

            return cart;
        } catch (error) {
            console.error("❌ Error en removeProductFromCart:", error);
            throw error;
        }
    }


    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new Error("No se encontro ningún carrito");

            const product = await ProductModel.findById(productId);
            if (!product) throw new Error(" No se encontro ningún producto")

            const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);

            if (productIndex === -1) throw new Error("El carrito se encuentra vacío");

            cart.products[productIndex].quantity = quantity;

            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateCart(cartId, products) {
        try {
            const updateCart = await CartModel.findByIdAndUpdate(cartId, { products }, { new: true });
            return updateCart;
        } catch (error) {
            throw error;
        }
    }

    async deleteCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndDelete(cartId);
            return cart;
        } catch (error) {
            throw error;
        }
    }
}

export default new CartDao();