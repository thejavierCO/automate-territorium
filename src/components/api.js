const api = require("./territorio");
const cheerio = require("cheerio");
const { html2json:tojson , json2html:tohtml } = require("html2json");
const { Router } = require("express");
const e = require("express");
const app = Router();

const type = false;

const tr = type!==false?
(new api("https://webhook.site/8fe70860-9770-41f4-8b13-89815c9e0852"))
:(new api("https://conalep.territorio.la/"));

let getdata = (html)=>{
    let gettags = test(html,"div|p|a|small|input|button|text")
    let result = extract(gettags,["a","div","input","small","text"]
    // ,({name,data})=>{
    //     switch(name){
    //         case "a":
    //             console.log(data)
    //             let { attr:{href}, child } = data;
    //             data = href.split("perfil.php?").filter(e=>e===""||e==="#"?false:true);
    //             data = data.map(e=>{
    //                 e = e.split("=")
    //                 e = e.length>1?e:(e[0])
    //                 .split("javascript")
    //                 .filter(e=>e===""||e==="#"?false:true)
    //                 .map(e=>e.slice(e.indexOf(":")+1,e.indexOf(";")))
    //                 let dt = {};
    //                 if(e.length===2){
    //                     dt["id"] = +e[1]?+e[1]:e[1];
    //                     if(child.length === 1){
    //                         child.map((a)=>{
    //                             dt["dt"] = a.text?a.text.join(" "):a;
    //                         });
    //                     }else{
    //                         dt["dt"] = a;
    //                     }
    //                     return dt;
    //                 }else{
    //                     dt = {
    //                         f:e,
    //                         dt:child.map((a)=>a.text?a.text.join(" "):a)
    //                     }
    //                     return dt;
    //                 }
    //             })
    //             return data;
    //         break;
    //         case "div":
    //             let {} = data;
    //             // console.log(data.length)
    //         break;
    //     }
    // }
    )
    return result;
}

let extract = (json,tags,f)=>{
    if(typeof json === "object"&&json.length){
        let result = [];
        json.map((a)=>{
            let {child,tag:name} = a;
            tags.map(e=>{
                if(e===name){
                    if(child&&typeof child === "object"){
                        extract(child,tags,f);
                    }
                    result.push(f?f({name,data:a}):{name,data:a});
                }
            })
        })
        return result;
    }else if(typeof json !== "object"){
        throw "error_check_extract"
    }
}
let test = (a,b)=>a.filter(({tag,text})=>{
    let result;
    let tags = b.split("|");
    for (let i = 0; i < tags.length; i++) {
        if(tags[i]===tag)result = true;
    }
    if(text){
        let result = [];
        text = text.replace(/(\n)/g,"")
        text.split(" ").map(e=>{
            if(e!==""){
                result.push(e);
            }
        })
        if(result.length!==0){
            return true
        }else{
            return false
        }
    }
    if(typeof result!== undefined){
        return true;
    }
    return false;
}).map(e=>{
    let {child,text} = e
    if(child){
        child = test(child,"div|p|a|small|input|button|text");
        e["child"] = child;
        return e;
    }else if(text){
        let result = [];
        text = text.replace(/(\n)/g,"")
        text.split(" ").map(e=>{
            if(e!==""){
                result.push(e);
            }
        })
        if(result.length!==0){
            e["text"] = result;
        }else{
            e["text"] = "";
        }
        return e;
    }else{
        return e;
    }
})

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
    .then(({data,headers})=>{
        if(data("body").find("div").length!==0){
            return tojson(data("html").html())
        }else{
            throw "not login"
        }
    })
    .then(({child:tags})=>{
        let {tag,child} = tags[1];
        if(tag === "body"){
            return child;
        }else{
            throw "require body"
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
    // .then(e=>{
    //     res.json(e)
    // })
    .then(e=>res.json({
        status:true,
        data:e
    }))
    .catch(e=>{
        console.log(e);
        res.json({
            status:false,
            error:e.toString()})
    })
})

module.exports = app;