const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan("dev"));
app.engine("ejs",require("ejs-mate"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port',process.env.PORT||3000);

app.use("/files",express.static(__dirname+"/public"));

app.use("/api",require("./components/api"));

app.use("/",require("./components/page"));

app.listen(app.get('port'),()=>{console.log('run',app.get('port'))});