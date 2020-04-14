let canvas;
let ctx;
let ships = [];
let numShipsA = [];
let numShipsB = [];
let selected;
let selectedPlane;
let playingAsTeam = 0;
let team = ["Team A","Team B"];
selectedTeam = 0;
let scale = 0.6;
let offsetX = 0;
let offsetY = 0;
let cWidth;
let cHeight;
let cameraLock = true;
let isFiringManually = false;
let helpEnabled = false;
let hudEnabled = true;
let gridEnabled = true;
let isPaused = false;
let intervalID;
let startTime;
let playMusic = false;
let muteSound = false;

function toggleMusic(){
    playMusic = playMusic ? false : true;
}

let [AAGunSound, TorpedoHitSound, GunSound, HitSound] = [new Audio(), new Audio(), new Audio(), new Audio()];

AAGunSound.src = "audio/AAGunSound.mp3";
TorpedoHitSound.src = "audio/TorpedoHitSound.mp3";
GunSound.src = "audio/GunSound.mp3";
HitSound.src = "audio/HitSound.mp3";

let music = new Audio();

let musicLib = ["music/mkaliez.mp3", "music/midway.mp3"];

function setMusic(){
    music.src = musicLib[Math.floor(Math.random()*(musicLib.length))];
    music.volume = 0.4;
}

music.onended = () => {
    setMusic();
    music.play();
}

let [carrierIMG, battleshipIMG] = [new Image(), new Image()];

let [akagiIMG,  kagaIMG, hiryuIMG, soryuIMG, enterpriseIMG, hornetIMG, yorktownIMG, yamatoIMG, iowaIMG, bismarckIMG, hoodIMG] = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];

let [a6m2IMG, b5n2IMG, d3a1IMG, f4fIMG, sbdIMG, tbfIMG] = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];

carrierIMG.src = "icons/carrier.png";
battleshipIMG.src = "icons/battleship.png";

akagiIMG.src = "carriers/akagi.png";
enterpriseIMG.src = "carriers/enterprise.png";
hornetIMG.src = "carriers/hornet.png";
yorktownIMG.src = "carriers/yorktown.png";
kagaIMG.src = "carriers/kaga.png";
hiryuIMG.src = "carriers/hiryu.png";
soryuIMG.src = "carriers/soryu.png";
yamatoIMG.src = "battleships/yamato.png";
iowaIMG.src = "battleships/iowa.png";
bismarckIMG.src = "battleships/bismarck.png";
hoodIMG.src = "battleships/hood.png";

a6m2IMG.src = "planes/a6m2.png";
b5n2IMG.src = "planes/b5n2.png";
d3a1IMG.src = "planes/d3a1.png";
f4fIMG.src = "planes/f4f.png";
sbdIMG.src = "planes/sbd.png";
tbfIMG.src = "planes/tbf.png";

let fireIMG = new Image();
fireIMG.src = "fire_temp.png";

