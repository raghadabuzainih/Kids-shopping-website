const user = require('../models/user')
const jwt = require('jsonwebtoken')

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, 'raghadAZ', async(err, decodedtoken)=>{
            if(err){
                res.locals.user = null
                next()
            }else{
                const User = await user.findById(decodedtoken.id)
                res.locals.user = User
                next()
            }
        })
    }else{
        res.locals.user = null
        next()
    }
    
}

module.exports = {checkUser}