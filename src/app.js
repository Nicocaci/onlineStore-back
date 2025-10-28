import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

//Rutas
import productRouter from "./routes/product-router.js";
import userRouter from "./routes/user-router.js";
import cartRouter from "./routes/cart-router.js";
import orderRouter from "./routes/order-router.js";
import checkRouter from "./routes/checkOut-router.js";

const app = express();
const PORT = 8080;

mongoose.connect("mongodb+srv://nicocaci:nicocaci@coderhouse.ihpiu.mongodb.net/onlineStore?retryWrites=true&w=majority&appName=coderhouse")
    .then(() => console.log("Conectado con MongoDB"))
    .catch(() => console.log("Error al conectar con MongoDB"))


//MiddleWare
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("./src/public"));
app.use('/uploads', express.static('uploads'));

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
}));

app.get("/", (req,res) => {
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