console.log('Lets write javascript');
    
let card=document.getElementsByName("")
//All the folders
let folders= []
//Current songs
let songs=[]
//All the songs
let allsongs=[]
//Current song names
let songsname=[]
//Current folder
let currentfolder;
//Current song 
let currentSong=new Audio()
//Getting the play button of playbar
let play=document.querySelector(".playsvg")
//Getting the previous button in playbar
let previous=document.querySelector(".pre")
//Getting the next button of playbar
let next=document.querySelector(".next")
//Getting the section in playbar to show the name of current song
let name=document.querySelector(".songname")
//Getting a section in playbar to show duration and current time 
let time=document.querySelector(".time")
// //Getting the box of seekbar to move the seekbar
let fixed=document.querySelector(".fixed")
// //Getting the index of current song
// let currentIndex = -1
//Getting the volume svg
let volsvg=document.querySelector(".volsvg")
//Getting the volume input
let Volumeinput=document.querySelector(".volume")
Volumeinput.value=50
fixed.value=0
//Getting the search bar
let search=document.getElementById("searchInput")
//To show search results
let results=document.querySelector(".result")





// Function to get the correct index of the current song
function getCurrentSongIndex() {
    if (songs.length==0) {
    return allsongs.indexOf(currentSong.src)
    } else {
    return songs.indexOf(currentSong.src)
    }
}

function playsong(song) {
    currentSong.src=song
    currentSong.play()
    play.src="/img/svgs/pause.svg"
        href=currentSong.src.split("/songs/")[1].replaceAll("-", " ").replace(".mp", "").replace(/[0-9]/g, "").replace("/"," ")
        name.innerHTML=href
}


async function getfolders() {
    let pic;
    //Getting folders which are inside the songs folder
    let a=await fetch("/songs/")
    let response=await a.text()
    let div=document.createElement("div")
    div.innerHTML=response
    let as=div.getElementsByTagName("a")
    for (let index = 0; index < as.length; index++) {
        const e = as[index];
        if (e.href.includes("songs")) {
            folders.push(e.href)
        }
        
    }

    //Getting the information about folder
    for (let index = 0; index < folders.length; index++) {
        pic;
        const element = folders[index];
        let c=await fetch(`${element}`)
        let d=await c.text()
        let f=document.createElement("div")
        f.innerHTML=d
        let g=f.getElementsByTagName("a")
        for (let ico = 0; ico < g.length; ico++) {
            const u = g[ico];
            if (u.href.endsWith(".mp3")) {
                allsongs.push(u.href)
            }
            if(u.href.includes("cover")){
             pic=u.href   
            }
        }
        let b = await fetch(`${element}/info.json`)
        let obj = await b.json(); 

    let data=element.split("/")

            let a=obj.in
            if (a=="artist") {
                type="circle"
            }
            else{
                type="normal"
            }
            let first=document.querySelector(".artists")
            let second=document.querySelector(".albums")
            let third=document.querySelector(".radio")
            let fourth=document.querySelector(".charts")
            let fifth=document.querySelector(".bed")
            let html=`<div onclick="getSongs('${data[4]}')" class="card">
                                <img class="${type}" src="${pic}" alt="">
                                <div class="textouter">
                                <div class="color bold">${obj.title}</div>
                                <div class="color opacity under">${obj.description}</div>
                                <div class="ofpic flex">
                                    <img class="inpic" src="img/svgs/inpic.svg" alt="">
                                    </div>
                    </div>`
            if (a=="artist") {
                first.insertAdjacentHTML("beforeend",html)
            }
            else if(a=="album"){
                second.insertAdjacentHTML("beforeend",html)           
            }
            else if(a=="radio"){
                third.insertAdjacentHTML("beforeend",html)
            }
            else if(a=="chart"){
                fourth.insertAdjacentHTML("beforeend",html)
            }
            else if(a=="bed"){
                fifth.insertAdjacentHTML("beforeend",html)
            }
        }
        
    }


