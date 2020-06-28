const api = require("./territorio");
const { Router } = require("express");
const app = Router();

const test = false;

const tr = test!==false?
(new api("https://webhook.site/8fe70860-9770-41f4-8b13-89815c9e0852"))
:(new api("https://conalep.territorio.la/"));

app.get("/getSession",(req,res,next)=>{
    tr.test()
    .then(e=>{
        res.json(e);
    })
    .catch(e=>{
        res.json(e);
    })
})

app.post("/getAuth",({body:{user,pass,cookies}},res,next)=>{
    tr.test(user,pass,cookies)
    .then(e=>{
        res.json(e);
    })
    .catch(e=>{
        res.json(e);
    })
})

app.post("/setAction",({body:{cookie,type,params}},res,next)=>{
    tr.set(type,params,cookie)
    .then(({data})=>{
        res.render("main",{string:data.text()});
    })
    .catch(e=>{
        res.json(e);
    })
})

module.exports = app;