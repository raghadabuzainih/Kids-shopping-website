const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const {isEmail} = require('validator')

const userSc = new Schema({
    'name' : {
        type: String,
        required: [true, 'enter your name']
    },
    'email' : {
        type: String,
        required: [true, 'enter your email'],
        unique: [true, 'user exists'],
        validate: [isEmail, 'enter valid email']
    },
    'password' : {
        type: String,
        required: [true, 'enter your email'],
        minLength: [6, 'minimum length is 6']
    },
    // array because I want to store multiple cards
    'cards' : {
        type: Array
    }
}, {timestamps: true})

userSc.pre('save', async function(next){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt()
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

userSc.statics.login = async function(email, password){
    const User = await this.findOne({email})
    if(User){
        const verify = await bcrypt.compare(password, User.password)
        if(verify) return User
        else throw Error('incorrect password')
    }else throw Error('incorrect email')
} 

const user = mongoose.model('user', userSc)
module.exports = user