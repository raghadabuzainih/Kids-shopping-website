const jwt = require('jsonwebtoken')
const user = require('../models/user')

const handleError = (err) => {
    let errors = {'name': '' ,'email' : '', 'password' : ''}
    if(err.code === 11000){
        errors.email = 'email exists'
    }
    if(err.message.includes('incorrect email')){
        errors.email = 'email does not exist'
    }
    if(err.message.includes('incorrect password')){
        errors.password = 'incorrect password'
    }
    if(err.message.includes('user validation failed:')){
        Object.values(err.errors).forEach(error => {
            errors[error.properties.path] = error.properties.message
        });
    }
    return errors
}

const maxAge = 60*60
const createToken = (id) =>{
    return jwt.sign({id}, 'raghadAZ', {
        expiresIn: maxAge
    })
}

const get_login = (req, res) => {
    res.render('login', {titleName: 'Log in'})
}

const post_login = async(req, res) => {
    const {email, password} = req.body
    try{
        const User = await user.login(email, password)
        const token = createToken(User._id)
        res.cookie('jwt', token, {maxAge: maxAge*1000, httpOnly: true})
        res.status(200).json({user : User._id})
    }catch(err){
        let errors = handleError(err)
        res.status(400).json({errors})
    }
}

const get_signup = (req, res) => {
    res.render('signup', {titleName: 'Sign up'})
}

const post_signup = async(req, res) => {
    const {name, email, password} = req.body
    try{
        const newUser = await user.create({name, email, password})
        const token = createToken(newUser._id)
        res.cookie('jwt', token, {maxAge: maxAge*1000, httpOnly: true})
        res.status(200).json({user : newUser._id})
    }catch(err){
        let errors = handleError(err)
        res.status(400).json({errors})
    }
}

const get_clothes = (req, res) => {
    res.render('clothes', {titleName: 'Clothes'})
}

const get_shoes = (req, res) => {
    res.render('shoes', {titleName: 'Shoes'})
}

const get_toys = (req, res) => {
    res.render('toys', {titleName: 'Toys'})
}

const get_oneItem = (req, res) =>{
    const id = req.params.id
    res.render('oneItem', {titleName: 'Kids Shopping Website' ,id})
}

const post_oneItem = (req, res) =>{
    saveItem(req, res)
}

const post_home = async(req, res) => {
    saveItem(req, res)
}

const post_toys = async(req, res) => {
    saveItem(req, res)
}

const post_shoes = async(req, res) => {
    saveItem(req, res)
}

const post_clothes = async(req, res) => {
    saveItem(req, res)
}

async function saveItem(req, res){
    const {userID, itemID, title, price, quantity} = req.body
    const User = await user.findById(userID)
    const info = {itemID, title, price, quantity}
    User.cards.push(info)
    User.updateOne({cards: User.cards})
    await User.save()
    res.status(200).json({numItems: User.cards.length})
}

const get_clothes_girls = (req, res) => {
    res.render('girl-clothes', {titleName: 'Girl clothes'})
}

const post_clothes_girls = (req, res) => {
    saveItem(req, res)
}

const get_clothes_boys = (req, res) => {
    res.render('boy-clothes', {titleName: 'Boy clothes'})
}

const post_clothes_boys = (req, res) => {
    saveItem(req, res)
}

const get_clothes_pajamas = (req, res) => {
    res.render('pajama-clothes', {titleName: 'Pajama clothes'})
}

const post_clothes_pajamas = (req, res) => {
    saveItem(req, res)
}

const get_clothes_outing = (req, res) => {
    res.render('out-clothes', {titleName: 'Out clothes'})
}

const post_clothes_outing = (req, res) => {
    saveItem(req, res)
}

const get_shoes_girls = (req, res) => {
    res.render('girl-shoes', {titleName: 'Girl shoes'})
}

const post_shoes_girls = (req, res) => {
    saveItem(req, res)
}

const get_shoes_boys = (req, res) => {
    res.render('boy-shoes', {titleName: 'Boy shoes'})
}

const post_shoes_boys = (req, res) => {
    saveItem(req, res)
}

const get_listcard = (req, res) => {
    res.render('listcard', {titleName: 'List Card'})
}

const remove_item = async(req, res) => {
    const {userId, itemIndex} = req.body
    const User = await user.findById(userId)
    // هاي بدل forEach افحص عنصر عنصر
    User.cards.splice(itemIndex, 1)
    User.updateOne({cards: User.cards})
    await User.save()

    res.status(200).json({success: true})
}

const get_logout = (req, res) =>{
    res.cookie('jwt', '',{maxAge:1})
    res.redirect('/login')
}

module.exports = {
    get_login,
    post_login,
    get_signup,
    post_signup,
    get_clothes,
    get_shoes,
    get_toys,
    get_oneItem,
    post_home,
    post_toys,
    post_shoes,
    post_clothes,
    post_oneItem,
    get_listcard,
    get_clothes_boys,
    get_clothes_girls,
    get_clothes_outing,
    get_clothes_pajamas,
    get_shoes_boys,
    get_shoes_girls,
    post_clothes_boys,
    post_clothes_girls,
    post_clothes_outing,
    post_clothes_pajamas,
    post_shoes_boys,
    post_shoes_girls,
    remove_item,
    get_logout
}