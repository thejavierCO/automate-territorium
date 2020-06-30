const api = require("./territorio");
const cheerio = require("cheerio");
const { html2json:tojson , json2html:tohtml } = require("html2json");
const { Router } = require("express");
const app = Router();

const test = false;

const tr = test!==false?
(new api("https://webhook.site/8fe70860-9770-41f4-8b13-89815c9e0852"))
:(new api("https://conalep.territorio.la/"));

let getTags = (tag="",json={})=>{
    let result = [];
    let $ = cheerio.load(tohtml(json)),position = $(tag);
    $(tag).map((a)=>{
        let r = {
            href:position.attr("href"),
            keys:position.attr("class"),
            test:position.text()
        };
        if(($.length-1)!==a)position = position.next()
        result.push(r);
    })
    return result;
}

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
    .then(({data})=>tojson(data("html").html()))
    .then(e=>{
        if(e["child"][1]["tag"] === "body"){
            return e["child"][1]["child"];
        }else{
            throw {error:"require body"}
        }
    })
    .then(e=>{
        if(typeof e === "object"&& e.length){
            let result = (e.filter((a,b)=>a["attr"]?true:b["attr"]?true:false)).map(({node,tag,attr,child})=>{
                let att = attr?attr.id:false;
                return {
                    type:(att).slice(
                        0,
                        ((att).indexOf("[")===-1?((att).indexOf("_")===-1?0:(att).indexOf("_")):(att).indexOf("["))),
                    id:+((att).slice(
                        ((att).indexOf("[")===-1?((att).indexOf("_")===-1?0:(att).indexOf("_")):(att).indexOf("["))+1,
                        ((att).indexOf("[")===-1?((att).indexOf("_")===-1?0:(att).length):(att).length-1))),
                    data:(child.filter(({tag},b)=>tag==="div"?true:false)).map(({child})=>{
                        return (child.filter(({tag},b)=>tag==="div"?true:false).map(e=>{
                            let $ = cheerio.load(tohtml(e));
                            if($("a").length!==0){
                                return {
                                    type:"a",
                                    href:$("a").attr("href"),
                                    content:$.html(),
                                    get:getTags("a",e).filter(e=>e["href"]?true:false)
                                };
                            }else{
                                return e;
                            }
                        }));
                    })
                }
            })
            return result.filter(({type})=>type==="post");
        }
        res.json(e);
    })
    .then(e=>{
        res.json(e)
    })
    .catch(e=>{res.json({error:e.toString()})})
})

module.exports = app;