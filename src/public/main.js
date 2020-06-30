let getSession = ()=>fetch("/api/getSession")
    .then(e=>e.json())
    .then(e=>{
        if(typeof e === "object"&&e.length){
            sessionStorage.setItem("LoginData",JSON.stringify(e));
            return {
                status:true,
                data:e,
                log:"success"
            }
        }else{
            throw {
                status:false,
                data:e,
                error:"require object list"
            }
        }
    })

let setLogin = (user,pass,cookies)=>fetch("/api/getAuth",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({user,pass,cookies})
    })
    .then(e=>e.json())
    .then(e=>{
        let token = JSON.parse(sessionStorage.getItem("LoginData"));
        if(typeof e === "object"&&e.length){
            if(e.length === 1){
                token[1] = e[0];
                sessionStorage.setItem("LoginData",JSON.stringify(token))
                return {
                    status:true,
                    data:token,
                    log:"success"
                };
            }else{
                sessionStorage.setItem("LoginData",JSON.stringify(e));
                throw {
                    status:false,
                    data:e,
                    error:"not login"
                }
            }
        }else{
            throw {
                status:false,
                data:e,
                error:"require object list"
            }
        }
    })

document.addEventListener("DOMContentLoaded",()=>{
    let token = JSON.parse(sessionStorage.getItem("LoginData"));
    let login = document.querySelector("#login");
    let user = document.querySelector("#user");
    let pass = document.querySelector("#pass");
    login.addEventListener("submit",(a)=>{
        a.preventDefault();
        setLogin(user.value,pass.value,token)
        .then(e=>{
            console.log(e);
        })
        .catch(e=>{
            console.warn(e);
        })
    })
})