// let akagi = 
// let kaga =   
let shipTypes = [
    {autofire:true, range:2500, team:undefined, name:"Yamato",     nation:"Japan",                    type:"Battleship",       hp:97000, maxHP:97000, x:100,  y:100, beam:38.9, length:256,   maxSpeed:0.9,  speed:0, speedSetting:0, image:yamatoIMG,     rotation:0,  guns:[{number:1, x:50,y:0, calibre:460,reloadTime:1400,damage:7500, timeSinceReload:0},{number:2, x:50,y:7.5, calibre:460,reloadTime:1400,damage:7500, timeSinceReload:0},{number:3, x:50,y:15, calibre:460,reloadTime:1400,damage:7500, timeSinceReload:0},{number:4, x:40,y:0, calibre:460,reloadTime:1400,damage:7500, timeSinceReload:0}, {number:5, x:40,y:7.5, calibre:460,reloadTime:1400,damage:7500, timeSinceReload:0},{number:6, x:40,y:15, calibre:460,reloadTime:1400,  damage:7500, timeSinceReload:0},{number:7, x:10,y:0, calibre:460,reloadTime:1400,damage:7500, timeSinceReload:0},{number:8, x:10,y:7.5, calibre:460,reloadTime:1400,damage:7500, timeSinceReload:0},{number:9, x:10,y:15, calibre:460,reloadTime:1400,damage:7500, timeSinceReload:0}], projectiles:30},
    {autofire:true, range:2500, team:undefined, name:"Iowa",       nation:"United States",            type:"Battleship",       hp:92000, maxHP:92000, x:100,  y:100, beam:33,   length:262,   maxSpeed:1.1,  speed:0, speedSetting:0, image:iowaIMG,       rotation:0,  guns:[{number:1, x:50,y:0, calibre:406,reloadTime:1000,damage:6000, timeSinceReload:0},{number:2, x:50,y:7.5, calibre:406,reloadTime:1000,damage:6000, timeSinceReload:0},{number:3, x:50,y:15, calibre:406,reloadTime:1000,damage:6000, timeSinceReload:0},{number:4, x:40,y:0, calibre:406,reloadTime:1000,damage:6000, timeSinceReload:0}, {number:5, x:40,y:7.5, calibre:406,reloadTime:1000,damage:6000, timeSinceReload:0},{number:6, x:40,y:15, calibre:406,reloadTime:1000,  damage:6000, timeSinceReload:0},{number:7, x:10,y:0, calibre:406,reloadTime:1000,damage:8000, timeSinceReload:0},{number:8, x:10,y:7.5, calibre:406,reloadTime:1000,damage:6000, timeSinceReload:0},{number:9, x:10,y:15, calibre:406,reloadTime:1000,damage:6000, timeSinceReload:0}], projectiles:30},
    {autofire:true, range:2500, team:undefined, name:"Bismarck",   nation:"Germany",                  type:"Battleship",       hp:80000, maxHP:80000, x:100,  y:100, beam:36,   length:241.6, maxSpeed:1,    speed:0, speedSetting:0, image:bismarckIMG,   rotation:0,  guns:[{number:1, x:50,y:0, calibre:380,reloadTime:900,damage:5000, timeSinceReload:0},{number:2, x:50,y:15, calibre:380, reloadTime:900,damage:5000, timeSinceReload:0}, {number:3, x:40,y:0, calibre:380,reloadTime:900,damage:5000, timeSinceReload:0}, {number:4, x:40,y:15, calibre:380,reloadTime:900,damage:5000, timeSinceReload:0},{number:5, x:20,y:0,  calibre:380,reloadTime:900,damage:5000, timeSinceReload:0},  {number:6, x:20,y:15, calibre:380,reloadTime:900,damage:5000, timeSinceReload:0},{number:7, x:10,y:0, calibre:380,reloadTime:900,damage:5000, timeSinceReload:0},{number:8, x:10,y:15, calibre:380,reloadTime:900,damage:5000, timeSinceReload:0}], projectiles:30},
    {autofire:true, range:2500, team:undefined, name:"Hood",       nation:"Great Britain",            type:"Battleship",       hp:80000, maxHP:80000, x:100,  y:100, beam:31.8, length:262.3, maxSpeed:1.06, speed:0, speedSetting:0, image:hoodIMG,       rotation:0,  guns:[{number:1, x:50,y:0, calibre:381,reloadTime:900,damage:5000, timeSinceReload:0},{number:2, x:50,y:15, calibre:381, reloadTime:900,damage:5000, timeSinceReload:0}, {number:3, x:40,y:0, calibre:381,reloadTime:900,damage:5000, timeSinceReload:0}, {number:4, x:40,y:15, calibre:381,reloadTime:900,damage:5000, timeSinceReload:0},{number:5, x:20,y:0,  calibre:381,reloadTime:900,damage:5000, timeSinceReload:0},  {number:6, x:20,y:15, calibre:381,reloadTime:900,damage:5000, timeSinceReload:0},{number:7, x:10,y:0, calibre:381,reloadTime:900,damage:5000, timeSinceReload:0},{number:8, x:10,y:15, calibre:381,reloadTime:900,damage:5000, timeSinceReload:0}], projectiles:30},     
    {autofire:true, deckIsFree: true, launchTimeDuration:200, launchTime:0, team:undefined, name:"Akagi",      nation:"Japan",         range:4000, type:"Aircraft Carrier", hp:52000, maxHP:52000, x:100,  y:100, beam:31.3, length:260.7, maxSpeed:1.06, speed:0, speedSetting:0, image:akagiIMG,      rotation:0, squadrons:[{status:"Hangar", name: "A6M2 'Zero-sen'", type:"Fighter", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:a6m2IMG, reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"D3A1 'Val'",      type:"Dive Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:d3a1IMG,  reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"B5N2 'Kate'",      type:"Torpedo Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:b5n2IMG,  reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"B5N2 'Kate'",      type:"Torpedo Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:b5n2IMG,  reloadTime:1000, timeSinceReload:0}], projectiles:30},
    {autofire:true, deckIsFree: true, launchTimeDuration:200, launchTime:0, team:undefined, name:"Kaga",       nation:"Japan",         range:4000, type:"Aircraft Carrier", hp:56000, maxHP:56000, x:1000, y:100, beam:30, length:225, maxSpeed:1.15, speed:0, speedSetting:0, image:kagaIMG,       rotation:0, squadrons:[{status:"Hangar", name: "A6M2 'Zero-sen'", type:"Fighter", x:0, y:0, speed:4, rotation:0,     hp:3000, range:4000, number:15, maxNumber:15, image:a6m2IMG, reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"D3A1 'Val'",      type:"Dive Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:d3a1IMG,  reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"B5N2 'Kate'",      type:"Torpedo Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:b5n2IMG,  reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"B5N2 'Kate'",      type:"Torpedo Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:b5n2IMG,  reloadTime:1000, timeSinceReload:0}], projectiles:30},
    {autofire:true, deckIsFree: true, launchTimeDuration:200, launchTime:0, team:undefined, name:"Hiryuu",     nation:"Japan",         range:4000, type:"Aircraft Carrier", hp:44000, maxHP:44000, x:1000, y:300, beam:30, length:225, maxSpeed:1.15, speed:0, speedSetting:0, image:hiryuIMG,      rotation:0, squadrons:[{status:"Hangar", name: "A6M2 'Zero-sen'", type:"Fighter", x:0, y:0, speed:4, rotation:0,     hp:3000, range:4000, number:15, maxNumber:15, image:a6m2IMG, reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"D3A1 'Val'",      type:"Dive Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:d3a1IMG,  reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"B5N2 'Kate'",      type:"Torpedo Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:b5n2IMG,  reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"B5N2 'Kate'",      type:"Torpedo Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:b5n2IMG,  reloadTime:1000, timeSinceReload:0}], projectiles:30},
    {autofire:true, deckIsFree: true, launchTimeDuration:200, launchTime:0, team:undefined, name:"Soryuu",     nation:"Japan",         range:4000, type:"Aircraft Carrier", hp:44000, maxHP:44000, x:1000, y:300, beam:30, length:225, maxSpeed:1.15, speed:0, speedSetting:0, image:soryuIMG,      rotation:0, squadrons:[{status:"Hangar", name: "A6M2 'Zero-sen'", type:"Fighter", x:0, y:0, speed:4, rotation:0,     hp:3000, range:4000, number:15, maxNumber:15, image:a6m2IMG, reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"D3A1 'Val'",      type:"Dive Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:d3a1IMG,  reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"B5N2 'Kate'",      type:"Torpedo Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:b5n2IMG,  reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"B5N2 'Kate'",      type:"Torpedo Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:b5n2IMG,  reloadTime:1000, timeSinceReload:0}], projectiles:30},
    {autofire:true, deckIsFree: true, launchTimeDuration:200, launchTime:0, team:undefined, name:"Enterprise", nation:"United States", range:4000, type:"Aircraft Carrier", hp:50000, maxHP:50000, x:1000, y:300, beam:30, length:225, maxSpeed:1.15, speed:0, speedSetting:0, image:enterpriseIMG, rotation:0, squadrons:[{status:"Hangar", name: "F4F-4 'Wildcat'", type:"Fighter", x:0, y:0, speed:4, rotation:0,     hp:3000, range:4000, number:15, maxNumber:15, image:f4fIMG, reloadTime:1000, timeSinceReload:0},  {status:"Hangar", name:"SBD 'Dauntless'", type:"Dive Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:sbdIMG,   reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"SBD 'Dauntless'", type:"Dive Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:sbdIMG,   reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"TBF 'Devastator'", type:"Torpedo Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:tbfIMG,   reloadTime:1000, timeSinceReload:0}], projectiles:30},
    {autofire:true, deckIsFree: true, launchTimeDuration:200, launchTime:0, team:undefined, name:"Hornet",     nation:"United States", range:4000, type:"Aircraft Carrier", hp:50000, maxHP:50000, x:1000, y:300, beam:30, length:225, maxSpeed:1.15, speed:0, speedSetting:0, image:hornetIMG,     rotation:0, squadrons:[{status:"Hangar", name: "F4F-4 'Wildcat'", type:"Fighter", x:0, y:0, speed:4, rotation:0,     hp:3000, range:4000, number:15, maxNumber:15, image:f4fIMG, reloadTime:1000, timeSinceReload:0},  {status:"Hangar", name:"SBD 'Dauntless'", type:"Dive Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:sbdIMG,   reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"SBD 'Dauntless'", type:"Dive Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:sbdIMG,   reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"TBF 'Devastator'", type:"Torpedo Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:tbfIMG,   reloadTime:1000, timeSinceReload:0}], projectiles:30},
    {autofire:true, deckIsFree: true, launchTimeDuration:200, launchTime:0, team:undefined, name:"Yorktown",   nation:"United States", range:4000, type:"Aircraft Carrier", hp:50000, maxHP:50000, x:1000, y:300, beam:30, length:225, maxSpeed:1.15, speed:0, speedSetting:0, image:yorktownIMG,   rotation:0, squadrons:[{status:"Hangar", name: "F4F-4 'Wildcat'", type:"Fighter", x:0, y:0, speed:4, rotation:0,     hp:3000, range:4000, number:15, maxNumber:15, image:f4fIMG, reloadTime:1000, timeSinceReload:0},  {status:"Hangar", name:"SBD 'Dauntless'", type:"Dive Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:sbdIMG,   reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"SBD 'Dauntless'", type:"Dive Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:sbdIMG,   reloadTime:1000, timeSinceReload:0}, {status:"Hangar", name:"TBF 'Devastator'", type:"Torpedo Bomber", x:0, y:0, speed:4, rotation:0, hp:3000, range:4000, number:15, maxNumber:15, image:tbfIMG,   reloadTime:1000, timeSinceReload:0}], projectiles:30}
];

let scenarios = [
    {name:"Hood vs Bimarck",teamNames:["Royal Navy", "Kriegsmarine"],ships:[{name:"Hood",team:0},{name:"Bismarck",team:1}]},
    {name:"Iowa vs Yamato",teamNames:["US Navy","Imperial Japanese Navy"],ships:[{name:"Iowa",team:0},{name:"Yamato",team:1}]},
    {name:"The Carriers at Midway",teamNames:["US Navy","Imperial Japanese Navy"],ships:[{name:"Enterprise",team:0},{name:"Hornet",team:0},{name:"Yorktown",team:0},{name:"Akagi",team:1},{name:"Kaga",team:1},{name:"Hiryuu",team:1},{name:"Soryuu",team:1}]}
];

let stats = [];

function projectiles(x){
    let projectiles = [];
    for(let i = 0; i < x; i++){
        let projectile = {
            visible:false,
            x: 0,
            y: 0,
            rotation: 0,
            speed:8,
            distance: 0,
            calibre:0,
            damage:0
        }
        projectiles.push(projectile);
    }
    return projectiles;
}

document.addEventListener("DOMContentLoaded", setup, false);

function setup(){
    document.getElementById('playMusic').checked = false;

    document.getElementById('teamAName').value = team[0];
    document.getElementById('teamBName').value = team[1];

    document.getElementById('teamAName').addEventListener("change",()=>teamNameChange(0),false);
    document.getElementById('teamBName').addEventListener("change",()=>teamNameChange(1),false);

    let ul = {"Scenarios":document.querySelector('#scenarios .shipList'),"Aircraft Carrier":document.querySelector('#carriers .shipList'),"Battleship":document.querySelector('#battleships .shipList'),"Cruiser":document.querySelector('#cruisers .shipList'),"Destroyer":document.querySelector('#destroyers .shipList')};
    for(let i of shipTypes){
        let li = document.createElement('li');
        li.innerHTML = i.name;
        li.setAttribute(`onclick`,`addShip("${i.name}");`);
        ul[i.type].appendChild(li);
    }
    for(let i of scenarios){
        let li = document.createElement('li');
        li.innerHTML = i.name;
        li.setAttribute(`onclick`,`scenario("${i.name}")`);
        ul["Scenarios"].appendChild(li);
    }
}

function addShip(shipName, scenarioTeam){
    console.log("Added",shipName, "to battle");
    console.log("TEAM", scenarioTeam)
    let teamElement;
    if(scenarioTeam){
        if(scenarioTeam === 0){
            teamElement = document.querySelector("#teamA");
        }
        else{
            teamElement = document.querySelector("#teamB");
        }
    }
    else{
        if(selectedTeam === 0){
            teamElement = document.querySelector("#teamA");
        }
        else{
            teamElement = document.querySelector("#teamB");
        }
    }
    let sTeam = (scenarioTeam ? scenarioTeam : selectedTeam);
    let li = document.createElement('li');
    li.innerHTML = shipName;
    li.setAttribute(`onclick`,`removeShipFromLists("${shipName}", ${sTeam})`);
    teamElement.appendChild(li);
    let ship = shipTypes.find(x => x.name === shipName);
    let a;
    if(ship.type === "Aircraft Carrier"){
        a = {auto:true, randomTime:Math.floor(Math.random()*2000), plannedRotation:undefined, autofire:ship.autofire, deckIsFree:ship.deckIsFree, launchTime:ship.launchTime, launchTimeDuration:ship.launchTimeDuration, range:ship.range, team:sTeam, name:ship.name, nation:ship.nation, type:ship.type, hp:ship.hp, maxHP: ship.maxHP, x:0, y:0, beam:ship.beam, length:ship.length, maxSpeed: ship.maxSpeed, speedSetting:0, speed:0, image:ship.image, rotation:0, squadrons:loopThroughPlanes(ship.squadrons), projectiles:projectiles(ship.projectiles)}
    }
    else a = {auto:true, randomTime:Math.floor(Math.random()*2000), plannedRotation:undefined, idealFiringDistance:[500,2000], autofire:ship.autofire, range:ship.range, team:sTeam, name:ship.name, nation:ship.nation, type:ship.type, hp:ship.hp, maxHP: ship.maxHP, x:0, y:0, beam:ship.beam, length:ship.length, maxSpeed: ship.maxSpeed, speedSetting:0, speed:0, image:ship.image, rotation:0, guns:loopThrough(ship.guns), projectiles:projectiles(ship.projectiles)}
    ships.push(a);
    console.log(a);
}

function removeShipFromLists(shipName, team){
    for(let z = 0; z < ships.length; z++){
        if(ships[z].name === shipName && ships[z].team === team){
            let _temp = [];
            for(let p = 0; p < z; p++){
                _temp.push(ships[p]);
            }
            for(let p = z+1; p < ships.length; p++){
                _temp.push(ships[p]);
            }
            ships = _temp;
        }
    }
    if(team === 0) teamElement = document.querySelector("#teamA");
    else teamElement = document.querySelector("#teamB");
    for(let a of teamElement.children){
        if(a.innerHTML === shipName){
            a.remove();
        }
    }
}

function loopThroughPlanes(squadrons){
    let finishedPlanes = [];
    let i = 0;
    while(i < squadrons.length){
        let squadron = {status:squadrons[i].status, name:squadrons[i].name, type:squadrons[i].type, x:0, y:0, speed:squadrons[i].speed, rotation:0, munitions:squadrons[i].number, hp:squadrons[i].hp, range:squadrons[i].range, number:squadrons[i].number, maxNumber:squadrons[i].maxNumber, image: squadrons[i].image, reloadTime:squadrons[i].reloadTime, timeSinceReload:squadrons[i].timeSinceReload, waypoint:{x:0,y:0}}
        finishedPlanes.push(squadron);
        i++;
    }
    return finishedPlanes;
}

function loopThrough(guns){
    let finishedWeps = [];
    let i = 0;
    while(i < guns.length){
        let gun = {number:guns[i].number, x:guns[i].x, y:guns[i].y, calibre:guns[i].calibre, damage:guns[i].damage, reloadTime:guns[i].reloadTime, timeSinceReload:guns[i].timeSinceReload};
        finishedWeps.push(gun);
        i++;
    }
    return finishedWeps;
}

function switchTeam(){
    selectedTeam = selectedTeam === 0 ? 1 : 0;
    document.getElementById('switchTeam').innerHTML = team[selectedTeam];
}

function switchTeamPlayingAs(){
    playingAsTeam = playingAsTeam === 0 ? 1 : 0;
    document.getElementById('switchTeamPlayingAs').innerHTML = `Playing as ${team[playingAsTeam]}`;
}   

function teamNameChange(i){
    if(i === 0){
        team[0] = document.querySelector('#teamAName').value;
    }
    else{
        team[1] = document.querySelector('#teamBName').value;
    }
}

function scenario(name){
    let scen = scenarios.find(x => x.name === name);
    [team[0], document.querySelector('#teamAName').value] = [scen.teamNames[0], scen.teamNames[0]];
    [team[1], document.querySelector('#teamBName').value] = [scen.teamNames[1], scen.teamNames[1]];
    ships = [];
    let shipsToDropA = document.querySelectorAll('#teamA li');
    let shipsToDropB = document.querySelectorAll('#teamB li');

    for(let x of shipsToDropA) x.remove();
    for(let x of shipsToDropB) x.remove();

    for(let i of scen.ships) addShip(i.name, i.team);
}

function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    let m =  {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    ctx.font = "14px sans-serif";
    if(isFiringManually && ships[selected].type !== "Aircraft Carrier" && ships[selected].team === playingAsTeam){
        let i = ships[selected];
        for(let a of i.guns){
            if(a.timeSinceReload >= a.reloadTime){
                let posX = Math.sin(i.rotation*(Math.PI/180))*(a.x*2); 
                let posY = Math.cos(i.rotation*(Math.PI/180))*(a.y*2); 
                let [finalY, finalX] = [i.y+posY, i.x+posX]; 
                console.log(m.x,m.y)
                console.log(posX,posY)
                console.log(finalX, finalY)
                let rotation = Math.atan(((m.y+offsetY)-(finalY))/((m.x+offsetX)-(finalX)));
                if(finalX > (m.x+offsetX)) rotation = rotation + Math.PI;
                console.log(rotation)
                let distance = Math.sqrt((finalX-(m.x+offsetX))**2 + (finalY-(m.y+offsetY))**2);

                fire(finalX, finalY, rotation, distance, i.projectiles, a.calibre, a.damage, true);
                a.timeSinceReload = 0;
            }
        }
        isFiringManually = false;
        document.querySelector('canvas').style.cursor = 'default';
    }
    else if(ships[selected].team === playingAsTeam && ships[selected].type !== "Aircraft Carrier" && m.x > 10 && m.x < 110 && m.y > canvas.height - (12*((ships[selected].guns.length+3))) && m.y < canvas.height - (12*((ships[selected].guns.length+3)))+20){
        ships[selected].autofire = ships[selected].autofire ? false : true;
    }
    else if(ships[selected].team === playingAsTeam && ships[selected].type !== "Aircraft Carrier" && m.x > 10 && m.x < 10+ctx.measureText("Auto-steer : Yes").width+2 && m.y > canvas.height - (12*((ships[selected].guns.length+8)))-2 && m.y < canvas.height - (12*((ships[selected].guns.length+8)))+18){
        ships[selected].auto = ships[selected].auto ? false : true;
    }
    else if(ships[selected].team === playingAsTeam && ships[selected].type === "Aircraft Carrier" && m.x > 10 && m.x < 10+ctx.measureText("Auto-steer : Yes").width+2 && m.y > canvas.height - (12*((ships[selected].squadrons.length+8)))-2 && m.y < canvas.height - (12*((ships[selected].squadrons.length+8)))+18){
        ships[selected].auto = ships[selected].auto ? false : true;
    }
    // else if(ships[selected].type === "Aircraft Carrier" && m.x > 10 && m.x < 110 && m.y > canvas.height - (12*((ships[selected].squadrons.length+3))) && m.y < canvas.height - (12*((ships[selected].squadrons.length+3)))+20){
    //     ships[selected].autofire = ships[selected].autofire ? false : true;
    // }
    else if(ships[selected].team === playingAsTeam && ships[selected].type !== "Aircraft Carrier" && m.x > 130 && m.x < 130+ctx.measureText("FIRE").width * 2 && m.y > canvas.height - 75 && m.y < canvas.height-45 && !ships[selected].autofire){
        document.querySelector('canvas').style.cursor = 'url(\'firing_cursor.png\'), auto';
        isFiringManually = true;
    }
    else{
        for(let a of ships){
            if(a.hp > 0){
                let i;
                if(a.team === 0){
                    i = numShipsA.indexOf(a);
                    console.log((canvas.width / 2) - 30*(i+1) + " < "+m.x+" < " + (canvas.width / 2) - 30*(i+1)+20)
                    console.log("5 < "+m.y+" < 10")
                    if(m.x > (canvas.width / 2) - 30*(i+1) && m.x < (canvas.width / 2) - 30*(i+1)+20 && m.y > 0 && m.y < 20){
                        selected = ships.indexOf(a);
                        cameraLock = true;
                        break;
                    }
                }
                else{
                    i = numShipsB.indexOf(a);
                    if(m.x > (canvas.width / 2) + 30*(i+1) && m.x < (canvas.width / 2) +30*(i+1)+20 && m.y > 0 && m.y < 20){
                        selected = ships.indexOf(a);
                        cameraLock = true;
                        break;
                    }
                }
            }
        }

        for(let q of ships){
            console.log(m.x, m.y);
            // if(m.x <= i.x+i.length-offsetX && m.x >= i.x-offsetX && m.y >= i.y-offsetY && m.y <= i.y+i.beam-offsetY){
            //             selected = ships.indexOf(i);
            //             console.log("Selected ship",selected, "name : ", i.name);
            //         }
            let qX1 = q.x - (q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale) < q.x + q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale ? q.x - (q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale) : q.x + q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale;
            let qX2 = q.x - (q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale) > q.x + q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale ? q.x - (q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale) : q.x + q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale;
            let qY1 = q.y - (q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale) < q.y + q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale ? q.y - (q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale) : q.y + q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale;
            let qY2 = q.y - (q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale) > q.y + q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale ? q.y - (q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale) : q.y + q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale;
            if(m.x > qX1-offsetX && m.x < qX2-offsetX && m.y > qY1-offsetY && m.y < qY2-offsetY){
                selected = ships.indexOf(q);
                selectedPlane = undefined;
                console.log("Selected ship",selected, "name : ", q.name);
                // stats.push({text:`${i.name} hits ${q.name}, dealing some damage`,time:Date.now()});
            }
        }
    }
  }

function init(){
    console.log("Initialising...");
    for(let i of ships){
        if(i.team === 0){
            numShipsA.push(i);
        }
        else{
            numShipsB.push(i);
        }
    }
    if(numShipsA.length < 1 || numShipsB.length < 1){
        document.getElementById('warning').style.display = "inline-block";
        console.log("initialisation failed.")
    }
    else{
        startTime = Date.now();
        if(playMusic){
            setMusic();
            music.play();
        } 
        document.getElementById('warning').style.display = "none";
        document.querySelector('video').pause();
        document.querySelector("main").style.display = "none";
        canvas = document.querySelector("canvas");
        canvas.style.display = "block";
        ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cWidth = 4000;
        cHeight = 2000;
        // canvas.style.overflow = "hidden";

        for(let i = 0; i < numShipsA.length; i++){
            numShipsA[i].x = 125;
            numShipsA[i].y = ((cHeight) / (numShipsA.length+1)) *(i+1);
        }   

        for(let i = 0; i < numShipsB.length; i++){
            numShipsB[i].x = cWidth - 125;
            numShipsB[i].y = ((cHeight) / (numShipsB.length+1)) *(i+1);
            numShipsB[i].rotation = 180;
        }   
 
        selected = 0;
        for(let i = 0; i < ships.length; i++){
            if(ships[i].team === playingAsTeam){
                selected = i;
                // offset such that first ship of selected team is in the middle of window
                // offsetX = ships[selected].x - (canvas.width/2);
                // offsetY = ships[selected].y - (canvas.height/ 2);
                // console.log("offsetY", offsetY);
                break;
            }
        }

        document.addEventListener("keydown",(e)=>handleKeyPress(e), false);
        document.addEventListener("click", (e)=>getMousePos(e), false);
        document.addEventListener("dblclick",()=> cameraLock ? cameraLock = false : cameraLock = true);


        document.addEventListener('mousemove', (e)=>scroll(e), false);
        intervalID = window.setInterval(render, 33);

        console.log("Game started.");
    }
}

function scroll(e){
    var rect = canvas.getBoundingClientRect();
    let m =  {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    // console.log(m)

    if(m.x / canvas.width > 0.99 && offsetX+canvas.width< cWidth){ offsetX+=10;}
    else if(m.x / canvas.width < 0.01 && offsetX > 0){ offsetX-=10;}

    if(m.y / canvas.height > 0.99 && offsetY+canvas.height < cHeight){ offsetY+=10;}
    else if(m.y / canvas.height < 0.01 && offsetY > 0){ offsetY-=10;}
}


function render(){

    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#5095F8";
    ctx.fillRect(0,0,canvas.width,canvas.height);


    if(gridEnabled){

    ctx.fillStyle = "red";
    ctx.fillRect(0-offsetX, 0-offsetY, cWidth, 1);
    ctx.fillRect(0-offsetX, 0-offsetY, 1, cHeight);
    ctx.fillRect(cWidth-offsetX, 0-offsetY, 1, cHeight);
    ctx.fillRect(0-offsetX, cHeight-offsetY, cWidth, 1);

        for(let i = 0; i < cWidth / 100; i++){
            ctx.fillStyle = "rgba(255,255,255,0.25)";
            if((i+1) % 4 == 0) ctx.fillStyle = "rgba(0,0,0,0.25)"; 
            ctx.fillRect((100*(i+1))-offsetX, 0-offsetY, 1, cHeight);
        }
        for(let i = 0; i < cHeight / 100; i++){
            ctx.fillStyle = "rgba(255,255,255,0.25)";
            if((i+1) % 4 == 0) ctx.fillStyle = "rgba(0,0,0,0.25)"; 
            ctx.fillRect(0-offsetX, (100*(i+1))-offsetY, cWidth, 1);
        }
    }

    if(hudEnabled){
    ctx.textAlign = "left";
    if(stats.length >= 1){
        let a = 0;
        let i = stats.length-1;
        while(i >= 0){
            a++;
            if((Date.now()-startTime) - stats[i].time > 5000) break;
            ctx.fillStyle = "black"; 
            ctx.font = "16px Arial";
            ctx.fillText(stats[i].text,5,a*20);
            if(a > 7) break;
            i-=1;
        }
    }
    ctx.textAlign = "right";
    ctx.fillStyle = "black"; 
    ctx.font = "bold 18px Arial";
    ctx.fillText(`${team[ships[selected].team]}`, canvas.width-10, 20);
    ctx.font = "16px Arial";
    ctx.fillText(`${ships[selected].name}`, canvas.width-10, 40);
    ctx.fillText(`${ships[selected].type}`, canvas.width-10, 60);
    ctx.fillText(`${ships[selected].hp < 0 ? 0 : ships[selected].hp} / ${ships[selected].maxHP}`, canvas.width-10, 80);
    ctx.fillText(`${Math.round(ships[selected].speed * 300) / 10} knots`, canvas.width-10, 100);
    if(ships[selected].type === "Aircraft Carrier" && selectedPlane !== undefined){
        ctx.fillText(`${ships[selected].squadrons[selectedPlane].name} ${ships[selected].squadrons[selectedPlane].type}`, canvas.width-10, 130);
        ctx.fillText(`${ships[selected].squadrons[selectedPlane].status} at ${Math.round(ships[selected].squadrons[selectedPlane].speed * 300) / 10} knots`, canvas.width-10, 150);
        ctx.fillText(`${ships[selected].squadrons[selectedPlane].number} / ${ships[selected].squadrons[selectedPlane].maxNumber} aircraft`, canvas.width-10, 170);
        ctx.fillText(`${ships[selected].squadrons[selectedPlane].munitions} bombs left`, canvas.width-10, 190);
    }
    }

    if(cameraLock){
        if(!selectedPlane){
            offsetX = ships[selected].x - ((canvas.width / 2));
            // +Math.sin(ships[selected].rotation*(Math.PI/180))*ships[selected].length/2);
            offsetY = ships[selected].y - ((canvas.height / 2));
            // +Math.cos(ships[selected].rotation*(Math.PI/180))*ships[selected].beam/2);
        }
        else{
            offsetX = ships[selected].squadrons[selectedPlane].x - ((canvas.width / 2));
            offsetY = ships[selected].squadrons[selectedPlane].y - ((canvas.height / 2));
        }
    }

    let shipsAlive = [false,false]; // Checking win status
    let particlesInAir = [false,false]; // Checking win status
    for(let i of ships){

        if(i.speed-0.0001 > ((i.maxSpeed*i.speedSetting) / 4)) i.speed-=0.005;
        else if(i.speed+0.0001 < ((i.maxSpeed*i.speedSetting) / 4)) i.speed+=0.005;

        if(i.auto){
            if(i.type !== "Aircraft Carrier" && i.speedSetting !== 4) i.speedSetting = 4;
        }

        // positioning of hp and text
        if(hudEnabled){
        let tY = i.y-20*(Math.abs(Math.cos(i.rotation*(Math.PI/180))));
        let tX = i.x-(i.length/2)*scale;


        if(i.hp > 0){
            ctx.fillStyle = "white";
            ctx.fillRect(tX-offsetX,tY-offsetY,100,8);
            ctx.fillStyle = "limegreen";
            ctx.fillRect(tX-offsetX, tY-offsetY,(i.hp/i.maxHP)*100,8);
        }

        if(ships.indexOf(i) === selected){
            ctx.fillStyle = "#005E0A";
        }
        else if(i.team !== ships[selected].team) ctx.fillStyle = "red";
        else ctx.fillStyle = "black"; 
        
        ctx.font = "16px Arial";
        ctx.textAlign = "left";
        ctx.fillText(i.name,tX-offsetX,tY-(4+offsetY));
        }

        ctx.save();

        ctx.translate(i.x-offsetX, i.y-offsetY);
        ctx.rotate(i.rotation*Math.PI/180);
        ctx.drawImage(i.image,-(i.length*scale/2),-(i.beam*scale/2), i.length*scale, i.beam*scale);

        ctx.restore();

        ctx.save();

        ctx.translate(i.x-offsetX, i.y-offsetY);
        ctx.rotate(i.rotation*Math.PI/180);
        if(i.hp <= 0){
            ctx.drawImage(fireIMG,-(i.length*scale/2),-(i.beam*scale/2), i.length*scale, i.beam*scale);
            i.speedSetting = 0;
        }
        ctx.restore();

        if(i.hp > 0){
            shipsAlive[i.team] = true;
            let eX;
            // let eDistance = i.range;
            let eDistance = 1000000000;
            let eY;
            let eRotation;
            let targetAcquired = false;
            if(i.autofire){
                for(let q of ships){
                    if(q.team !== i.team && q.hp > 0){
                        if(Math.sqrt((i.x-q.x)**2+(i.y-q.y)**2) < eDistance){
                            eDistance = Math.sqrt((i.x-q.x)**2+(i.y-q.y)**2);
                            eX = q.x;
                            eY = q.y;
                            enemySpeed = q.speed;
                            enemyRotation = q.rotation;
                            eBeam = q.beam;
                            eLength = q.length;
                            targetAcquired = true;
                            // console.log("TARGET ACQUIRED")
                        }
                    }
                }
            }
            // ctx.fillText(`Auto-fire : ${_x}`, (canvas.width / 2) - 50, canvas.height - 4)

            if(i.type !== "Aircraft Carrier"){ // If ship is not carrier

                if(i.x < 10 || cWidth - i.x < 10 || i.y < 10 || cHeight - i.y < 10){
                    if(!i.plannedRotation || i.plannedRotation === i.rotation){
                        if(Math.random() < 0.5){
                            i.plannedRotation = i.rotation + 150;
                        }
                        else{
                            i.plannedRotation = i.rotation - 150;
                        }
                    }
                }
                else if(eDistance > i.idealFiringDistance[1]){
                    console.log("firing distance things",Math.atan((eY - i.y) / (eX - i.x)))
                    i.plannedRotation = Math.atan((eY - i.y) / (eX - i.x))*(Math.PI/180);
                    if(eX < i.x) i.plannedRotation += 180;
                    

                }
                else if(eDistance < i.idealFiringDistance[0]){
                    i.plannedRotation = Math.atan((eY - i.y) / (eX - i.x))*(Math.PI/180);
                    let rand = Math.random();
                    rand < 0.5 ? i.plannedRotation += 180 : i.plannedRotation -= 180;
                    if(eX < i.x) i.plannedRotation += 180;
                }
                else{
                    if(i.randomTime > 0){
                        i.randomTime--;
                    }
                    else{
                        i.randomTime = Math.floor(Math.random()*2000);
                        let randomAngle = Math.floor(Math.random()*720);
                        randomAngle = randomAngle < 360 ? randomAngle : 720 - randomAngle;
                        i.plannedRotation = i.rotation+randomAngle;
                    }
                }
                i.plannedRotation = i.plannedRotation < 0 ? i.plannedRotation + 360 : i.plannedRotation;
                i.plannedRotation = i.plannedRotation > 360 ? i.plannedRotation - 360 : i.plannedRotation;

                if(targetAcquired && i.autofire && i.range > eDistance){ // Check if enemy in range and ship is automatically firing

                    // if(Math.abs(eDistance < ))

                    for(let a of i.guns){ 
                        if(a.timeSinceReload >= a.reloadTime){ // If gun has reloaded
                            console.log("a.x, a.y:", a.x, a.y);
                            let posX = Math.sin(i.rotation*(Math.PI/180))*(a.x*2); 
                            let posY = Math.cos(i.rotation*(Math.PI/180))*(a.y*2); 
                            console.log(posX, posY)
                            let [finalY, finalX] = [i.y+posY, i.x+posX];        // Initial position of shell(x,y)
                            eRotation = Math.atan((eY-(finalY))/(eX-(finalX))); // Angle to enemy ship(initial)
                            if(finalX > eX) eRotation = eRotation + Math.PI; // Possible correction to angle
                            eDistance = Math.sqrt((eX-(finalX))**2+(eY-(finalY))**2); // Initial distance from shell to enemy

                            // If enemy ship is on map border
                            if(Math.abs(eX - 0) < 5 || Math.abs(eX - cWidth) < 5 || Math.abs(eY - cHeight) < 5 || Math.abs(eY - 0) < 5){
                                fire(i.x+posX, i.y+posY, eRotation, eDistance, i.projectiles, a.calibre, a.damage);
                                playSound("Ship Gun");
                            }

                            // Fire ahead of the enemy ship taking into account their speed, distance and direction
                            else{
                                timeToCurrentDistance = eDistance / 8; // Time t
                                afterTimeX = eX + (enemySpeed*Math.cos(enemyRotation*(Math.PI/180)) * timeToCurrentDistance); // Enemy x co-ord after t time has passed
                                afterTimeY = eY + (enemySpeed*Math.sin(enemyRotation*(Math.PI/180)) * timeToCurrentDistance); // Enemy y co-ord after t time has passed

                                let enemyDistanceFromInitial = Math.sqrt((eX-afterTimeX)**2 + (eY-afterTimeY)**2); // Enemy distance from where it was initially

                                let epicAngle = Math.atan((afterTimeY-(eY))/(afterTimeX-(eX))); // Angle between initial and final enemy ship positions
                                if(afterTimeX > eX) epicAngle = epicAngle + Math.PI; // Possible correction


                                afterRotation = Math.atan(((afterTimeY)-(finalY))/((afterTimeX)-(finalX))); // Angle between final enemy pos and shell
                                if(finalX > afterTimeX) afterRotation = afterRotation + Math.PI;

                                let epicDistance = Math.sqrt(enemyDistanceFromInitial**2 + eDistance**2 - 2*eDistance*enemyDistanceFromInitial*Math.cos(epicAngle-eRotation))
                                // Application of the formula a^2 = b^2 + c^2 - 2bcCos(A)


                                // afterDistance = Math.sqrt((afterTimeX-(i.x+posX))**2 + (afterTimeY-(i.y+posY))**2);

                                console.log(i.name, i.team, "with coords",finalX,finalY, "firing at enemy ", eX, eY, "angle: ", eRotation, "distance:", eDistance, "enemy speed:", enemySpeed, "enemy rotation:", enemyRotation);
                                fire(i.x+posX, i.y+posY, afterRotation, epicDistance, i.projectiles, a.calibre, a.damage);
                                playSound("Ship Gun");
                            }

                            a.timeSinceReload = 0;
                        }
                    a.timeSinceReload++;
                    }
                }
                else{ // If either a target is not acquired or the ship's guns are being manually fired
                    for(let a of i.guns){
                        if(a.timeSinceReload < a.reloadTime) a.timeSinceReload++;
                        
                    }
                }
            }
        }
        if(i.x+i.speed*Math.cos((i.rotation*Math.PI)/180) > 0 && i.x+i.speed*Math.cos((i.rotation*Math.PI)/180) < cWidth) i.x += i.speed*Math.cos((i.rotation*Math.PI)/180);
        if(i.y + i.speed*Math.sin((i.rotation*Math.PI)/180) > 0 && i.y+i.speed*Math.sin((i.rotation*Math.PI)/180) < cHeight) i.y += i.speed*Math.sin((i.rotation*Math.PI)/180);

        if(i.auto && i.plannedRotation !== i.rotation){
            console.log("Got to checker boi")
            if(Math.abs(i.plannedRotation - i.rotation) < 8){
                console.log("Got to checker boi 1")
                i.rotation = i.plannedRotation;
                i.plannedRotation = undefined;
            } 
            else if(i.plannedRotation < i.rotation){
                console.log("Got to checker boi 2")
            move(ships.indexOf(i), "left");
            }
            else if(i.plannedRotation > i.rotation){
                console.log("Got to checker boi 3")
                move(ships.indexOf(i), "right");
            }
        }

    }
    for(let i of ships){
        if(i.type === "Aircraft Carrier"){
        if(i.autofire){ // Check if enemy in range and ship is automatically firing
            // console.log("target acquired");
            // if(!i.deckIsFree){
            //     let squadron = i.squadrons.find(x => x.status === "Deck");
            //     // launch(squadron);
            //     squadron.status = "Launching";
                
            // }
            for(let j = 0; j < i.squadrons.length; j++){
                if(i.hp > 0){
                    if(i.squadrons[j].timeSinceReload < i.squadrons[j].reloadTime) i.squadrons[j].timeSinceReload++;
                else if(i.deckIsFree && i.squadrons[j].type !== "Fighter" && i.squadrons[j].status === "Hangar"){
                    i.squadrons[j].status = "Deck";
                    i.squadrons[j].munitions = i.squadrons[j].number;
                    i.deckIsFree = false; 
                }

                if(i.squadrons[j].status === "Deck"){
                    for(let a of ships){
                        if(a.hp > 0 && a.team !== i.team && Math.sqrt((i.x-a.x)**2 + (i.y-a.y)**2) < i.squadrons[j].range){
                            i.squadrons[j].status = "Launching";
                        }
                    }
                }
                else if(i.squadrons[j].status === "Launching"){
                    if(i.launchTime < i.launchTimeDuration){
                        i.launchTime++;
                    }
                    else{
                        i.launchTime = 0;
                        i.deckIsFree = true;
                        i.squadrons[j].status = "Flying";
                        i.squadrons[j].rotation = i.rotation * (Math.PI/180);
                        i.squadrons[j].waypoint.x = i.x + 300*Math.cos(i.squadrons[j].rotation);
                        i.squadrons[j].waypoint.y = i.y + 300*Math.sin(i.squadrons[j].rotation);
                        i.squadrons[j].x = i.x;
                        i.squadrons[j].y = i.y;
                    }
                }
                }

                if(i.squadrons[j].status === "Flying"){
                    particlesInAir[i.team] = true;
                    ctx.save();

                    let size = 1;
                    if(i.squadrons[j].waypoint){
                        size = 1 / Math.sqrt((i.squadrons[j].x-i.squadrons[j].waypoint.x)**2 + (i.squadrons[j].y-i.squadrons[j].waypoint.y)**2)**0.1;
                    }

                    ctx.translate((i.squadrons[j].x-offsetX), (i.squadrons[j].y-offsetY));
                    ctx.rotate(i.squadrons[j].rotation);
                    ctx.drawImage(i.squadrons[j].image, -15, -10, 30*size, 20*size);
                    ctx.restore();

                    ctx.save();
                    ctx.translate((i.squadrons[j].x-offsetX)-25, (i.squadrons[j].y-offsetY)-25);
                    ctx.rotate(i.squadrons[j].rotation);
                    if(i.squadrons[j].number > 5) ctx.drawImage(i.squadrons[j].image, -15, -10, 30*size, 20*size);
                    ctx.restore();
                    
                    ctx.save();
                    ctx.translate((i.squadrons[j].x-offsetX)-25, (i.squadrons[j].y-offsetY)+25);
                    ctx.rotate(i.squadrons[j].rotation);
                    if(i.squadrons[j].number > 10) ctx.drawImage(i.squadrons[j].image, -15, -10, 30*size, 20*size);
                    ctx.restore();

                    i.squadrons[j].x += Math.cos(i.squadrons[j].rotation)*i.squadrons[j].speed;
                    i.squadrons[j].y += Math.sin(i.squadrons[j].rotation)*i.squadrons[j].speed;

                    if(i.squadrons[j].waypoint){
                        // i.squadrons[j].rotation = Math.atan(i.squadrons[j].waypoint.y - i.squadrons[j].y / i.squadrons[j].waypoint.x - i.squadrons[j].x);
                        if(Math.abs(i.squadrons[j].y - i.squadrons[j].waypoint.y) < i.squadrons[j].speed && Math.abs(i.squadrons[j].x - i.squadrons[j].waypoint.x) < i.squadrons[j].speed){
                            i.squadrons[j].waypoint = false;
                            }
                    }
                    else if(i.squadrons[j].munitions > 0){
                        // let eDistance = i.squadrons[j].range;
                        let eDistance = 100000;
                        let eRotation;
                        for(let a of ships){
                            if(i.team !== a.team && a.hp > 0){
                                if(Math.sqrt((i.squadrons[j].x-a.x)**2 + (i.squadrons[j].y-a.y)**2) < eDistance){
                                    eDistance = Math.sqrt((i.squadrons[j].x-a.x)**2 + (i.squadrons[j].y-a.y)**2); // Initial distance from shell to enemy
                                    let [eX, eY] = [a.x, a.y];

                                    let [finalY, finalX] = [i.squadrons[j].y, i.squadrons[j].x];        // Initial position of shell(x,y)
                                    eRotation = Math.atan((eY-(finalY))/(eX-(finalX))); // Angle to enemy ship(initial)
                                    // if(finalX > eX) eRotation = eRotation + Math.PI; // Possible correction to angle
                                    // eDistance = Math.sqrt((eX-(finalX))**2+(eY-(finalY))**2); 
        
                                    timeToCurrentDistance = eDistance / i.squadrons[j].speed; // Time t
                                    afterTimeX = eX + (a.speed*Math.cos(a.rotation*Math.PI/180) * timeToCurrentDistance); // Enemy x co-ord after t time has passed
                                    afterTimeY = eY + (a.speed*Math.sin(a.rotation*Math.PI/180) * timeToCurrentDistance); // Enemy y co-ord after t time has passed
        
                                    let enemyDistanceFromInitial = Math.sqrt((eX-afterTimeX)**2 + (eY-afterTimeY)**2); // Enemy distance from where it was initially
        
                                    // let epicAngle = Math.atan((afterTimeY-(eY))/(afterTimeX-(eX))); // Angle between initial and final enemy ship positions
                                    // if(afterTimeX > eX) epicAngle = epicAngle + Math.PI; // Possible correction
        
        
                                    afterRotation = Math.atan(((afterTimeY-Math.cos(a.rotation*(Math.PI/180))*(eBeam/2)*scale)-finalY)/((afterTimeX-Math.sin(a.rotation*(Math.PI/180))*(eLength/2)*scale)-finalX)); // Angle between final enemy pos and shell
                                    // if(finalX > afterTimeX) afterRotation = afterRotation + Math.PI;
        
                                    let epicDistance = Math.sqrt(enemyDistanceFromInitial**2 + eDistance**2 - 2*eDistance*enemyDistanceFromInitial*Math.cos(epicAngle-eRotation))
                                    // Application of the formula a^2 = b^2 + c^2 - 2bcCos(A)

                                    
                                    if(Math.sqrt((eX-i.squadrons[j].x)**2 + (eY-i.squadrons[j].y)**2) < 10){
                                        let munsToDrop = i.squadrons[j].munitions < 5 ? i.squadrons[j].munitions : 5;
                                        for(let z = 0; z < munsToDrop; z++){
                                            fire(i.squadrons[j].x, i.squadrons[j].y, i.squadrons[j].rotation, 10, i.projectiles, 410, 500);
                                            i.squadrons[j].munitions--;
                                        }
                                        let _x = i.squadrons[j].x+(300*Math.cos(i.squadrons[j].rotation));
                                        let _y = i.squadrons[j].y+(300*Math.sin(i.squadrons[j].rotation));
                                        i.squadrons[j].waypoint = {x:_x, y:_y}
                                    }

                                    else if(i.squadrons[j].rotation !== afterRotation){
                                        if(Math.abs(i.squadrons[j].rotation - afterRotation) < (Math.PI/16)){
                                            i.squadrons[j].rotation = afterRotation;
                                        }
                                        else if(i.squadrons[j].rotation < afterRotation) i.squadrons[j].rotation += (Math.PI/32);
                                        else i.squadrons[j].rotation -= (Math.PI/32);
                                        // if(i.squadrons[j].rotation >  afterRotation) 
                                    }
                                }
                            }
                    }
                    }
                    else if(i.squadrons[j].munitions === 0){
                        i.squadrons[j].status = "Hangar";
                        i.squadrons[j].timeSinceReload = 0;
                    }
                }
            }
        }
        else{
            let j = 0;
            while(j < i.squadrons.length){
                if(i.squadrons[j].timeSinceReload < i.squadrons[j].reloadTime) i.squadrons[j].timeSinceReload++;
                else if(i.deckIsFree && i.squadrons[j].status === "Hangar"){
                    i.squadrons[j].status = "Deck";
                    i.deckIsFree = false; 
                }
                // else{
                //------------
                    if(i.squadrons[j].status === "Deck"){
                        i.squadrons[j].status = "Launching";
                    }
                    else if(i.squadrons[j].status === "Launching"){
                        if(i.launchTime < i.launchTimeDuration){
                            i.launchTime += 1;
                        }
                        else{
                            i.launchTime = 0;
                            i.deckIsFree = true;
                            i.squadrons[j].status = "Flying";
                            i.squadrons[j].rotation = i.rotation * (Math.PI/180);
                            i.squadrons[j].waypoint.x = i.x + 300*Math.cos(i.squadrons[j].rotation);
                            i.squadrons[j].waypoint.y = i.y + 300*Math.sin(i.squadrons[j].rotation);
                            i.squadrons[j].x = i.x;
                            i.squadrons[j].y = i.y;
                        }
                    }
                // }

                    if(i.squadrons[j].status === "Flying"){
                        particlesInAir[i.team] = true;
                        ctx.save();

                        ctx.translate(i.squadrons[j].x-offsetX, i.squadrons[j].y-offsetY);
                        ctx.rotate(i.squadrons[j].rotation);
                        ctx.drawImage(i.squadrons[j].image, -15, -20, 30, 40);

                        ctx.restore();


                        i.squadrons[j].x += Math.cos(i.squadrons[j].rotation)*i.squadrons[j].speed;
                        i.squadrons[j].y += Math.sin(i.squadrons[j].rotation)*i.squadrons[j].speed;
                        
                        if(i.squadrons[j].waypoint){
                            if(Math.abs(i.squadrons[j].y - i.squadrons[j].waypoint.y) < i.squadrons[j].speed && Math.abs(i.squadrons[j].x - i.squadrons[j].waypoint.x) < i.squadrons[j].speed){
                                i.squadrons[j].rotation += Math.PI;
                                i.squadrons[j].waypoint = undefined;
                            }
                        }
                    }
                //-------------

                // if(ships.indexOf(i) === selected){
                //     ctx.fillStyle = "rgb(150,255,150)";
                //     if(i.squadrons[j].status === "Deck") ctx.fillStyle = "rgb(200,200,100)"; 
                //     else if(i.squadrons[j].timeSinceReload / i.squadrons[j].reloadTime === 1) ctx.fillStyle = "rgb(40,40,180)"; 
                //     ctx.fillRect(10, canvas.height - (12*((i.squadrons.length+1) - j)), 80*(i.squadrons[j].timeSinceReload / i.squadrons[j].reloadTime), 10);
                    
                //     ctx.fillStyle = "Black";
                //     ctx.font = "10px Arial";
                //     let planeText;
                //     switch(i.squadrons[j].type){
                //         case "Fighter":
                //             planeText = "F";
                //             break;
                //         case "Dive Bomber":
                //             planeText = "DB";
                //             break;
                //         case "Torpedo Bomber":
                //             planeText = "TB";
                //             break;
                //     }
                //     ctx.fillText(planeText, 30, canvas.height - (12*((i.squadrons.length+1) - (j+1)))-2);
                // }
                j++;
            }
        }
    }

    for(let p of i.projectiles){
        if(p.visible === true){
            particlesInAir[i.team] = true;
            if(p.distance > 0){
                ctx.fillStyle = "black";
                ctx.fillRect(p.x-(1+offsetX),p.y-(1+offsetY),2,2);
                p.distance-=8;
                p.x += p.speed*Math.cos(p.rotation);
                p.y += p.speed*Math.sin(p.rotation);
            }
            // else if(p.distance < 2){
            //     for(let q of ships){
            //         if(p.x > q.x && p.x < q.x + q.length*Math.cos(q.rotation*(Math.PI/180))*scale && p.y > q.y && p.y < q.y + q.beam*Math.sin(q.rotation*(Math.PI/180))*scale){
            //             q.hp -= p.damage;
            //             stats.push({text:`${i.name} hits ${q.name}, dealing some damage`,time:Date.now()});
            //         }
            //     }
            //     ctx.fillStyle = "red";
            //     ctx.fillRect(p.x-(7.5+offsetX),p.y-(7.5+offsetY),15,15)
            //     p.visible = false; 
            // }
            else{
                ctx.fillStyle = "red";
                ctx.fillRect(p.x-(7.5+offsetX),p.y-(7.5+offsetY),15,15)
                p.visible = false; 

                for(let q of ships){
                    // if(Math.sqrt((q.x-p.x)**2 + (q.y-p.y)**2) < q.beam*scale){
                    let qX1 = q.x - (q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale) < q.x + q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale ? q.x - (q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale) : q.x + q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale;
                    let qX2 = q.x - (q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale) > q.x + q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale ? q.x - (q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale) : q.x + q.beam + (q.length-q.beam)*Math.cos(q.rotation*(Math.PI/180))*scale;
                    let qY1 = q.y - (q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale) < q.y + q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale ? q.y - (q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale) : q.y + q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale;
                    let qY2 = q.y - (q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale) > q.y + q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale ? q.y - (q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale) : q.y + q.beam + (q.length-q.beam)*Math.sin(q.rotation*(Math.PI/180))*scale;
                    if(p.x > qX1 && p.x < qX2 && p.y > qY1 && p.y < qY2){
                        playSound("Hit");
                        q.hp -= p.damage;
                        stats.push({text:`${i.name} hits ${q.name}, dealing ${p.damage} damage`,time:(Date.now()-startTime)});
                    }
                }
            }
        }
    }

    }
    
    
    if(hudEnabled){
        for(let a of ships){
            if(a.hp > 0){
                let i;
                let icon;
                switch(a.type){
                    case "Aircraft Carrier":
                        icon = carrierIMG;
                        break;
                    case "Battleship":
                        icon = battleshipIMG;
                        break;
                }
                if(a.team === 0){
                    i = numShipsA.indexOf(a);
                    ctx.save();
                    ctx.translate((canvas.width / 2) - 30*(i+1), 5);
                    if(ships[selected] === a) ctx.drawImage(icon, -2.5, -1.25, 25, 12.5);
                    else ctx.drawImage(icon, 0, 0, 20, 10);
                    ctx.restore();
                }
                else{
                    i = numShipsB.indexOf(a);
                    ctx.save();
                    ctx.translate((canvas.width / 2) + 30*(i+1) + 10, 10);
                    ctx.rotate(Math.PI);
                    if(ships[selected] === a) ctx.drawImage(icon, -10, -5, 25, 12.5);
                    else ctx.drawImage(icon, -10, -5, 20, 10);
                    ctx.restore();
                }
            }
        }

        let wpnText;
        let wpnType;
        if(ships[selected].type !== "Aircraft Carrier"){
            wpnText = "Weapons Reload";
            wpnType = ships[selected].guns;
        }
        else{
            wpnText = "Aircraft Preparation Time";
            wpnType = ships[selected].squadrons;
        }
    
        ctx.fillStyle = "Black";
        ctx.font = "16px Arial";
        ctx.fillText(wpnText, 10, canvas.height - (12*((wpnType.length+4))));
        !ships[selected].autofire ? ctx.fillStyle = "lightgray" : ctx.fillStyle = "white";
        ctx.fillRect(10, canvas.height - (12*((wpnType.length+3))), 100, 20);
        ctx.fillStyle = "black";
        ctx.font = "14px sans-serif";
        let _x = ships[selected].autofire ? "Yes" : "No";
        ctx.fillText(`Auto-fire : ${_x}`, 12, canvas.height - (12*((wpnType.length+2))-4));
    
    
        ships[selected].autofire ? ctx.fillStyle = "rgb(81,9,9)" : ctx.fillStyle = "crimson";
        ctx.fillRect(130, canvas.height - 75, ctx.measureText("FIRE").width * 2, 30);
        ctx.fillStyle = "black";
        ctx.font = "20px sans-serif";
        ctx.fillText('FIRE', 130 + ctx.measureText("FIRE").width / 4.5, canvas.height - 52.5);

        !ships[selected].auto ? ctx.fillStyle = "lightgray" : ctx.fillStyle = "white";
        let _y = ships[selected].auto ? "Yes" : "No";
        ctx.font = "14px sans-serif";
        ctx.fillRect(10, canvas.height - (12*((wpnType.length+8)))-2, ctx.measureText("Auto-steer : Yes").width+2, 20);
        ctx.fillStyle = "black";
        ctx.fillText(`Auto-steer : ${_y}`, 12, canvas.height - (12*((wpnType.length+7))));
        // ctx.fillText(`Auto-steer : ${_y}`, 150, canvas.height);

        if(ships[selected].type === "Aircraft Carrier"){
            for(let i = 0; i < ships[selected].squadrons.length; i++){
                ctx.fillStyle = "rgb(150,255,150)";
                if(ships[selected].squadrons[i].status === "Deck") ctx.fillStyle = "rgb(200,200,100)"; 
                else if(ships[selected].squadrons[i].timeSinceReload / ships[selected].squadrons[i].reloadTime === 1 && ships[selected].squadrons[i].status === "Launching") ctx.fillStyle = "rgb(40,40,180)"; 
                else if(ships[selected].squadrons[i].timeSinceReload / ships[selected].squadrons[i].reloadTime === 1 && ships[selected].squadrons[i].status === "Flying") ctx.fillStyle = "rgb(180,40,180)"; 
                ctx.fillRect(10, canvas.height - (12*((ships[selected].squadrons.length+1) - i)), 80*(ships[selected].squadrons[i].timeSinceReload / ships[selected].squadrons[i].reloadTime), 10);
                
                ctx.fillStyle = "Black";
                ctx.font = "10px Arial";
                let planeText;
                switch(ships[selected].squadrons[i].type){
                    case "Fighter":
                        planeText = "F";
                        break;
                    case "Dive Bomber":
                        planeText = "DB";
                        break;
                    case "Torpedo Bomber":
                        planeText = "TB";
                        break;
                }
                ctx.fillText(planeText, 30, canvas.height - (12*((ships[selected].squadrons.length+1) - (i+1)))-2);
            }
        }
        else{
            // Rendering reload time in canvas
            for(let a of ships[selected].guns){
                ctx.fillStyle = "rgb(150,255,150)";
                if(a.timeSinceReload / a.reloadTime === 1) ctx.fillStyle = "rgb(40,40,180)"; 
                ctx.fillRect(10, canvas.height - (12*((ships[selected].guns.length+1) - a.number+1)), 80*(a.timeSinceReload / a.reloadTime), 10);
                }
            }
    }

    // if(!particlesInAir[0] && !particlesInAir[1]){
        if(shipsAlive[0] && !shipsAlive[1] && !particlesInAir[1]){
            // if(!shipsAlive[1]){ // A wins
                pauseFunction();
                document.querySelector('#victoryscreen').style.display = "block";
                document.querySelector('#victoryscreen h1').innerHTML = `The ${team[0]} has won the battle!`
                // let ul = document.querySelector('#victoryscreen ul');
                // for(let x of stats){
                //     let li = document.createElement('li');
                //     li.innerHTML = Math.floor(x.time / 1000) + " seconds : " + x.text;
                //     ul.appendChild(li);
                // }
            }
            // else{
            //     Both still alive
            // }
        // }
        // else{
        if(shipsAlive[1] && !shipsAlive[0] && !particlesInAir[0]){ // B wins
                pauseFunction();
                document.querySelector('#victoryscreen').style.display = "block";
                document.querySelector('#victoryscreen h1').innerHTML = `The ${team[1]} has won the battle!`
                // let ul = document.querySelector('#victoryscreen ul');
                // for(let x of stats){
                //     let li = document.createElement('li');
                //     li.innerHTML = Math.floor(x.time / 1000) + " seconds : " + x.text;
                //     ul.appendChild(li);
                // }
            }
        else if(!(shipsAlive[0] || shipsAlive[1] || particlesInAir[0] || particlesInAir[1])){
                pauseFunction(); // Draw
                document.querySelector('#victoryscreen').style.display = "block";
                document.querySelector('#victoryscreen h1').innerHTML = `The ${team[0]} and ${team[1]} have annihilated each other...`
                // let ul = document.querySelector('#victoryscreen ul');
                // for(let x of stats){
                //     let li = document.createElement('li');
                //     li.innerHTML = Math.floor(x.time / 1000) + " seconds : " + x.text;
                //     ul.appendChild(li);
                // }
            }
        // }
    // }
    // else if(!shipsAlive[0] && !shipsAlive[1]){
        // pauseFunction(); // Draw
                // document.querySelector('#victoryscreen').style.display = "block";
                // document.querySelector('#victoryscreen h1').innerHTML = `The ${team[0]} and ${team[1]} have annihilated each other...`
                // let ul = document.querySelector('#victoryscreen ul');
                // for(let x of stats){
                //     let li = document.createElement('li');
                //     li.innerHTML = Math.floor(x.time / 1000) + " seconds : " + x.text;
                //     ul.appendChild(li);
                // }
    // }
    

    }    

function handleKeyPress(e){
    switch(e.keyCode){
        case 87:
            e.preventDefault();
            if(!ships[selected].auto && ships[selected].team === playingAsTeam){
                move(selected, "forward");
            }
            break;
        case 68:
            e.preventDefault();
            if(!ships[selected].auto && ships[selected].team === playingAsTeam) move(selected, "right");
            break;
        case 65:
            e.preventDefault();
            if(!ships[selected].auto && ships[selected].team === playingAsTeam) move(selected, "left");
            break;
        case 83:
            e.preventDefault();
            if(!ships[selected].auto && ships[selected].team === playingAsTeam) move(selected, "backward");
            break;
        case 37:
            e.preventDefault();
            offsetX -= 20;
            break;
        case 38:
            e.preventDefault();
            offsetY -= 20;
            break;
        case 39:
            e.preventDefault();
            offsetX += 20;
            break;
        case 40:
            e.preventDefault();
            offsetY += 20;
            break;
        case 74:
            e.preventDefault();
            hudEnabled = hudEnabled ? false : true;
            break;
        case 75:
            e.preventDefault();
            gridEnabled = gridEnabled ? false : true;
            break;
        case 72:
            e.preventDefault();
            helpEnabled = helpEnabled ? false : true;
            if(document.querySelector('#quitgame').style.display === "none") pauseFunction();
            if(helpEnabled) document.querySelector('#help').style.display = "block";
            else document.querySelector('#help').style.display = "none"; 
            break;
        case 80:
            e.preventDefault();
            if(document.querySelector('#quitgame').style.display === "none" && document.querySelector('#help').style.display === "none"){
                pauseFunction();
            }
            break;
        case 81:
            e.preventDefault();
            if(document.querySelector('#quitgame').style.display === "none" && document.querySelector('#victoryscreen').style.display !== "block"){
                if(document.querySelector('#help').style.display === "block"){
                    document.querySelector('#help').style.display = "none";
                    helpEnabled = helpEnabled ? false : true;
                }
                else{
                pauseFunction();
                }
                document.querySelector('#quitgame').style.display = "inline-block";
            }
            else{
                if(playMusic){
                    music.pause();
                    music.currentTime = 0;
                }
                canvas;
                ctx;
                ships = [];
                numShipsA = [];
                numShipsB = [];
                selected;
                selectedPlane;
                playingAsTeam = 0;
                team = ["Team A","Team B"];
                selectedTeam = 0;
                scale = 0.6;
                offsetX = 0;
                offsetY = 0;
                cWidth;
                cHeight;
                cameraLock = true;
                isFiringManually = false;
                helpEnabled = false;
                hudEnabled = true;
                gridEnabled = true;
                isPaused = false;
                intervalID;
                startTime;
                playMusic = false;
                muteSound = false;
                document.querySelector('#victoryscreen').style.display = "none";
                document.querySelector('#victoryscreen h1').innerHTML = "";
                let listItemsToDrop = document.querySelectorAll('#victoryscreen ul li');
                for(let x of listItemsToDrop) x.remove();
                stats = [];
                timeStart = 0;
                [offsetX, offsetY] = [0, 0];
                // ships = [];
                document.getElementById('pausedscreen').style.display = "none";
                isPaused = false;
                let shipsToDropA = document.querySelectorAll('#teamA li');
                let shipsToDropB = document.querySelectorAll('#teamB li');
            
                for(let x of shipsToDropA) x.remove();
                for(let x of shipsToDropB) x.remove();

                document.querySelector('#quitgame').style.display = "none";
                document.querySelector('video').play();
                document.querySelector("main").style.display = "block";
                canvas.style.display = "none";
                
                // document.removeEventListener("keydown",(e)=>handleKeyPress(e), false);
                // document.removeEventListener("click", (e)=>getMousePos(e), false);
                // document.removeEventListener("dblclick",()=> cameraLock ? cameraLock = false : cameraLock = true);
                // selected = 0;
                // selectedPlane = undefined;
                // document.removeEventListener('mousemove', (e)=>scroll(e), false);
                // team = ["Team A", "Team B"];

                document.getElementById('teamAName').value = team[0];
                document.getElementById('teamBName').value = team[1];

                // music.currentTime = 0;
            }
            break;
        case 67:
            e.preventDefault();
            if(document.querySelector('#quitgame').style.display === "inline-block"){
                document.querySelector('#quitgame').style.display = "none";
                pauseFunction();
            }
            break;
        case 192:
            e.preventDefault();
            selectedPlane = undefined;
            break;
        case 49:
            e.preventDefault();
            selectedPlane = 0;
            break;
        case 50:
            e.preventDefault();
            selectedPlane = 1;
            break;
        case 51:
            e.preventDefault();
            selectedPlane = 2;
            break;
        case 52:
            e.preventDefault();
            selectedPlane = 3;
            break;
        case 53:
            e.preventDefault();
            selectedPlane = 4;
            break;
        case 70:
            e.preventDefault();
            cameraLock ? cameraLock = false : cameraLock = true
            break;
        case 188:
            e.preventDefault();
            music.play();
            break;
        case 190:
            e.preventDefault();
            music.pause();
            break;
        case 191:
            e.preventDefault();
            music.pause();
            setMusic();
            music.play();
            break;
        case 77:
            e.preventDefault();
            muteSound = muteSound ? false : true;
            muteSound ? music.volume = 0 : music.volume = 0.4;
            break;
        default:
            console.log("keycode", e.keyCode)
            break;
    }
}

function fire(x,y,rotation,distance,projectiles,calibre,damage, isManual=false){
    console.log("PROJECTILES",projectiles)
    console.log("Fired");
    let [rDS, rRS] = [Math.random() < 0.5 ? -1 : 1, Math.random() < 0.5 ? -1 : 1]
    let [randDistance, randRotation] = isManual ? [rDS*Math.random()*7, rRS*Math.random()*0.01] : [rDS*Math.random()*15, rRS*Math.random()*0.025];
    let i = 0;
    while(i < projectiles.length){
        if(projectiles[i].visible === false){
            projectiles[i].distance = distance+randDistance;
            // projectiles[i].distance = distance;
            projectiles[i].visible = true;
            projectiles[i].x = x-1;
            projectiles[i].y = y-1;
            projectiles[i].rotation = rotation+randRotation;
            // projectiles[i].rotation = rotation;
            projectiles[i].calibre = calibre;
            projectiles[i].damage = Math.floor(damage*Math.random())+100;
            // projectiles[i].damage = damage;
            break;
        }
        i++;
    }
    if(!i) return console.log("failed")
}

function pauseFunction(){
    isPaused = isPaused ? false : true;
            if(isPaused){
                document.getElementById('pausedscreen').style.display = "block";
                window.clearInterval(intervalID);
            }
            else{
                intervalID = window.setInterval(render, 33);
                document.getElementById('pausedscreen').style.display = "none";
            }
}

function move(shipIndex, direction){
    switch(direction){
        case "forward":
            if(ships[shipIndex].speedSetting < 4) ships[shipIndex].speedSetting++;
            console.log("increase speed", ships[shipIndex]);
            break;
        case "backward":
            if(ships[shipIndex].speedSetting > -1) ships[shipIndex].speedSetting--;
            break;
        case "right":
            ships[shipIndex].rotation+=1*ships[shipIndex].speed;
            if(ships[shipIndex].rotation > 360) ships[shipIndex].rotation -= 360; 
            break;
        case "left":
            ships[shipIndex].rotation-=1*ships[shipIndex].speed;
            if(ships[shipIndex].rotation < 0) ships[shipIndex].rotation += 360; 
            break;

    }

}

function playSound(type){
    if(!muteSound){
        if(type === "Ship Gun"){
            GunSound.play();
        }
        else if(type === "Hit"){
            HitSound.play();
        }
        else if(type === "AAA"){
            AAGunSound.play();
        }
    }
}

// function launch(squadron){
    
// }


// Better mouse tracking for panning the map
// var period = 100,
//     tracking;

// window.addEventListener("mousemove", function(e) {
//     if (!tracking) {
//         return;
//     }

//     console.log("mouse location:", e.clientX, e.clientY)
//     schedule();
// });

// schedule();

// function schedule() {
//     tracking = false;

//     setTimeout(function() {
//         tracking = true;
//     }, period);
// }