import UserModel from "./models/user-model.js";

class UserDao {
    async nuevoUsuario(dataU) {
        try {
            const usuarioNuevo = new UserModel(dataU);
            await usuarioNuevo.save();
            return usuarioNuevo;
        } catch (error) {
            throw error;
        }
    }
    async find() {
        try {
            const usuarios = await UserModel.find();
            return usuarios; 
        } catch (error) {
            console.error("Error en find:", error);
            throw error;
        }
    }

    async findById(userId) {
        try {
            const usuario = await UserModel.findById(userId);
            return usuario || null;
        } catch (error) {
            throw error;
        }
    }

    async findOne(query) {
        try {
            const usuario = await UserModel.findOne(query);
            return usuario || null; 
        } catch (error) {
            console.error("Error en findOne:", error);
            throw error; 
        }
    }


    async deleteUser(userId) {
        try {
            const usuario = await UserModel.findByIdAndDelete(userId);
            if (!usuario) throw new Error('No se encontró ningun usuario para eliminar')
        } catch (error) {
            throw error;
        }
    }
    async updateUser(userId, dataU) {
        try {
            const usuario = await UserModel.findByIdAndUpdate(userId, dataU, { new: true });
            if (!usuario) throw new Error('No se encontró ningun usuario para actualizar')
        } catch (error) {
            throw error;
        }
    }
}

export default new UserDao();