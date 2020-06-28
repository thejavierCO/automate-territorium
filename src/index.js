const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const api = require("./components/territorio")
const app = express();

const test = false;

const tr = test!==false?
(new api("https://webhook.site/8fe70860-9770-41f4-8b13-89815c9e0852"))
:(new api("https://conalep.territorio.la/"));

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan("dev"));
app.engine("ejs",require("ejs-mate"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port',process.env.PORT||3000);

app.use("/files",express.static(__dirname+"/public"));

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

// app.use("/",({body:{user="",pass=""},headers},res,next)=>{
//     tr.test()
//     .then(e=>tr.test(user,pass,e))
//     .then(({data})=>{
//         if(!data.text)throw "require text";
//         res.render("main",{string:data.text()});
//     })
//     .catch(a=>{
//         console.log(a);
//         res.render("main",{string:a.toString()});
//     })
// });

app.listen(app.get('port'),()=>{console.log('run',app.get('port'))});