const gameArea = document.getElementById('gameArea');
const plane = document.getElementById('plane');
const gameWidth = gameArea.clientWidth;
const gameHeight = gameArea.clientHeight;
const planeSpeed = 20; // Lentsikan liikkumisnopeus
const scoreDisplay = document.querySelector("#score span");
const lostJumperDisplay = document.querySelector("#lostJumper span")
const startBtn = document.querySelector("#start");
let planePosition = gameWidth / 2 - plane.clientWidth / 2;
let score = 0;
let lostJumper = 0;
let gameRunning = false;

// Lentsikan liikkuminen. Tämä oli todella hankala vaihe kun ensin lentokone tahtoi aina ylittää pelialueen reunoilta.
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && planePosition > 0) {
        planePosition -= planeSpeed;
        if (planePosition < 0) {
            planePosition = 0;
        }
    } else if (event.key === 'ArrowRight' && planePosition < gameWidth - plane.clientWidth) {
        planePosition += planeSpeed;
        if (planePosition > gameWidth - plane.clientWidth) {
            planePosition = gameWidth - plane.clientWidth;
        }
    }
    plane.style.left = `${planePosition}px`;
});

function startGame() {    
    score = 0;     
    lostJumper = 0; 
    scoreDisplay.innerHTML = score;
    lostJumperDisplay.innerHTML = lostJumper;

    planePosition = gameWidth / 2 - plane.clientWidth / 2;
    plane.style.left = `${planePosition}px`;
    
    gameRunning = true;  
    startBtn.style.display = 'none'; // Piilotetaan Start-painike pelin ajaksi
    gameLoop(); 
}

function gameLoop() {
    if (lostJumper == 5) {
        endGame();
        return;    
    } 
    createJumper();

    setTimeout(gameLoop, 1000 + Math.random() * 1000); // Hyppääjien ilmestyminen randomisti 1-2 sekunnin välein
} 
/* En meinannut millään saada peliä loppumaan, monenlaista mallia ja kysymystä piti netin syövereistä kaivella ja tutkia
ennen kuin tämän sai jonkinlaiselle mallille. Tai kyllä minä alunperin helpomminkin sain pelin loppumaan, mutta sitten oli ongelmia
saada uusi peli alkamaan ja startti nappi toimimaan oikein kun pukkasi aina entisten laskuvarjohyppääjien sekaan
uudet hyppääjät :) Piti sitten käyttääkin vähän enemmän aikaa (=päivä tolkulla) ja käyttää "tyhjennä pelikenttä" funktiota yms. 
 */

function endGame() {   
    alert(`GAME OVER! You have lost five skydivers. Your score: ${score}`);
    gameRunning = false;
    startBtn.style.display = 'inline';       
    clearGameArea();   
}

function clearGameArea() {
    const jumpers = gameArea.getElementsByClassName('jumper');
    while (jumpers.length > 0) {
        jumpers[0].parentNode.removeChild(jumpers[0]);
    }   
}   

// Hyppääjien luonti
function createJumper() {    
    const jumper = document.createElement('img');
    jumper.src = '/parachute.jpg';
    jumper.className = 'jumper';
    jumper.style.left = `${Math.random() * (gameWidth - 30)}px`; // Luonti satunnaiseen paikkaan
    gameArea.appendChild(jumper);
    
    // Hyppääjien putoaminen
    let jumperTop = 0;
    const fallSpeed = 2 + Math.random() * 2.5; // Satunnainen putoamisnopeus

    function fall() {
        if (!gameRunning) return;
        
        jumperTop += fallSpeed;
        jumper.style.top = `${jumperTop}px`;

    // Hyppääjä saadaan lentsikkaan    
        if (jumperTop > gameHeight - plane.clientHeight - 30 && 
            jumperTop < gameHeight - plane.clientHeight &&
            parseInt(jumper.style.left) + 30 > planePosition &&
            parseInt(jumper.style.left) < planePosition + plane.clientWidth) {
   
            gameArea.removeChild(jumper);
            scoreDisplay.innerHTML = ++score; 

    // Hyppääjä menetetään "mustaan aukkoon"        
        } else if (jumperTop > gameHeight) {        
            gameArea.removeChild(jumper);    
            lostJumperDisplay.innerHTML = ++lostJumper;                
            
        } else {            
            requestAnimationFrame(fall);
        }  
     
}
fall();
}
// Pelin aloitus
startBtn.addEventListener('click', startGame)