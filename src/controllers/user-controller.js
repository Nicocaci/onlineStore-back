import UserService from "../service/user-service.js";
import bcrypt from 'bcrypt';
import UserModel from "../dao/models/user-model.js";
import CartService from "../service/cart-service.js";
import generatetoken from "../utils/jsonwebtoken.js";

class UserController {
    async registro(req, res) {
        const { nombre, apellido, dni, direccion, email, contraseña, cart, role } = req.body;
        try {
            const existeUsuario = await UserService.obtenerUnUsuario({ email });
            console.log(existeUsuario);
            
            if (existeUsuario) {
                return res.status(400).json({ message: 'El email ya esta registrado.' })
            }

            const hashPassword = bcrypt.hashSync(contraseña, 10);

            const nuevoCarrito = await CartService.newCart();
            
            
            const nuevoUsuario = await UserService.crearUsuario({
                nombre,
                apellido,
                dni,
                direccion,
                email,
                contraseña: hashPassword,
                cart: nuevoCarrito._id,
                role
            });

            return res.status(201).json({
                message: 'Usuario registrado con éxito',
                usuario: nuevoUsuario,
            });
        } catch (error) {
            res.status(500).json({ message: 'Error interno del controller' + error })
        }
    }

    async iniciarSesion(req, res) {
        const { email, contraseña } = req.body;
        try {
            const usuario = await UserService.obtenerUnUsuario({ email });
            if (!usuario) {
                return res.status(400).json({ message: "Email no registrado" })
            };
            const esValid = await bcrypt.compare(contraseña, usuario.contraseña);
            if (!esValid) {
                return res.status(401).json({ message: "Contraseña incorrecta" })
            };

            const token = generatetoken({
                _id: usuario._id,
                cart: usuario.cart,
                email: usuario.email,
                direccion: usuario.direccion,
                role: usuario.role
            });

            res.cookie('access_token', token, {
                httpOnly: false,
                sameSite: 'none',       // ⬅️ Lax funciona bien en la mayoría de los casos sin requerir HTTPS
                maxAge: 24 * 60 * 60 * 1000,
                path: '/',
                domain: '.railway.app'
            });


            return res.status(201).json({
                message: "Login con éxito",
                token
            });
        } catch (error) {
            res.status(500).json({ message: 'Error de Login: ' + error.message });
        }
    }

    async cerrarSesion(req, res) {
        res.clearCookie('access_token', {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            path: "/",
            domain: 'railway.app'
        });
        res.status(200).json({ message: "Logout exitoso" });
    }

    async borrarUsuario(req, res) {
        const uId = req.params.uId;
        try {
            const user = await UserService.deleteUser(uId);
            if (!user) {
                return res.status(404).json({ message: "No se encontro usuario" })
            }
            return res.status(204).json({ message: "Usuario eliminado con exito" });

        } catch (error) {
            res.status(500).json({ message: 'Error para eliminar usuario ' + error.message });
        }
    }

    async actualizarUsuario(req, res) {
        const userId = req.params.id;
        const userData = req.body;
        try {
            const usuarioActualizado = await UserService.actualizarUsuario(userId, userData);
            if (!usuarioActualizado) {
                res.status(404).json({ message: "Usuario no encontrado" })
            };
            res.status(200).json({
                message: "Usuario actualizado con éxito",
                user: usuarioActualizado
            })
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar usuario: ' + error.message });
        }
    }

    async obtenerUsuarios(req, res) {
        try {
            const usuarios = await UserService.obtenerUsuarios();
            res.status(200).json(usuarios)
        } catch (error) {
            res.status(500).json({ message: 'Error al traer usuario: ' + error.message });
        }
    }

    async obtenerUsuarioId(req, res) {
        const { id } = req.params;

        try {
            const user = await UserService.obtenerUsuarioId({ _id: id });
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            };
            res.status(200).json(user);
        } catch (error) {
            console.error('Error al obtener usuario:', error.message);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}

export default new UserController();