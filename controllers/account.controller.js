const accountModel = require ("../models/account.model")

module.exports = {
    register: async(req, res)=>{
        const body = req.body //các thông tin đăng kí
        const newAccout = await accountModel.create(body);
        return res.status(201).json(newAccout);
    },
    login: async(req, res)=>{
        const body = req.body //các thông đăng nhập        
        const account = await accountModel.findOne({
            username: body.username,
            password: body.password
        })
        if(!account){
            return res.status(404).json({
                statusCode: 404,
                message: 'Tài khoản hoặc mật khẩu không đúng'
            })
        }
        return res.status(200).json(account)
    }
}