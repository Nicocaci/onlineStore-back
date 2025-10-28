import OrderModel from "./models/order-model.js";

class OrderDao {
    async crearOrder(ordenData) {
        const nuevaOrden = new OrderModel(ordenData);
        return await nuevaOrden.save();
    }

    async obtenerOrdenesPorUsuario(userid) {
    return (await OrderModel.find({userid})).toSorted({fecha: -1});
    }
}

export default new OrderDao();