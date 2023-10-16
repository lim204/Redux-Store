const mongoose = require('mongoose');


const {Schema} = mongoose;
const bcrypt = require ('bcrypt');
const Order = require ('./Order');

const userSchema = new Schema ({
    firstName:{
        type: String,
        require: true,
        trim: true 
    },
    lastName:{
        type: String,
        require: true,
        trim: true 
    },
    email:{
        type: String,
        require: true,
        unique: true 
    },
    password:{
        type: String,
        require: true,
        minlength: 5 
    },
    orders: [Order.schema]
});

userSchema.pre('save', async function(next){
    if (this.isNew || this.isModified('password')){
        const saltRounds =10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next ();
});

userSchema.methods.isCorrectPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User',userSchema);

module.exports = User;
