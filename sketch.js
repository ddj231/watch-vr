//Attributions
//couch model, and rug model by Alex “SAFFY” Safayan

//images by John Fowler, and Bob Dass, 
//volume, play and pause, icons by icongeek26

// variable to hold a reference to our A-Frame world
var world;

let livingRoom;
let bgSound;
let startedLooping = false;
let selectedInd = 4;
let imageIds = ["nature1_360", "nature2_360", "nature3_360","nature4_360","nature5_360","nature6_360" ];
let appState = 0;
let selectedVideo;
let playing = false;
let bgPicker;
let videoSrc;
let progressBar;
let state = 0; // 0 waiting for user to select video, 1 setting up video, 2 setup done
let clicking = false;
let interactionStyle = 'gaze'
let shouldSetInteraction = false;
let shouldCreateProgressBar = false;
let aframeVideoHeight = 0;


function preload(){
}

function setup() {
	// no canvas needed
	noCanvas()
	//createCanvas(600, 400).id('video')
	//document.querySelector("#VRScene").style.visibility = 'visible';
	
	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene', interactionStyle);
	//world.setMouseControls();
	livingRoom = new Room(0, 0, 0)	
	//document.querySelector("#loading").style.visibility = "hidden";
	world.add(livingRoom.room)
	world.teleportToObject(livingRoom.startBlock)
	let sky = document.querySelector("#sky")
	sky.setAttribute('src', "#" + imageIds[selectedInd]);
	sky.removeAttribute('color');
	let cameras = document.querySelectorAll('[camera]')
	for(camera of cameras){
		camera.removeAttribute('wasd-controls');
	}
}

function draw() {
	if(state === 0){
	}
	else if(state === 1){
		state = 2;
	}
	else if(state === 2){
	}
	if(shouldSetInteraction){
		if(interactionStyle === 'gaze'){
			world.setGazeControls();
		}
		else{
			world.setMouseControls();
		}
		shouldSetInteraction = false;
	}
	if(shouldCreateProgressBar){
		progressBar = new ProgressBar(0, 2.5 + (aframeVideoHeight/2), -2.5, 5);
		shouldCreateProgressBar = false;
	}
}

//https://aframe.io/docs/1.0.0/primitives/a-video.html
//let pos = world.camera.cursor.getWorldPosition()
    

class Room {
	constructor(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.startBlock;
		this.room = new Container3D({
			x: this.x,
			y: this.y,
			z: this.z 
		})
		// box primitive
		this.couch = new OBJ({
			asset: "couchobj",
			mtl: "couchmtl",
			x: 0,
			y: 0,
			z: 0,
			scaleX: 2,
			scaleY: 2,
			scaleZ: 2,
		})
		this.rug = new OBJ({
			asset: "rugobj",
			mtl: "rugmtl",
			x: 0,
			y: -0.25,
			z: -2,
			rotationY: 90
		})


		this.floor = new Plane({
			x: 0, 
			y: -0.25,
			z: -1.5,
			asset: "hardwoodfloor",
			height: 5,
			width: 5, 
			rotationX: -90,
			opacity: 0.5,
			repeatX: 5, 
			repeatY: 5 
		})	

		/*
		this.tv = new Plane({
			x: 0, 
			y: 3,
			z: -5,
			height: 4,
			width: 6,
			asset: 'video',
		})
		*/

		this.playButton = new Plane({
			x: -1.5, 
			y: 0.8,
			z: -2,
			height: 0.5,
			width: 0.5,
			asset: "play",
			transparent: true,
			clickFunction: (me) => {
				if(playing){
					//selectedVideo.pause();
					playing = false;
					me.setAsset("play");
					let video = document.querySelector('#myvideo');
					video.pause()
				}
				else {
					//selectedVideo.play();
					playing = true;
					me.setAsset("pause");
					let video = document.querySelector('#myvideo');
					video.play()
				}
			}
		})

		this.backwardsButton = new Plane({
			x: -0.8, 
			y: 0.8,
			z: -2,
			height: 0.5,
			width: 0.5,
			asset: "backwards",
			transparent: true,
			clickFunction: (me) => {
				//selectedVideo.pause();
				let video = document.querySelector('#myvideo');
				video.currentTime = video.currentTime - 15 < 0 ? 0 : video.currentTime - 15;
			}
		})

		this.forwardsButton = new Plane({
			x: 0, 
			y: 0.8,
			z: -2,
			height: 0.5,
			width: 0.5,
			asset: "backwards",
			rotationZ: 180,
			transparent: true,
			clickFunction: (me) => {
				//selectedVideo.pause();
				let video = document.querySelector('#myvideo');
				video.currentTime = video.currentTime + 15 > video.duration ? video.duration : video.currentTime + 15;
			}
		})

		this.rotateButton = new Plane({
			x: 0.7, 
			y: 0.8,
			z: -2,
			height: 0.5,
			width: 0.5,
			asset: "crop",
			rotationZ: 180,
			transparent: true,
			clickFunction: (me) => {
				let avideo = document.querySelector('a-video');
				let {width, height}= avideo.getAttribute('geometry');
				progressBar.container.setPosition(0, width/2 + 2.5, -2.5)
				avideo.setAttribute('geometry', {width: height, height: width});
			}
		})

		bgPicker = new BackgroundPicker(-1, 0, 0)

		//location blocks
		let blockLeft = new MovementBlock(-2, 1.5, 0)
		//let blockCouchLeft = new MovementBlock(-0.5, 1.5, 0, 1000) 
		let blockCouchMiddle = new MovementBlock(0.0, 1.5, 0, 1000)
		//let blockCouchRight = new MovementBlock(0.5, 1.5, 0, 1000)
		let blockRight = new MovementBlock(2, 1.5, 0)
		this.startBlock = blockCouchMiddle.moveBlock;

		this.room.add(this.floor)
		this.room.add(this.backwardsButton)
		this.room.add(this.forwardsButton)
		this.room.add(this.rotateButton)
		this.room.add(bgPicker.backgroundPicker)
		//this.room.add(this.tv)
		this.room.add(this.playButton)
		//this.room.add(this.tvstand)
		this.room.add(this.rug)
		this.room.add(this.couch)
		//this.room.add(blockLeft.moveBlock)
		//this.room.add(blockCouchLeft.moveBlock)
		//this.room.add(blockCouchMiddle.moveBlock)
		//this.room.add(blockCouchRight.moveBlock)
		//this.room.add(blockRight.moveBlock)
	}
}

