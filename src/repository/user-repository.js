import UserDao from "../dao/user-dao.js";


class UserRepository {
    async crearUsuario(dataU) {
        try {
            const newUsuario = await UserDao.nuevoUsuario(dataU);
            return newUsuario;
        } catch (error) {
            throw error;
        }
    }

    async obtenerUsuarios() {
        try {
            const usuarios = await UserDao.find();
            return usuarios;
        } catch (error) {
            throw error;
        }
    }

    async obtenerUsuarioId(userId) {
        try {
            const usuarioId = await UserDao.findById(userId);
            return usuarioId;
        } catch (error) {
            throw error;
        }
    }

    async obtenerUnUsuario(query) {
        try {
            const usuario = await UserDao.findOne(query);
            return usuario || null;
        } catch (error) {
            throw error;
        }
    }

    async eliminarUsuario(userId) {
        try {
            const usuario = await UserDao.deleteUser(userId);
            return usuario;
        } catch (error) {
            throw error;
        }
    }

    async actualizarUsuario(userId, dataU) {
        try {
            const usuario = await UserDao.updateUser(userId, dataU);
            return usuario;
        } catch (error) {
            throw error;
        }
    }
}
export default new UserRepository();