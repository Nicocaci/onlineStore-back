import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    dni: {
        type: Number,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contraseña: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

const UserModel = mongoose.model('users', userSchema);

export default UserModel;