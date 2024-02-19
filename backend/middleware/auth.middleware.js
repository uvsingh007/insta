const jwt = require("jsonwebtoken");
const { TokenModel } = require("../model/token.model");
require("dotenv").config();

async function auth(req,res,next){
    try{
        const token = req.headers.authorization?.split(" ")[1]||req.cookies.token;
        const blackToken = await TokenModel.findOne({token});
        console.log(req.file?.path);
        if(!blackToken){
            jwt.verify(token,process.env.accessTokenSecret,(err,payload)=>{
                // console.log(payload,err);
                if(payload){
                    next();
                }
                else{
                    res.status(400).send({
                        msg:"Error while verifying token",
                        err
                    })
                }
            })
        }
        else{
            res.status(400).send({
                msg:"Token blacklisted. please login again!"
            })
        }
    }
    catch(err){
        res.status(400).send({
            msg:"error occured while checking token",
            err
        })
    }
}

module.exports={
    auth
}