class BackgroundPicker {
	constructor(x, y, z){
		let sky = document.querySelector("#sky")
		this.backgroundPicker = new Container3D({
			x: x, 
			y: y, 
			z: z,
			rotationY: 90
		})

		this.screen = new Plane({
			x: 0, 
			y: 1.5,
			z: -2.9,
			asset: imageIds[selectedInd],
			height: 2,
			width: 2.5,
			clickFunction: () => {
				//let sky = document.querySelector("#sky")
				console.log(sky);
				sky.setAttribute('src', "#" + imageIds[selectedInd]);
				sky.removeAttribute('color');
			}
		})

		this.volume = new Plane({
			x: 2.5, 
			y: 2,
			z: -2.9,
			height: 0.5,
			width: 0.5,
			asset: 'volumeon',
			transparent: true,
			clickFunction: (me) =>{
				let video = document.querySelector('#myvideo');
				if(me.getAsset() == "volumeoff"){
					me.setAsset('volumeon')
					//bgSound.loop();
					video.muted = false;
				}
				else {
					me.setAsset('volumeoff')
					//bgSound.pause();
					video.muted = true;
				}
			}
		})

		this.leftPlayButton = new Plane({
			x: -1.7,
			y: 1.6,
			z: -2.9,
			//rotationZ: 180,
			height: 0.5,
			width: 0.5,
			red: 255,
			green: 0,
			blue: 255,
			asset: 'nextbtn',
			transparent: true,
			clickFunction: (me) => {
				selectedInd -= 1;
				if(selectedInd < 0){
					selectedInd = imageIds.length - 1;
				}
				this.screen.setAsset(imageIds[selectedInd])
				sky.setAttribute('src', "#" + imageIds[selectedInd]);
				sky.removeAttribute('color');
			}
		})

		this.rightPlayButton = new Plane({
			x: 1.7,
			y: 1.6,
			z: -2.9,
			height: 0.5,
			width: 0.5,
			red: 255,
			green: 0,
			blue: 255,
			asset: 'nextbtn',
			transparent: true,
			rotationZ: 180,
			clickFunction: (me) => {
				selectedInd += 1;
				if(selectedInd >= imageIds.length){
					selectedInd = 0;
				}
				this.screen.setAsset(imageIds[selectedInd])
				sky.setAttribute('src', "#" + imageIds[selectedInd]);
				sky.removeAttribute('color');
			}
		})

		this.backgroundPicker.add(this.screen)
		this.backgroundPicker.add(this.leftPlayButton)
		this.backgroundPicker.add(this.rightPlayButton)
		this.backgroundPicker.add(this.volume)
	}

}

