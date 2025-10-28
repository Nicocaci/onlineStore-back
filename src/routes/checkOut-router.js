import Stripe from "stripe";
import express from "express";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.get("/session/:id", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.id);
        res.json(session);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
