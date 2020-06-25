const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');axiosCookieJarSupport(axios);
const {CookieJar,Cookie} = tough;
const cookieJar = new CookieJar;
const cheerio = require('cheerio');

class api{
    constructor(url){
        this.url = url;
        this.db = {};
    }
    site = (method="GET",params,cookie=cookieJar,path="/")=>method==="GET"?
    axios.get(this.url+path,{jar:cookie,withCredentials: true})
    .then(e=>{e.auth = cookie;e.$ = cheerio.load(e.data);return e;})
    .catch(a=>{console.log(a);return a;})
    :
    axios.post(this.url+path,params,{jar:cookie,withCredentials: true})
    .then(e=>{e.auth = cookie;e.$ = cheerio.load(e.data);return e;})
    .catch(a=>{console.log(a);return a;})
    getcookieToken = _=>this.site("GET","").then(a=>a.auth);
    auth(user,password){
        let Text = "MyUserName="+user+"&MyPassWord="+password+"&LogIn=Iniciar%20Sesi%C3%B3n&email=";
        if(this.db[user]){
            let cookie = this.db[user];
            return this.site("POST",Text,cookie).then(e=>{
                this.db[user] = e.auth;
                e.search = cheerio.load(e.data);
                return e;
            })
        }else{
            return this.getcookieToken().then(e=>{this.db[user] = e.auth;return e;})
            .then(e=>this.site("POST",Text,e))
            .then(e=>{
                this.db[user] = e.auth;
                e.search = cheerio.load(e.data);
                return e;
            })
        }
    }
    post_action = async (user,data)=>{
        let params = "proceso=hacerPost&contenido="+data+"&carpeta={}&path=&path_names=&enriquecido=0";
        if(this.db[user]){
            return await this.site("POST",params,this.db[user],"/post_actions.php")
        }else{
            throw {error:"require user"}
        }
    }
    action = (type,user,params)=>new Promise((rej,res)=>{})
}

class apitest{
    exist = false;
    constructor(url){
        this.call("get",{url})
        .then(({router:{url,path}})=>{this.exist = true;this.url = url+path;});
    }
    call = (method,{url,path="/",params},cookie=cookieJar)=>axios[method](this.url?this.url:url+path,params,{jar:cookie,withCredentials: true})
    .then(({data,headers})=>({data: cheerio.load(data),headers,cookie,router:{url,path}}))
    .catch(a=>{this.exist = false;a.url = url;return a;})
    getSI = (type)=>type==="auth"?
    ((user,password,login="Iniciar%20Sesi%C3%B3n",email)=>"MyUserName="+user+"&MyPassWord="+password+"&LogIn="+login+"&email="+email)
    :type==="setPost"?
    ((data,folder={},path,path_names,enriquecido=0)=>"proceso=hacerPost&contenido="+data+"&carpeta="+folder+"&path="+path+"&path_names="+path_names+"&enriquecido="+enriquecido)
    :type==="getPosts"?
    ((categoria=0,indice=0)=>"proceso=posts&categoria="+categoria+"&indice="+indice)
    :"";
    auth = (user,pass)=>this.call("post",{path:"/post_actions.php",params:(this.getSI("auth"))(user,pass)})
    .then(({url,data,cookie})=>{this.exist = true;return {url,data,cookie,text:data.text()}});
    getPosts = ({c,i},cookie)=>this.call("post",{path:"/post_actions.php",params:(this.getSI("getPosts"))(c,i)},cookie)
    .then(({url,data,cookie})=>{this.exist = true;return {url,data,cookie}});
}

module.exports = apitest;
