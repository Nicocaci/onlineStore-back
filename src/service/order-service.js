import OrderModel from "../dao/models/order-model.js";
import OrderDao from "../dao/order-dao.js";

class OrderService{
    async crearOrden(datosOrden){
        try {
            const nuevaOrden = await OrderDao.crearOrder(datosOrden);
            return nuevaOrden;
        } catch (error) {
            throw new Error('Error al crear orden (service):' + error.message);
        }
    }

    async obtenerOrdenesPorUsuarios(userId){
        try {
            const usuario = await OrderDao.obtenerOrdenesPorUsuario(userId);
            if(!usuario) throw new Error("No se encontro ningun usuario con ese ID");
            return usuario;
        } catch (error) {
            throw new Error('Error al traer orden (service):' + error.message);
        }
    }

    async obtenerTodasLasOrdenes(){
        try {
            const ordenes = await OrderModel.find();
            if(!ordenes) throw new Error("No se encontro ninguna orden");
            return ordenes;
        } catch (error) {
            throw new Error('Error al traer orden (service):' + error.message);
        }
    }
}

export default new OrderService();