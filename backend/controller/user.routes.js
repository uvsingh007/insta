const express = require("express");
const { UserModel } = require("../model/user.model");
const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken");
const { TokenModel } = require("../model/token.model");
require("dotenv").config();

const userRouter = express.Router();


userRouter.post("/login",async(req,res)=>{
    console.log("enter");
    try{
        const {email,password} = req.body;
        const user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    const token = jwt.sign({id:user._id},process.env.accessTokenSecret,{expiresIn:process.env.accessTokenLife})
                    const refreshToken = jwt.sign({id:user._id},process.env.refreshTokenSecret,{expiresIn:process.env.refreshTokenLife})
                    res.cookie("token",token)
                    res.status(200).send({
                        msg:"User login successful",
                        token,
                        refreshToken
                    })
                }
                else{
                    res.status(400).send({
                        msg:"Please enter the correct password"
                    })
                }
            })
        }
        else{
            res.status(400).send({
                msg:"User doesn't exist. Please register!"
            })
        }
    }
    catch(err){
        res.status(400).send({
            msg:"error while checking user",
            err
        })
    }
})

userRouter.post("/register",async(req,res)=>{
    try{
        const {email,password} =req.body;
        const user = await UserModel.findOne({email});
        if(!user){
            bcrypt.hash(password,5,async(err,hash)=>{
                try{
                    if(hash){
                        const user = new UserModel({...req.body,password:hash});
                        await user.save();
                        res.status(200).send({
                            msg:"new user has been added"
                        })
                    }
                    else{
                        res.status(400).send({
                            msg:"error while hashing user password",
                            err
                        })
                    }
                }
                catch(err){
                    res.status(400).send({
                        msg:"error while adding a new user",
                        err
                    })
                }
            })
        }
        else{
            res.status(400).send({
                msg:"User already registered. Please login again!"
            })
        }
    }
    catch{
        res.status(400).send({
            msg:"error while checking user",
            err
        })
    }
})

userRouter.get("/logout",async(req,res)=>{
    try{
        const token = req.cookies.token;
        const blackToken = new TokenModel({token});
        await blackToken.save();
        res.status(200).send({
            msg:"Logout successful",
        })
    }
    catch{
        res.status(400).send({
            msg:"error while logging out",err
        })
    }
})


module.exports={
    userRouter
}