const url1 = "https://istyle.hu/blog/megszuletett-az-m1-chip"
const url = "https://webjazz.hu"

const connect = new XMLHttpRequest()

connect.open("GET","https://corsanywhere.herokuapp.com/"+url,true)
connect.responseType="document"
connect.onload = ()=>{
    if(connect.readyState==4 && connect.status==200){
        let response = connect.responseXML.body
        let current = textNodesUnder(response)[792].data
        if(current.includes("más")){
            console.log(current)
            console.log("más")
        }
    }
}

connect.onerror = ()=>{
    console.error(connect.status, connect.statusText)
}

connect.send()

function textNodesUnder(el){
    var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()) a.push(n);
    return a;
  }