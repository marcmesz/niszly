const searchChar = "ly"
const resultsContainer = document.querySelector(".results-container")
const results = document.querySelector(".results")
const resultsWordCount = document.querySelector(".results-wordcount")
const form = document.getElementById("url-form")
const inputField = document.getElementById("url")
const specifiedUrl = document.getElementById("specified-url")
const spinner = document.querySelector(".img-holder")
const connect = new XMLHttpRequest()

let wordsIncludeLy = []
let resultsDiv = ""
let resultCount = 0

form.addEventListener("submit",(e)=>{
    e.preventDefault()

    const formData = new FormData(form)
    const url = formData.get("url")
    inputField.value=""
    resetVariables()
    if(url){
        spinner.style.display="flex"
        connect.open("GET","https://corsanywhere.herokuapp.com/"+url,true)
        connect.responseType="document"
        connect.onload = ()=>{
            if(connect.readyState==4 && connect.status==200){
                let response = connect.responseXML.body

                spinner.style.display="none"
                const IGNORE = ["style", "script", "noscript"];
                const walker = document.createTreeWalker(response, NodeFilter.SHOW_TEXT);
                const pairs = [];
                const includesLy = [];
                let node;

                while ((node = walker.nextNode()) !== null) {
                    const parent = node.parentNode.tagName;
                    if (IGNORE.includes(parent)) {
                        continue;
                    }
                    const value = node.nodeValue.trim();
                    if (value.length === 0) {
                        continue;
                    }     

                    pairs.push([parent.toLowerCase(), value]);                        
                    
                }


                pairs.forEach(item=>{
                    if(item[0]!=="script" && item[0]!=="style" && item[0]!=="iframe" && item[0]!=="noscript" && item[1].includes(searchChar)){
                        includesLy.push(item[1])
                    }
                })

                includesLy.forEach(item=>{
                    const words = item.split(" ")
                    words.forEach(word=>{
                        if(word.includes(searchChar)){
                            wordsIncludeLy.push(word)
                        }
                    })
                    resultCount=wordsIncludeLy.length
                })
                specifiedUrl.innerText=url
                resultsWordCount.innerText=resultCount+" words"
                wordsIncludeLy.forEach(item=>resultsDiv+=`<div class="result">${item}</div>`)
                results.innerHTML+=resultsDiv
                resultsContainer.style.display="block"
            }
        }
        connect.onerror = ()=>{
            spinner.style.display="none"
            console.error(connect.status, connect.statusText)
            alert("Error: the following link does not support crawling: \n"+url)
        }
        connect.send()
    }
    else{
        alert("Please enter a valid URL")
    }
})

function resetVariables(){
    resultsContainer.style.display="none"
    wordsIncludeLy = []
    results.innerHTML=""
    resultsDiv = ""
    resultCount = 0
}


