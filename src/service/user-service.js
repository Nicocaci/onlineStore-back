import UserRepository from "../repository/user-repository.js";

    class UserService {
            async crearUsuario(dataU) {
                try {
                    const newUsuario = await UserRepository.crearUsuario(dataU)
                    return newUsuario;
                } catch (error) {
                    throw error;
                }
            }
        
            async obtenerUsuarios() {
                try {
                    const usuarios = await UserRepository.obtenerUsuarios();
                    return usuarios;
                } catch (error) {
                    throw error;
                }
            }
        
            async obtenerUsuarioId(userId) {
                try {
                    const usuarioId = await UserRepository.obtenerUsuarioId(userId);
                    return usuarioId;
                } catch (error) {
                    throw error;
                }
            }
        
            async obtenerUnUsuario(query) {
                try {
                    const usuario = await UserRepository.obtenerUnUsuario(query);
                    return usuario || null;
                } catch (error) {
                    throw error;
                }
            }
        
            async eliminarUsuario(userId) {
                try {
                    const usuario = await UserRepository.eliminarUsuario(userId);
                    return usuario;
                } catch (error) {
                    throw error;
                }
            }
        
            async actualizarUsuario(userId, dataU) {
                try {
                    const usuario = await UserRepository.actualizarUsuario(userId, dataU);
                    return usuario;
                } catch (error) {
                    throw error;
                }
            }
    }

export default new UserService();