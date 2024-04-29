let currentSong = new Audio();
let songs;

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

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track;
    if(!pause){
        currentSong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    // Get all the songs
    songs = await getSongs();
    playMusic(songs[0], true)

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                           <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div> 
                                <div>Harry</div>
                            </div>
                            <div class="playNow">
                                <span>Play now</span> 
                                <img class="invert" src="play.svg" alt=""> 
                            </div></li>`;
    }

    // Attach an events to all the songs
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })

    })

    // Attach events to next, play and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "play.svg";
        }
    })

    // Attaching eventListener to timeUpdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / 
                                                         ${secondsToMinutesSeconds(currentSong.duration)}` 
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100+"%";
    })

    // Attaching event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
       document.querySelector(".circle").style.left = percent + "%";
       currentSong.currentTime = (currentSong.duration) * percent /100;
    })


    //Adding eventListener to hamburger
document.querySelector(".hamburger").addEventListener("click", ()=>{
document.querySelector(".left").style.left = "0";
})

// Adding eventListener to close button
document.querySelector(".close").addEventListener("click", ()=>{
document.querySelector(".left").style.left = "-130%";
})

// Adding eventListener to previous button
previous.addEventListener("click", ()=>{

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // console.log(index);
     if((index-1) >= 0){
         playMusic(songs[index-1]);
     }
})
// Adding eventListener to next button
next.addEventListener("click", ()=>{

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // console.log(index);
    if((index+1) < songs.length){
        playMusic(songs[index+1]);
    }
    // console.log(songs); shows all the songs inside the folder as an array
})

// Adding eventListener to the volume 
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) =>{
    // console.log(e.target.value);
    currentSong.volume = parseInt(e.target.value)/100;
})
}

main();