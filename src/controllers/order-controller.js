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

            // 1️⃣ Guardamos temporalmente el carrito en DB
            const ordenPrevia = await OrderService.crearOrden({
                comprador: { email },
                metodoPago: 'stripe',
                productos: cart.map(item => ({
                    productoId: item.product._id,
                    nombre: item.product.nombre,
                    cantidad: item.quantity,
                    precioUnitario: item.product.precio,
                    subtotal: item.product.precio * item.quantity,
                })),
                total: cart.reduce((acc, i) => acc + i.product.precio * i.quantity, 0),
                fecha: new Date(),
                estado: 'pendiente',
            });

            // 2️⃣ Generamos los line_items de Stripe
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
                    unit_amount: item.product.precio * 100,
                },
                quantity: item.quantity,
            }));

            // 3️⃣ Creamos la sesión de Stripe
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items,
                mode: 'payment',
                success_url: 'https://onlinestore-front-production.up.railway.app/gracias?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'https://onlinestore-front-production.up.railway.app/cancelado',
                customer_email: email,
                // ✅ Solo mandamos el ID de la orden
                metadata: {
                    orderId: ordenPrevia._id.toString(),
                },
            });

            res.status(200).json({ url: session.url });
        } catch (error) {
            console.error("❌ Error creando sesión de Stripe:", error);
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Webhook Stripe
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
            const orderId = session.metadata.orderId; // ✅ Recuperamos el ID que enviamos

            try {
                await OrderService.actualizarEstado(orderId, 'pagada');
                console.log(`✅ Orden ${orderId} marcada como pagada`);
            } catch (err) {
                console.error("❌ Error al actualizar orden:", err);
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
