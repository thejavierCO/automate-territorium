const { Router } = require('express')
const app = Router();

app.get("/unlogin",(req,res,next)=>{
    res.render("territorium",{type:req.path.split("/")[1]});
})

app.get("/login",(req,res,next)=>{
    res.render("territorium",{type:req.path.split("/")[1]});
})

app.get("/",(req,res,next)=>{
    res.render("territorium");
})

module.exports = app;