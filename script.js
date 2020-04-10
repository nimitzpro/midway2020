let canvas;
let ctx;
let ships = [];
let selected;
let team = ["Team A","Team B"];
selectedTeam = 0;
let scale = 0.5;
let offsetX = 0;
let offsetY = 0;
let cWidth;
let cHeight;
let cameraLock = false;

let [akagiIMG, enterpriseIMG, kagaIMG, hiryuIMG, soryuIMG, yamatoIMG, iowaIMG, bismarckIMG, hoodIMG] = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];

akagiIMG.src = "carriers/akagi.png";
enterpriseIMG.src = "carriers/enterprise.png";
kagaIMG.src = "carriers/kaga.png";
hiryuIMG.src = "carriers/hiryu.png";
soryuIMG.src = "carriers/soryu.png";
yamatoIMG.src = "battleships/yamato.png";
iowaIMG.src = "battleships/iowa.png";
bismarckIMG.src = "battleships/bismarck.png";
hoodIMG.src = "battleships/hood.png";

let fireIMG = new Image();
fireIMG.src = "fire_temp.png";

// let akagi = 
// let kaga =   
let shipTypes = [
    {autofire:true, range:2500, team:undefined, name:"Yamato",     nation:"Japan",                    type:"Battleship",       hp:97000, maxHP:97000, x:100,  y:100, beam:38.9, length:256,   speed:0, speedSetting:0, image:yamatoIMG,     rotation:0,  guns:[{number:1, x:50,y:0, calibre:460,reloadTime:1000,damage:300, timeSinceReload:0},{number:2, x:50,y:7.5, calibre:460,reloadTime:1000,damage:300, timeSinceReload:0},{number:3, x:50,y:15, calibre:460,reloadTime:1000,damage:300, timeSinceReload:0},{number:4, x:40,y:0, calibre:460,reloadTime:1000,damage:300, timeSinceReload:0}, {number:5, x:40,y:7.5, calibre:460,reloadTime:1000,damage:300, timeSinceReload:0},{number:6, x:40,y:15, calibre:460,reloadTime:1000,damage:300, timeSinceReload:0},{number:7, x:10,y:0, calibre:460,reloadTime:1000,damage:300, timeSinceReload:0},{number:8, x:10,y:7.5, calibre:460,reloadTime:1000,damage:300, timeSinceReload:0},{number:9, x:10,y:15, calibre:460,reloadTime:1000,damage:300, timeSinceReload:0}], projectiles:30},
    {autofire:true, range:2500, team:undefined, name:"Iowa",       nation:"United States",            type:"Battleship",       hp:92000, maxHP:92000, x:100,  y:100, beam:33,   length:262,   speed:0, speedSetting:0, image:iowaIMG,       rotation:0,  guns:[{number:1, x:50,y:0, calibre:406,reloadTime:1000,damage:300, timeSinceReload:0},{number:2, x:50,y:7.5, calibre:406,reloadTime:1000,damage:300, timeSinceReload:0},{number:3, x:50,y:15, calibre:406,reloadTime:1000,damage:300, timeSinceReload:0},{number:4, x:40,y:0, calibre:406,reloadTime:1000,damage:300, timeSinceReload:0}, {number:5, x:40,y:7.5, calibre:406,reloadTime:1000,damage:300, timeSinceReload:0},{number:6, x:40,y:15, calibre:406,reloadTime:1000,damage:300, timeSinceReload:0},{number:7, x:10,y:0, calibre:406,reloadTime:1000,damage:300, timeSinceReload:0},{number:8, x:10,y:7.5, calibre:406,reloadTime:1000,damage:300, timeSinceReload:0},{number:9, x:10,y:15, calibre:406,reloadTime:1000,damage:300, timeSinceReload:0}], projectiles:30},
    {autofire:true, range:2500, team:undefined, name:"Bismarck",   nation:"Germany",                  type:"Battleship",       hp:80000, maxHP:80000, x:100,  y:100, beam:36,   length:241.6, speed:0, speedSetting:0, image:bismarckIMG,   rotation:0,  guns:[{number:1, x:50,y:0, calibre:380,reloadTime:1000,damage:300, timeSinceReload:0},{number:2, x:50,y:15, calibre:380,reloadTime:1000,damage:300, timeSinceReload:0}, {number:3, x:40,y:0, calibre:380,reloadTime:1000,damage:300, timeSinceReload:0}, {number:4, x:40,y:15, calibre:380,reloadTime:1000,damage:300, timeSinceReload:0},{number:5, x:20,y:0, calibre:380,reloadTime:1000,damage:300, timeSinceReload:0},  {number:6, x:20,y:15, calibre:380,reloadTime:1000,damage:300, timeSinceReload:0},{number:7, x:10,y:0, calibre:380,reloadTime:1000,damage:300, timeSinceReload:0},{number:8, x:10,y:15, calibre:380,reloadTime:1000,damage:300, timeSinceReload:0}], projectiles:30},
    {autofire:true, range:2500, team:undefined, name:"Hood",       nation:"Great Britain",            type:"Battleship",       hp:80000, maxHP:80000, x:100,  y:100, beam:31.8, length:262.3, speed:0, speedSetting:0, image:hoodIMG,       rotation:0,  guns:[{number:1, x:50,y:0, calibre:381,reloadTime:1000,damage:300, timeSinceReload:0},{number:2, x:50,y:15, calibre:381,reloadTime:1000,damage:300, timeSinceReload:0}, {number:3, x:40,y:0, calibre:381,reloadTime:1000,damage:300, timeSinceReload:0}, {number:4, x:40,y:15, calibre:381,reloadTime:1000,damage:300, timeSinceReload:0},{number:5, x:20,y:0, calibre:381,reloadTime:1000,damage:300, timeSinceReload:0},  {number:6, x:20,y:15, calibre:381,reloadTime:1000,damage:300, timeSinceReload:0},{number:7, x:10,y:0, calibre:381,reloadTime:1000,damage:300, timeSinceReload:0},{number:8, x:10,y:15, calibre:381,reloadTime:1000,damage:300, timeSinceReload:0}], projectiles:30},     
    {team:undefined, name:"Akagi",      nation:"Japan",                    type:"Aircraft Carrier", hp:52000, maxHP:52000, x:100,  y:100, beam:15,   length:65,    speed:0, speedSetting:0, image:akagiIMG,      rotation:0,  timeSinceReload:0,  reloadTime:150, projectiles:30},
    {team:undefined, name:"Kaga",       nation:"Japan",                    type:"Aircraft Carrier", hp:56000, maxHP:56000, x:1000, y:100, beam:15,   length:65,    speed:0, speedSetting:0, image:kagaIMG,       rotation:0,  timeSinceReload:0,  reloadTime:150, projectiles:30},
    {team:undefined, name:"Hiryuu",     nation:"Japan",                    type:"Aircraft Carrier", hp:44000, maxHP:44000, x:1000, y:300, beam:15,   length:65,    speed:0, speedSetting:0, image:hiryuIMG,      rotation:0,  timeSinceReload:0,  reloadTime:150, projectiles:30},
    {team:undefined, name:"Soryuu",     nation:"Japan",                    type:"Aircraft Carrier", hp:44000, maxHP:44000, x:1000, y:300, beam:15,   length:65,    speed:0, speedSetting:0, image:soryuIMG,      rotation:0,  timeSinceReload:0,  reloadTime:150, projectiles:30},
    {team:undefined, name:"Enterprise", nation:"United States", type:"Aircraft Carrier", hp:48000, maxHP:48000, x:1000, y:300, beam:15, length:65, speed:0, speedSetting:0, image:enterpriseIMG, rotation:0,  timeSinceReload:0,  reloadTime:150, projectiles:30}
];