async function getSongs(folder){
    document.querySelector("ul").innerHTML=""
    songsname=[]
    currentfolder=folder
    let a=await fetch(`/songs/${folder}/`)
    let response=await a.text()
    let div=document.createElement("div")
    div.innerHTML=response
    let divs=div.getElementsByTagName("a")
    songs=[]
    for (let i = 0; i < divs.length; i++) {
        const e = divs[i];
            if (e.href.endsWith(".mp3")) {
            songs.push(e.href)
            let song=e.href 
               songsname.push(e.href.split("/songs/")[1].replaceAll("-", " ").replace(".mp", "").replace(/[0-9]/g, "").replace("/"," "))
               let v=e.href.split("/songs/")[1].replaceAll("-", " ").replace(".mp", "").replace(/[0-9]/g, "").replace("/"," ")
               let html = `
               <li onclick="playsong('${song}')">
                <div  class="invert">
                    <img src="img/svgs/music.svg" alt="music">
                    <div class="info">
                        <div>${v}</div>
                        <div>Harry</div>
                    </div>
                </div>
                <img class="invert" src="img/svgs/play.svg" alt="play">
            </li>`;  
               
               document.querySelector("ul").insertAdjacentHTML("beforeend", html);  
            }
        }
}


async function main() {
    await getfolders()
    currentSong.src=allsongs[0]
    //Setting te by default name
    href=currentSong.src.split("/songs/")[1].replaceAll("-", " ").replace(".mp", "").replace(/[0-9]/g, "").replace("/"," ")
    name.innerHTML=href
    currentSong.addEventListener("loadedmetadata",()=>{
        //By default showing the time
        time.innerHTML=`00:00/${secondsToMinutesSeconds(currentSong.duration)}`
    })
}
main()

//Attacching eveent listner to play , pause
play.addEventListener("click",()=>{
    if (currentSong.paused) {
        currentSong.play()
        play.src="/img/svgs/pause.svg"
    }else{
        currentSong.pause()
        play.src="/img/svgs/play.svg"
    }
})

// Previous button event listener
previous.addEventListener("click", () => {
    currentIndex = getCurrentSongIndex();
    
    if (songs.length === 0){
        let prevIndex=(currentIndex - 1 + allsongs.length)% allsongs.length
        playsong(allsongs[prevIndex]);
        currentSong.play()
    }else{
        let prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        playsong(songs[prevIndex]);
        currentSong.play()
    }
});

// Next button event listener
next.addEventListener("click", () => {
    currentIndex = getCurrentSongIndex();
    
    if (songs.length === 0){
        let nextIndex = (currentIndex + 1) % allsongs.length;
        playsong(allsongs[nextIndex]);
        currentSong.play()
    }else{
        let nextIndex = (currentIndex + 1) % songs.length;
        playsong(songs[nextIndex]);
        currentSong.play()
    }
});

//Showing time in playbar
currentSong.addEventListener("timeupdate",()=>{

    time.innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    if (currentSong.currentTime==0) {
        fixed.value=0
    } else {  
        fixed.value=(currentSong.currentTime/currentSong.duration)*100
    }
    if (currentSong.duration==currentSong.currentTime) {
        play.src="/img/svgs/play.svg"
    }
    if (currentSong.paused) {
        play.src="/img/svgs/play.svg"
    }else{
        play.src="/img/svgs/pause.svg"
    }
    
})

// Seek when user changes range input
fixed.addEventListener("input", () => {
    currentSong.currentTime = (fixed.value / 100) * currentSong.duration;
});


//Fuction to convert current in te format of 00:00
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

Volumeinput.addEventListener("input",()=>{
    currentSong.volume=Volumeinput.value / 100
    if (Volumeinput.value==0) {
        volsvg.src="/img/svgs/mute.svg"
    } else{
        volsvg.src="/img/svgs/volume.svg"
    }
})

