const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const api = require("./components/territorio")
const app = express();

const tr = new api("https://webhook.site/14c57275-41f3-42d7-b98e-6e3bb00fca14");

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan("dev"));
app.engine("ejs",require("ejs-mate"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port',process.env.PORT||3000);

app.use("/files",express.static(__dirname+"/public"));

app.use("/",({body:{user="",pass=""},headers},res,next)=>{
    tr.test()
    .then(e=>tr.test("test@test.com","init296",e))
    .then(e=>{
        console.log(e);
        res.render("main",{string:"user:"+user+";pass:"+pass});
    })
    .catch(a=>{
        console.log(a);
        res.render("main",{string:a.toString()});
    })
});

app.listen(app.get('port'),()=>{console.log('run',app.get('port'))});