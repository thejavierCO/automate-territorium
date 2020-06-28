const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();
const cheerio = require('cheerio');
// const urlencode = require("urlencode");
// const urldecode = require("urldecode");

const getSI = (type="")=>
type==="auth"?
    ((user,password,login="Iniciar%20Sesi%C3%B3n",email="")=>"MyUserName="+user+"&MyPassWord="+password+"&LogIn="+login+"&email="+email)
:type==="setPost"?
    ((data,folder={},path,path_names,enriquecido=0)=>"proceso=hacerPost&contenido="+data+"&carpeta="+folder+"&path="+path+"&path_names="+path_names+"&enriquecido="+enriquecido)
:type==="getPosts"?
    ((categoria=0,indice=0)=>"proceso=posts&categoria="+categoria+"&indice="+indice)
:"";

class api{
    constructor(url){this.url = url;}
    call = (method="",{url=this.url,path="/",params=""},cookie=cookieJar)=>axios[method](
            url+path,
            params,
            {jar:cookie,
            withCredentials: true}
        )
    .then(({data,headers})=>({
        data: cheerio.load(data),
        headers,
        cookie,
        router:{url,path}}
    ))
    test = async (user,pass,cookie)=>{
        if(user&&pass&&cookie){
            let authJar = new tough.CookieJar();
            if(typeof cookie === "object" && cookie.length){
                cookie.map(e=>authJar.setCookie(e,this.url))
            }
            return this.call("post",{params:getSI("auth")(user,pass)},authJar);
        }else{
            return this.call("get",{}).then(({headers})=>headers["set-cookie"]?headers["set-cookie"]:[]);
        }
    }
}

module.exports = api;