volsvg.addEventListener("click",()=>{
    if (volsvg.src.includes("volume.svg")) {
        volsvg.src="/img/svgs/mute.svg"
        Volumeinput.value=0
        currentSong.volume=Volumeinput.value
    } else {
        volsvg.src="/img/svgs/volume.svg"
        Volumeinput.value=10
        currentSong.volume=Volumeinput.value/100
    }
})

search.addEventListener("keydown", (event) => {
    let input = search.value 
    input=input.trim().replaceAll(/\s+/g,'').toLowerCase()

    if (event.key === "Enter") {  
        newnow(input);
    }
});


document.querySelector(".browse").addEventListener("click", () => {
    let input = search.value 
    input=input.trim().replaceAll(/\s+/g,'').toLowerCase()
    newnow(input);
});


let number=0
//function to get live update
search.addEventListener("input", () => {
    let input =search.value
    input=input.trim().replaceAll(/\s+/g,'').toLowerCase()
    number=input.length
    if (number==0) {
        results.innerHTML=""
    }else if(number>2){
        newnow(input)
    }
});


let pic;
async function newnow(input) {   
        results.innerHTML=""
        let a=await fetch("/songs/")
        let response=await a.text()
        let div=document.createElement("div")
        div.innerHTML=response
        let as=div.getElementsByTagName("a")
        let data=[]
        for (let i = 0; i < as.length; i++) {
            const e = as[i]; 
            if (e.href.includes("songs")) {
                data.push(e.href)
            }
        }
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let forpic=await fetch(element) 
            let pics=await forpic.text()
            let div=document.createElement("div")
            div.innerHTML=pics
           let as= div.getElementsByTagName("a")
           
           for (let img = 0; img < as.length; img++) {
            const is = as[img];
            if (is.href.includes("cover")) {
                pic=is.href
            }
           }
            

            let b=await fetch(`${element}/info.json`)
            let obj=await b.json()
            let title=obj.title
            let description=obj.description
            description=description.trim().replaceAll(/\s+/g,'').toLowerCase()
            title=title.trim().replaceAll(/\s+/g,'').toLowerCase()
            if ((title.includes(input) && !document.querySelector(`[data-title="${title}"]`))|| (description.includes(input) && !document.querySelector(`[data-title="${title}"]`))) {
                let forsongs=element.split("/")
                let html=`<div onclick="getSongs('${forsongs[4]}')" class="card" data-title="${title}">
                <img class="normal" src="${pic}" alt="">
                <div class="textouter">
                <div class="color bold">${obj.title}</div>
                <div class="color opacity under">${obj.description}</div>
                <div class="ofpic flex">
                <img class="inpic" src="img/svgs/inpic.svg" alt="">
                </div>
                </div>`
                results.insertAdjacentHTML("afterbegin",html)
                
            }
        }
        if (number==0) {
            results.innerHTML=""
        }
    }


document.querySelector(".sidesvg").addEventListener("click",()=>{
    document.querySelector(".aside").style.left=0
})

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".aside").style.left = "-70%"
})


document.querySelector(".searchimg").addEventListener("click",()=>{
    if(document.querySelector(".search-container .ofinput").style.width=="250px"){
        document.querySelector(".search-container .ofinput").style.width="0px"
    }else{
        document.querySelector(".search-container .ofinput").style.width="250px"
    }
})

document.querySelectorAll(".put").forEach(e => {
    e.innerHTML="Show all"
    e.addEventListener("click",()=>{
        let a=e.dataset.folder
        let b=e.dataset.name
        if (b=="less") {
            e.innerHTML="Show less"
            e.dataset.name="all"
            document.querySelector(`.${a}`).style.height= "max-content";
        } else {
            e.innerHTML="Show all"
            e.dataset.name="less"
            document.querySelector(`.${a}`).style.height= "220px";
        }
        
     })
});

