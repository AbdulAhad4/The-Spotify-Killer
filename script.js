// global variables are here
var currentSong = new Audio();

// AI written functions are here
function secondsToMMSS(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60); // Round the remaining seconds

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// All the essential functions are here
async function getData() {
    let a = await fetch("./songs/");
    let response = await a.text();
    return response;
}

async function getHref() {
    let songsHrefs = [];
    let div = document.createElement("div");
    div.innerHTML = await getData();
    let as = div.getElementsByTagName("a");
    for (const a of as) {
        if (a.href.endsWith(".mp3")) {
            songsHrefs.push(a.href);
        }
    }
    return songsHrefs
}

async function getName() {
    let songNames = [];
    let div = document.createElement("div");
    div.innerHTML = await getData();
    let as = div.getElementsByTagName("a");
    for (const a of as) {
        if (a.title.endsWith(".mp3")) {
            let name = a.title.replace(".mp3", "");
            songNames.push(name);
        }
    }
    return songNames;
}

function playMusic(path, pause = false) {
    currentSong.src = path;
    if (!pause) {
        currentSong.src = "/songs/" + path;
        currentSong.play()
        document.querySelector(".while-play-songName").innerHTML = path.replace(".mp3", "");
        play.src = "/media/svgs/songPause.svg";
    }

    else {
        document.querySelector(".while-play-songName").innerHTML = path.replace("http://127.0.0.1:5500/songs/", "").replace("%20", " ").replace(".mp3", "");
    }
}

async function showName() {
    let songNames = await getName();
    for (const song of songNames) {
        const [songName, artist] = song.split("-", 2);
        let songList = document.body.querySelector(".song-list");
        songList.innerHTML = songList.innerHTML +
            `
            <li class="flex">
            <img src="media/svgs/tune.svg" class="music-icon" alt="music">
            <div class="song-info">
                <div class="name">${songName}</div>
                <div class="artist">${artist}</div>
            </div>
            <div class="playNow">
                <span>Play now</span>
                <img src="media/svgs/play.svg" alt="">
            </div>
            </li>
        `;

    }
    // the code below is making it possible to play the songs
    let songsLI = document.querySelector(".song-list").getElementsByTagName("li");
    Array.from(songsLI).forEach(element => {
        element.addEventListener("click", () => {
            playMusic(element.querySelector(".song-info").firstElementChild.innerHTML + "-" + element.querySelector(".artist").innerHTML + ".mp3");
        }
        )
    });

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "/media/svgs/songPause.svg"
        } else {
            currentSong.pause();
            play.src = "/media/svgs/playSong.svg"
        }
    }
    )
}

async function main() {
    currentSong.addEventListener("timeupdate", () => {
        let status = document.querySelector(".status");
        let currentTime = secondsToMMSS(currentSong.currentTime);
        let duration = secondsToMMSS(currentSong.duration);
        document.querySelector(".while-play-duration").innerHTML = `${currentTime}/${duration}`;
        let left = (currentSong.currentTime / currentSong.duration) * 100;
        status.style.left = left + "%";
    })
    let link = await getHref()
    playMusic(link[0], true)

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".status").style.left = persent + "%";
        currentSong.currentTime = (currentSong.duration * persent) / 100;
    }
    )

    // adding the functionality of menu icon
    document.querySelector(".menu").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "0%";
    }
    )

    document.querySelector(".cross").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "-150%";
    }
    )

    // EVENT LISTENER TO PREVIOUS
    previous.addEventListener("click", () => {
        currentSong.currentTime = 0;
        previousSong();
    }
    ) 

    // EVENT LISTENER TO PREVIOUS
    next.addEventListener("click", () => {
        nextSong();
    }
    )
    
    //  EVENT LISTENER TO VOLUME SEEKBAR
    volume.addEventListener("change", (e) => {
      let level = parseInt(e.target.value) / 100; 
      console.log(level);
      currentSong.volume = level;
    }
    )
}

async function nextSong() {
    let songs = await getName();
    let playingSong = document.querySelector(".while-play-songName").innerHTML;
    let index = songs.indexOf(playingSong);
    if ((index+1) < (songs.length)) {
        let songAddress = `${songs[index+1]}.mp3`
        playMusic(songAddress);
    } else {
        playMusic(`${songs[0]}.mp3`);
    }
}

async function previousSong() {
    let songs = await getName();
    let playingSong = document.querySelector(".while-play-songName").innerHTML;
    let index = songs.indexOf(playingSong);
    if ((index-1) >= 0) {
        let songAddress = `${songs[index-1]}.mp3`
        playMusic(songAddress);
    } else {
        playMusic(`${songs[songs.length-1]}.mp3`);
    }
}

main();
showName();