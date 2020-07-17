const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido.'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    nombre:{
        type: String,
        required: [true,'El nombre es necesario.']
    },
    email: {
        type : String,
        unique:true,
        required : [true,'El correo es necesario.']
    },
    password : {
        type : String,
        required : true
    },
    img : {
        type : String,
        required :false
    }, // no es obligatorio
    role : {
        type : String,
        default : 'USER_ROLE',
        enum : rolesValidos
    },  //default : 'USER_ROLE'
    estado : {
        type : Boolean,
        default : true,
    }, //bool
    google : {
        type : Boolean,
        default : false
    } //bool
});

userSchema.methods.toJSON = function(){
    let user =this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.plugin(uniqueValidator, {message : '{PATH} debe de ser unico'})

module.exports = mongoose.model('User', userSchema);