class MovementBlock {
	constructor(x, y, z, speed){
		this.speed = speed ? speed : 2000;
		this.moveBlock = new Box({
			x: x, 
			y: y, 
			z: z,
			height: 0.2,
			width: 0.2,
			depth: 0.2,
			red: 255,
			green: 0,
			blue: 255,
			opacity: 0.6,
			clickFunction: (me) => { 
				world.slideToObject(me, 2000);
				console.log("clicked");
			}
		});
	}
}
class ProgressBar {
	constructor(x,y,z, totalWidth){
		this.totalWidth = totalWidth;
		this.x = x
		this.y = y
		this.container = new Container3D({
			x: x,
			y: y,
			z: z
		});
		this.backgroundBar = new Plane({
			x: x, 
			y: y,
			z: z,
			width: totalWidth,
			height: 0.5,
			//depth: 0.5,
			red: 30,
			green: 30, 
			blue: 30, 
		});
		this.progressIndicator = new Plane({
			x: x - (totalWidth/2) + 0.25, 
			y: y,
			z: z + 0.01,
			height: 0.5,
			width: 0.5,
			red: 255,
			green: 0, 
			blue: 255, 
			opacity: 0.8,
			clickFunction: () => {
				clicking = true				
				console.log("clicking")
				//projectiles.push(new ProjectilePicker());
			},
			upFunction: (e) => {
				clicking = false 
				console.log("not clicking")
				let pos = world.camera.cursor.getWorldPosition()
				console.log(pos.x)
				/*
				if(pos.x < x){
					let newX = pos.x < -1 *(totalWidth/2) ?  -1 * (totalWidth/2) : pos.x;
					e.setX(newX)
				}
				else {
					let newX = pos.x > (totalWidth/2) ? (totalWidth/2) : pos.x; 
					e.setX(newX)
				}
				*/
			},
		})
		this.container.add(this.backgroundBar);
		this.container.add(this.progressIndicator);
		world.add(this.container);
	}
}

document.addEventListener('DOMContentLoaded', main);
function tryToStart(){
	let fileInput = document.querySelector("#videopicker");
	if(!fileInput.files || fileInput.files.length <= 0){
		return
	}
	else{
		let vrScene = document.querySelector('#VRScene');
		let startupElems = document.querySelector('#startup');
		let video = document.querySelector('#myvideo');
		videoSrc = window.URL.createObjectURL(fileInput.files[0]);
		video.src = videoSrc;
		startupElems.style.display = "none";
		vrScene.style.visibility = "visible"; 
		state = 1;
		let gazeRadio = document.body.querySelector("#usegaze");
		if(gazeRadio.checked){
			interactionStyle = 'gaze';
			console.log(world)
		}
		else{
			interactionStyle = 'mouse';
		}
		shouldSetInteraction = true;
	}
}
function setAspectRatio(){
	let height = this.videoHeight;
	let width = this.videoWidth;
	let aheight = 2.0 * (height/width)
	let awidth = 2.0 * (width/height)
	let avideo = document.querySelector('a-video');
	console.log(height/width)
	avideo.setAttribute('geometry', {height: aheight, width: awidth});
	//avideo.setAttribute('width', awidth);
	console.log(awidth)
	shouldCreateProgressBar = true;
	aframeVideoHeight = aheight;
	//progressBar = new ProgressBar(0, 2.5 + (aheight/2), -2.5, 5);
}

function handleVideoEnded(){
	if(livingRoom && livingRoom.playButton){
		playing = false;
		livingRoom.playButton.setAsset('play');
	}
}

function handleTimeUpdate(){
	let range = progressBar.totalWidth/2
	let widthOffset = progressBar.progressIndicator.getWidth() / 2;
	let loc = map(this.currentTime, 0, this.duration, (-1*range + widthOffset), range - widthOffset)
	progressBar.progressIndicator.setX(loc);
}

function main(){
	let startButton = document.body.querySelector("#startbutton");
	startButton.addEventListener('click', tryToStart);
	let video = document.querySelector('#myvideo');
	video.addEventListener('loadedmetadata', setAspectRatio);
	video.addEventListener('ended', handleVideoEnded);
	video.addEventListener('timeupdate', handleTimeUpdate);
	
}




