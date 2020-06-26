const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');axiosCookieJarSupport(axios);
const {CookieJar,Cookie} = tough;
const cookieJar = new CookieJar;
const cheerio = require('cheerio');
const urlcode = require("form-urlencoded");

class api{
    constructor(url){this.url = url;}
    call = (method="",{url=this.url,path="/",params=""},cookie=cookieJar)=>axios[method](
            url+path,params,{
            jar:cookie,
            withCredentials: true
        })
    .then(({data,headers})=>({
        data: cheerio.load(data),
        headers,
        cookie,
        router:{url,path}}
    ))
    .catch(a=>{
        a.url = url;
        return a;
    })
    getSession = ()=>this.call("get").then(({cookie})=>cookie);
    getAuth = (params)=>this.call("post",{},urlcode(params))
    test = (params)=>urlcode(params);
}

module.exports = api;