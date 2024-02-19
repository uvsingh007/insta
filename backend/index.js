const express = require("express");
const { connection } = require("./config/db");
const cookieParser = require("cookie-parser");
const { userRouter } = require("./controller/user.routes");
const { auth } = require("./middleware/auth.middleware");
require("dotenv").config();

const app = express();
app.use(express.json(),cookieParser());
app.use("/users",userRouter);
app.get("/",(req,res)=>{
    res.status(200).send({
        msg:"This is the homepage"
    })
})

app.listen(process.env.port,async()=>{
    try{
        await connection;
        console.log("connected to db");
        console.log(`server running on port ${process.env.port}`);
    }
    catch(err){
        console.log("error occured while connecting to db",err);
    }
})