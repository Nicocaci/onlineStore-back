import express from "express";
import OrderController from "../controllers/order-controller.js";

const router = express.Router();

// ⚠️ Endpoint especial para Stripe Webhook (usa raw body)
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    (req, res) => OrderController.stripeWebhook(req, res)
);

// Resto de endpoints normales
router.post("/crear-orden", express.json(), OrderController.crearOrden);
router.get("/usuario/:userId", OrderController.obtenerOrdenesPorUsuarios);
router.get("/todas", OrderController.obtenerTodasLasOrdenes);

export default router;
