const axios = require('axios');
const {parse:getcookie} = require("set-cookie-parser");

const setcookie = (cookie)=>{
    if(typeof cookie === "object"&&!cookie.length){
        let result = "";
        Object.keys(cookie).map(a=>{
            result += a==="name"?(cookie[a]+"="):(a==="value"?(cookie[a]+";"):(a+"="+cookie[a]+";"));
        })
        return result;
    }else{
        return false;
    }
}

const getToken = (url)=>axios.get(url)
.then(({data,headers})=>({headers,data,url}))
.then(({headers,data,url})=>{
    let result = {
        "Content-Type":"application/x-www-form-urlencoded",
        "cookie":[]
    };
    headers["set-cookie"].map(a=>{
        if((getcookie(a))[0].name !== "CSRF_TOKEN"){
            result["cookie"].push(a);
        }
    })
    return {cookie:result,url};
})

const auth = (headers="",data="",url="/")=>axios({
    method:"POST",url,headers,data
}).then(({data,headers:cabeceras})=>{
    console.log(headers,cabeceras);
    return {data,cabeceras,headers}
})

getToken("https://conalep.territorio.la/")
.then(({cookie,url})=>auth(cookie,"MyUserName=jcruz2817%40nl.conalep.edu.mx&MyPassWord=Conalep296&LogIn=Iniciar%20Sesi%C3%B3n&email=",url))
.then(e=>{
    console.log(e.data,e.headers,e.cabeceras)
}).catch(e=>{
    console.log(e)
})