let scenarios = [
    {name:"Hood vs Bimarck",teamNames:["Royal Navy", "Kriegsmarine"],ships:[{"name":"Hood","team":0},{"name":"Bismarck","team":1}]},
    {name:"Iowa vs Yamato",teamNames:["US Navy","Imperial Japanese Navy"],ships:[{"name":"Iowa","team":0},{"name":"Yamato","team":1}]}
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

function addShip(shipName){
    console.log("Added",shipName, "to battle");
    let teamElement;
    if(selectedTeam === 0){
        teamElement = document.querySelector("#teamA");
    }
    else{
        teamElement = document.querySelector("#teamB");
    }
    let li = document.createElement('li');
    li.innerHTML = shipName;
    teamElement.appendChild(li);
    let ship = shipTypes.find(x => x.name === shipName);
    let a = {autofire:ship.autofire, range:ship.range, team:selectedTeam, name:ship.name, nation:ship.nation, type:ship.type, hp:ship.hp, maxHP: ship.maxHP, x:0, y:0, beam:ship.beam, length:ship.length, speedSetting:0, speed:0, image:ship.image, rotation:0, timeSinceReload:0, guns:loopThrough(ship.guns), reloadTime:ship.reloadTime, projectiles:projectiles(ship.projectiles)}
    ships.push(a);
    console.log(a);
}

function loopThrough(guns){
    let finishedWeps = [];
    let i = 0;
    while(i < guns.length){
        let gun = {number:guns[i].number, x:guns[i].x, y:guns[i].y, calibre:guns[i].calibre, reloadTime:guns[i].reloadTime, timeSinceReload:guns[i].timeSinceReload};
        finishedWeps.push(gun);
        i++;
    }
    return finishedWeps;
}

function switchTeam(){
    selectedTeam = selectedTeam === 0 ? 1 : 0;
    document.getElementById('switchTeam').innerHTML = team[selectedTeam];
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
    let teams = [document.querySelector("#teamA"),document.querySelector("#teamB")];
    let scen = scenarios.find(x => x.name === name);
    [team[0], document.querySelector('#teamAName').value] = [scen.teamNames[0],scen.teamNames[0]];
    [team[1], document.querySelector('#teamBName').value] = [scen.teamNames[1],scen.teamNames[1]];

    for(let i of scen.ships){
        let li = document.createElement('li');
        let ship = shipTypes.find(x => x.name === i.name);
        li.innerHTML = i.name;
        teams[i.team].appendChild(li);
        let a = {autofire:ship.autofire, range:ship.range, team:i.team, name:ship.name, nation:ship.nation, type:ship.type, hp:ship.hp, maxHP: ship.maxHP, x:0, y:0, beam:ship.beam, length:ship.length, speedSetting:0, speed:0, image:ship.image, rotation:0, timeSinceReload:0, guns:loopThrough(ship.guns), reloadTime:ship.reloadTime, projectiles:projectiles(ship.projectiles)}
        ships.push(a);
        console.log(a);
    }
}

function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    let m =  {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    if(m.x > 10 && m.x < 110 && m.y > canvas.height - (12*((ships[selected].guns.length+3))) && m.y < canvas.height - (12*((ships[selected].guns.length+3)))+20){
        ships[selected].autofire = ships[selected].autofire ? false : true;
    }
    for(let i of ships){
        if(m.x <= i.x+i.length-offsetX && m.x >= i.x-offsetX && m.y >= i.y-offsetY && m.y <= i.y+i.beam-offsetY){
                    selected = ships.indexOf(i);
                    console.log("Selected ship",selected, "name : ", i.name);
                }
    }
  }

function init(){
    console.log("initialising")
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
    let numShipsA = [];
    let numShipsB = [];

    for(let i of ships){
        if(i.team === 0){
            numShipsA.push(i);
        }
        else{
            numShipsB.push(i);
        }
    }

    for(let i = 0; i < numShipsA.length; i++){
        numShipsA[i].x = 75;
        numShipsA[i].y = ((cHeight) / (numShipsA.length+1)) *(i+1);
    }   

    for(let i = 0; i < numShipsB.length; i++){
        numShipsB[i].x = cWidth - 75;
        numShipsB[i].y = ((cHeight) / (numShipsB.length+1)) *(i+1);
        numShipsB[i].rotation = 180;
    }   

    // offsetY such that numShipsA[0].y is in the middle of window.innerHeight
    offsetY = numShipsA[0].y / 2;
    console.log("offsetY", offsetY)
    document.addEventListener("keydown",(e)=>move(e), false);
    document.addEventListener("click", (e)=>getMousePos(e), false);
    document.addEventListener("dblclick",()=> cameraLock ? cameraLock = false : cameraLock = true);

    selected = 0;

    document.addEventListener('mousemove', (e)=>scroll(e));
    window.setInterval(render, 33);
}

function scroll(e){
    var rect = canvas.getBoundingClientRect();
    let m =  {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    // console.log(m)

    if(m.x / window.innerWidth > 0.99 && offsetX+window.innerWidth < cWidth){ offsetX+=10;}
    else if(m.x / window.innerWidth < 0.01 && offsetX > 0){ offsetX-=10;}

    if(m.y / window.innerHeight > 0.99 && offsetY+window.innerHeight < cHeight){ offsetY+=10;}
    else if(m.y / window.innerHeight < 0.01 && offsetY > 0){ offsetY-=10;}
}


function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#5095F8";
    ctx.fillRect(0,0,canvas.width,canvas.height);

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

    ctx.textAlign = "left";


    if(stats.length >= 1){
        let a = 0;
        let i = stats.length-1;
        while(i >= 0){
            a++;
            if(Date.now() - stats[i].time > 5000) break;
            ctx.fillStyle = "black"; 
            ctx.font = "16px Arial";
            ctx.fillText(stats[i].text,5,a*20);
            if(a > 4) break;
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
    ctx.fillText(`${ships[selected].hp} / ${ships[selected].maxHP}`, canvas.width-10, 80);
    ctx.fillText(`${Math.round(ships[selected].speed * 30 * 10) / 10} knots`, canvas.width-10, 100);


    if(cameraLock){
        offsetX = ships[selected].x - ((canvas.width / 2));
        // +Math.sin(ships[selected].rotation*(Math.PI/180))*ships[selected].length/2);
        offsetY = ships[selected].y - ((canvas.height / 2));
        // +Math.cos(ships[selected].rotation*(Math.PI/180))*ships[selected].beam/2);
    }

    for(let i of ships){

        // positioning of hp and text
        let tY = i.y-15*(Math.abs(Math.cos(i.rotation*(Math.PI/180))));
        let tX = i.x-10;

        if(i.speed-0.0001 > (i.speedSetting / 4)) i.speed-=0.005;
        else if(i.speed+0.0001 < (i.speedSetting / 4)) i.speed+=0.005;

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

        for(let p of i.projectiles){
            if(p.visible === true){
                if(p.distance > 0){
                    ctx.fillStyle = "black";
                    ctx.fillRect(p.x-(1+offsetX),p.y-(1+offsetY),2,2);
                    p.distance-=8;
                    p.x += p.speed*Math.cos(p.rotation);
                    p.y += p.speed*Math.sin(p.rotation);
                }
                else if(p.distance < 3){
                    for(let q of ships){
                        if(Math.sqrt((q.x-p.x)**2 + (q.y-p.y)**2) < 50){
                            q.hp -= 5000;
                            stats.push({text:`${i.name} hits ${q.name}, dealing some damage`,time:Date.now()});
                        }
                    }
                    ctx.fillStyle = "red";
                    ctx.fillRect(p.x-(7.5+offsetX),p.y-(7.5+offsetY),15,15)
                    p.visible = false; 
                }
                else{
                    ctx.fillStyle = "red";
                    ctx.fillRect(p.x-(7.5+offsetX),p.y-(7.5+offsetY),15,15)
                    p.visible = false; 

                    for(let q of ships){
                        if(Math.sqrt((q.x-p.x)**2 + (q.y-p.y)**2) < 50){
                            q.hp -= 5000;
                            stats.push({text:`${i.name} hits ${q.name}, dealing some damage`,time:Date.now()});
                        }
                    }
                }
            }
        }

        if(i.hp > 0){

            let eX;
            let eDistance = i.range;
            let eY;
            let eRotation;
            let targetAcquired = false;
            for(let q of ships){
                if(q.team !== i.team && q.hp > 0){
                    if(Math.sqrt((i.x-q.x)**2+(i.y-q.y)**2) < eDistance){
                        eDistance = Math.sqrt((i.x-q.x)**2+(i.y-q.y)**2);
                        eX = q.x;
                        eY = q.y;
                        enemySpeed = q.speed;
                        enemyRotation = q.rotation;
                        targetAcquired = true;
                        console.log("TARGET ACQUIRED")
                    }
                }
            }
            // ctx.fillText(`Auto-fire : ${_x}`, (canvas.width / 2) - 50, canvas.height - 4)

            ctx.fillStyle = "Black";
            ctx.font = "16px Arial";
            ctx.fillText("Weapons Reload Time", 10, canvas.height - (12*((i.guns.length+4))));


            ctx.fillStyle = "rgba(255,255,255,1)"
            ctx.fillRect(10, canvas.height - (12*((i.guns.length+3))), 100, 20);
            ctx.fillStyle = "black";
            ctx.font = "14px sans-serif";
            let _x = ships[selected].autofire ? "Yes" : "No";
            ctx.fillText(`Auto-fire : ${_x}`, 12, canvas.height - (12*((i.guns.length+2))-4));

            if(targetAcquired){
                for(let a of i.guns){
                    if(a.timeSinceReload >= a.reloadTime){
                        console.log("a.x, a.y:", a.x, a.y);
                        let posX = Math.sin(i.rotation*(Math.PI/180))*(a.x*2); 
                        let posY = Math.cos(i.rotation*(Math.PI/180))*(a.y*2); 
                        console.log(posX, posY)
                        let [finalY, finalX] = [i.y+posY, i.x+posX];        // Initial position of shell(x,y)
                        eRotation = Math.atan((eY-(finalY))/(eX-(finalX))); // Angle to enemy ship(initial)
                        if(finalX > eX) eRotation = eRotation + Math.PI; // Possible correction to angle
                        eDistance = Math.sqrt((eX-(i.x+posX))**2+(eY-(i.y+posY))**2); // Initial distance from shell to enemy

                        timeToCurrentDistance = eDistance / 8; // Time t
                        afterTimeX = eX + (enemySpeed*Math.cos(enemyRotation*Math.PI/180) * timeToCurrentDistance); // Enemy x co-ord after t time has passed
                        afterTimeY = eY + (enemySpeed*Math.sin(enemyRotation*Math.PI/180) * timeToCurrentDistance); // Enemy y co-ord after t time has passed

                        let enemyDistanceFromInitial = Math.sqrt((eX-afterTimeX)**2 + (eY-afterTimeY)**2); // Enemy distance from where it was initially

                        let epicAngle = Math.atan((afterTimeY-(eY))/(afterTimeX-(eX))); // Angle between initial and final enemy ship positions
                        if(afterTimeX > eX) epicAngle = epicAngle + Math.PI; // Possible correction


                        afterRotation = Math.atan((afterTimeY-(finalY))/(afterTimeX-(finalX))); // Angle between final enemy pos and shell
                        if(finalX > afterTimeX) afterRotation = afterRotation + Math.PI;

                        let epicDistance = Math.sqrt(enemyDistanceFromInitial**2 + eDistance**2 - 2*eDistance*enemyDistanceFromInitial*Math.cos(epicAngle-eRotation))
                        // Application of the formula a^2 = b^2 + c^2 - 2bcCos(A)


                        // afterDistance = Math.sqrt((afterTimeX-(i.x+posX))**2 + (afterTimeY-(i.y+posY))**2);

                        console.log(i.name, i.team, "with coords",finalX,finalY, "firing at enemy ", eX, eY, "angle: ", eRotation, "distance:", eDistance, "enemy speed:", enemySpeed, "enemy rotation:", enemyRotation);
                        fire(i.x+posX, i.y+posY, afterRotation, epicDistance, i.projectiles, a.calibre, a.damage);
                        a.timeSinceReload = 0;
                    }
                a.timeSinceReload++;
                // ctx.fillStyle = "white";
                // ctx.fillRect(10, canvas.height - (12*((i.guns.length+1) - a.number+1)), 50, 10);
                ctx.fillStyle = "rgb(150,255,150)";
                if(a.timeSinceReload / a.reloadTime === 1) ctx.fillStyle = "rgb(40,40,180)"; 
                ctx.fillRect(10, canvas.height - (12*((i.guns.length+1) - a.number+1)), 80*(a.timeSinceReload / a.reloadTime), 10);
                }
            }
            else{
                for(let a of i.guns){
                    if(a.timeSinceReload < a.reloadTime) a.timeSinceReload++;
                    // ctx.fillStyle = "white";
                    // ctx.fillRect(10, canvas.height - (12*((i.guns.length+1) - a.number+1)), 50, 10);
                    ctx.fillStyle = "rgb(150,255,150)";
                    if(a.timeSinceReload / a.reloadTime === 1) ctx.fillStyle = "rgb(40,40,180)"; 
                    ctx.fillRect(10, canvas.height - (12*((i.guns.length+1) - a.number+1)), 80*(a.timeSinceReload / a.reloadTime), 10);
                }
            }
        }
        if(i.x+i.speed*Math.cos((i.rotation*Math.PI)/180) > 0 && i.x+i.speed*Math.cos((i.rotation*Math.PI)/180) < cWidth) i.x += i.speed*Math.cos((i.rotation*Math.PI)/180);
        if(i.y + i.speed*Math.sin((i.rotation*Math.PI)/180) > 0 && i.y+i.speed*Math.sin((i.rotation*Math.PI)/180) < cHeight) i.y += i.speed*Math.sin((i.rotation*Math.PI)/180);
    }
}

function move(e){
    switch(e.keyCode){
        case 87:
            e.preventDefault();
            if(ships[selected].speedSetting < 4) ships[selected].speedSetting++;
            console.log("increase speed", ships[selected]);
            break;
        case 68:
            e.preventDefault();
            ships[selected].rotation+=1*Math.abs(ships[selected].speed);
            if(ships[selected].rotation > 360) ships[selected].rotation -= 360; 
            break;
        case 65:
            e.preventDefault();
            ships[selected].rotation-=1*Math.abs(ships[selected].speed);
            if(ships[selected].rotation < 0) ships[selected].rotation += 360; 
            break;
        case 83:
            e.preventDefault();
            if(ships[selected].speedSetting > -1) ships[selected].speedSetting--;
            break;
    }
}

function fire(x,y,rotation,distance,projectiles,calibre,damage){
    console.log("PROJECTILES",projectiles)
    console.log("Fired")
    let i = 0;
    while(i < projectiles.length){
        if(projectiles[i].visible === false){
            projectiles[i].distance = distance+Math.random()*30;
            projectiles[i].visible = true;
            projectiles[i].x = x-1;
            projectiles[i].y = y-1;
            projectiles[i].rotation = rotation+Math.random()*0.1;
            projectiles[i].calibre = calibre;
            projectiles[i].damage = damage*Math.random() + 100;
            break;
        }
        i++;
    }
    if(!i) return console.log("failed")
}


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