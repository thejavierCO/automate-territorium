const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const api = require("./components/territorio")
const app = express();

const tr = new api("http://localhost:3000");

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan("dev"));
app.engine("ejs",require("ejs-mate"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port',process.env.PORT||3000);

app.use("/files",express.static(__dirname+"/public"));

app.use("/",({body:{cookie=[]},headers},res,next)=>{
    console.log(cookie,headers);
    res.render("main",{string:tr.test({
        "play":"ijaosjd"
    })});
});

app.listen(app.get('port'),()=>{console.log('run',app.get('port'))});