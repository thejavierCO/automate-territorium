const api = require("./territorum");
const morgan = require("morgan");
const engine = require("ejs-mate");
const express = require("express");
let tr = new api("https://conalep.territorio.la/");
let app = express();
app.engine("ejs",engine);
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(morgan("dev"));
app.set('port',process.env.PORT||8080)

// app.get("/token/:user/:pass",({params},res,next)=>{
//     tr.auth(params.user,params.pass).then(({cookie})=>{
//         res.json(cookie);
//     })
// })

// app.post("/posts",({body:{cookie={}}},res,next)=>{
//     tr.getPosts({c:0,i:20},cookie).then(e=>{
//         console.log(e.cookie)
//         res.send(e.data);
//     })
// })

app.get("/",(req,res,next)=>{
    res.json({});
})

app.listen(app.get('port'),()=>{console.log('run',app.get('port'))})