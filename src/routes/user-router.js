import UserController from "../controllers/user-controller.js";
import express from "express";

const router = express.Router();

router.get("/", UserController.obtenerUsuarios);
router.post("/registro", UserController.registro);
router.post("/iniciarSesion", UserController.iniciarSesion);
router.post("/cerrarSesion", UserController.cerrarSesion);
router.delete("/:uId", UserController.borrarUsuario);
router.put("/:id", UserController.actualizarUsuario);
router.get("/:id", UserController.obtenerUsuarioId);

export default router;