const api = require("./territorio");
const cheerio = require("cheerio");
const { html2json:tojson , json2html:tohtml } = require("html2json");
const { Router } = require("express");
const e = require("express");
const app = Router();

const test = false;

const tr = test!==false?
(new api("https://webhook.site/8fe70860-9770-41f4-8b13-89815c9e0852"))
:(new api("https://conalep.territorio.la/"));

let getdata = (html)=>{
    let test = (a,b)=>a.filter(e=>{
        let tags = b.split("|");
        
        // continua por aqui
        // e.tag==="div"?true:(
        //     e.tag==="p"?true:(
        //         e.tag==="a"?true:(
        //             e.tag==="small"?true:(
        //                 e.tag==="input"?true:(
        //                     e.tag==="button"?true:(
        //                         e.tag==="input"?true:(
        //                             e.node==="text"?(true):false
        //                         )
        //                     )
        //                 )
        //             )
        //         )
        //     )
        // )
    }
    )
    .map(e=>{
        let {child,text} = e
        if(child){
            child = test(child);
            e["child"] = child;
            return e;
        }else if(text){
            e["text"] = text.replace(/( )/g,"");
            return e;
        }else{
            return e;
        }
    })
    return test(html,"div|p|a|small|input|button|text")
    .map(e=>{
        return tohtml(e);
    });
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
                    data:getdata(child)
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