import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotnev from "dotenv";

//Rutas
import productRouter from "./routes/product-router.js";
import userRouter from "./routes/user-router.js";
import cartRouter from "./routes/cart-router.js";
import orderRouter from "./routes/order-router.js";
import checkRouter from "./routes/checkOut-router.js";

dotnev.config();
const app = express();
const PORT = process.env.PORT || 8080;
const allowedOrigins = [
    "http://localhost:5173",
    "https://onlinestore-front-production.up.railway.app",
];
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Conectado con MongoDB"))
    .catch(() => console.log("Error al conectar con MongoDB", err))


//MiddleWare
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("./src/public"));
app.use('/uploads', express.static('uploads'));

app.use(
    cors({
        origin: (origin, callback) => {
            // Permitir requests sin origin (por ejemplo, Postman)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error("CORS no permitido por este dominio"));
            }
        },
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    })
);

app.get("/", (req, res) => {
    res.send("Estamos On")
})
app.use("/api/productos", productRouter);
app.use("/api/usuarios", userRouter);
app.use("/api/carrito", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/checkout", checkRouter);

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});     