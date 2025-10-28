import OrderService from '../service/order-service.js';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

console.log("🧩 JWT_SECRET cargado:", process.env.JWT_SECRET);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class OrderController {
    // ✅ Crear sesión de Stripe (checkout)
    async crearOrden(req, res) {
        try {
            const { cart, email } = req.body;

            const line_items = cart.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.product.nombre,
                        images: Array.isArray(item.product.imagenes)
                            ? item.product.imagenes.filter(Boolean)
                            : item.product.imagenes
                                ? [item.product.imagenes]
                                : [],
                    },
                    unit_amount: item.product.precio * 100, // en centavos
                },
                quantity: item.quantity,
            }));

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items,
                mode: 'payment',
                success_url: 'http://localhost:5173/gracias?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'http://localhost:5173/cancelado',
                customer_email: email,
                // 🔥 Guardamos el carrito como metadata
                metadata: {
                    cart: JSON.stringify(cart),
                },
            });

            res.status(200).json({ url: session.url });
        } catch (error) {
            console.error("❌ Error creando sesión de Stripe:", error);
            res.status(500).json({ error: error.message });
        }
    }

    // Webhook para confirmar pago y guardar la orden
    async stripeWebhook(req, res) {
        let event;

        try {
            const sig = req.headers['stripe-signature'];
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error("⚠️ Error verificando firma del webhook:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            try {
                const cart = JSON.parse(session.metadata.cart || '[]');

                const nuevaOrden = {
                    comprador: {
                        nombre: session.customer_details?.name || 'Sin nombre',
                        email: session.customer_email,
                    },
                    metodoPago: 'stripe',
                    productos: cart.map(item => ({
                        productoId: item.product._id,
                        nombre: item.product.nombre,
                        cantidad: item.quantity,
                        precioUnitario: item.product.precio,
                        subtotal: item.product.precio * item.quantity,
                    })),
                    total: session.amount_total / 100,
                    fecha: new Date(),
                };

                await OrderService.crearOrden(nuevaOrden);
                console.log("✅ Orden guardada tras pago exitoso:", nuevaOrden);
            } catch (err) {
                console.error("❌ Error al guardar orden desde webhook:", err);
            }
        }

        res.status(200).json({ received: true });
    }

    // Obtener órdenes por usuario
    async obtenerOrdenesPorUsuarios(req, res) {
        try {
            const userId = req.params.userId;
            const ordenes = await OrderService.obtenerOrdenesPorUsuarios(userId);
            res.status(200).json({ ordenes });
        } catch (error) {
            console.error('Error al obtener órdenes:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }

    // Obtener todas las órdenes
    async obtenerTodasLasOrdenes(req, res) {
        try {
            const ordenes = await OrderService.obtenerTodasLasOrdenes();
            res.status(200).json(ordenes);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }
}

export default new OrderController();
