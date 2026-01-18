/**
* @name [js-engine]{https://www.umbawa.web.app}
* @app Virtual World Engine (Artificial World Project)
* @copyright Copyright engine.js, 2017 - 2022
* @license Software: Open Source Free for all to modify & reproduce
* @project: Three JS & Cannon ES/JS Virtual World Engine Project
* @source: Three JS by Mr.doob, Cannon ES by Poimandres & Cannon JS by Stefan Hedman
* @written Developed by: Eng'r Umbawa P. Sarosong
* @course: Bachelour of Science in Computer Engineering
* @major: Robotics and Automations [System Engineering]
* @specialization: Virtual World Artificial Lifeform Project
* @university: AMA Computer College, Cagayan de Oro City
*/
// ==== IMPORTS ====
import * as THREE from'./three.module.js'
import * as BufferGeometryUtils from'./BufferGeometryUtils.js'
import * as CANNON from './cannon-es.js'
import{StereoEffect}from'./StereoEffect.js'
import{EffectComposer}from'./EffectComposer.js'
import{RenderPass}from'./RenderPass.js'
import{ShaderPass}from'./ShaderPass.js'
import{FXAAShader}from'./FXAAShader.js'
import{UnrealBloomPass}from'./UnrealBloomPass.js'
import{Water}from'./Water.js'
import{Sky}from'./Sky.js'
import{OrbitControls}from'./OrbitControls.js'
import{CSM}from'./CSM.js'
import{FBXLoader}from'./FBXLoader.js'
import{GLTFLoader}from'./GLTFLoader.js'
import{DRACOLoader}from'./DRACOLoader.js'
import{SimplifyModifier}from'./SimplifyModifier.js'
import{SoundGeneratorAudioListener,SineWaveSoundGenerator,EngineSoundGenerator}from'../../worklet.js'
import carEngine from'./carEngine.js'
import{GUI}from'./lil-gui.module.min.js'
import Stats from'./stats.module.js'
import CannonDebugger from'./cannon-es-debugger.js'
// ==== START OF ENGINE ====
// Environment variables
const stats=new Stats()
// Rendering variables
const clock=new THREE.Clock()
// UI variables
var hideOpTm
// ==== APP ROOT ====
// Start app
window.startApp=function(){
	loadRenderer()
  loadEnvironment(playerParameters.water,10000)
  //loadGUI(sunShadowParameters,updateSun)
	initPhysics()
	if(playerParameters.debug)cannonDebugRenderer=new CannonDebugger(engineParameters.scene,engineParameters.world)
	playerParameters.position={x:0,y:0,z:0,o:0}
	loadCascadedShadow()
	updateSun()
	getSpawnPosition(playerParameters.spawn,true)
  loadModels(playerParameters.parameters.length-1)
	loadSounds()
	engineParameters.composer=loadRenderPasses(engineParameters.camera)
	loadCarEngineSound()
}
// ==== RENDERING ====
// Render
window.render=function(){
	stats.update()
	if(engineParameters.vr){
		engineParameters.stereo.render(engineParameters.scene,engineParameters.camera)
	}else engineParameters.composer.render()
	if(playerParameters.debug&&cannonDebugRenderer)cannonDebugRenderer.update()
	playCarEngineSound()
}
// Load models
let s0
function loadModels(n){
	let fObj,sF0=`playerParameters.parameters`,sF1
	modelsParameters.loaded=n
	if(playerParameters.parameters[n]!=null&&playerParameters.parameters[n]!==undefined&&playerParameters.parameters[n]!=''){
		// Player
		if(playerParameters.parameters[n].type.match(/(player)/)){
			let of
			if(playerModelLink===undefined){
				fp='assets/models/players/'+playerParameters.parameters[n].name+'/'
				fn=playerParameters.parameters[n].name+'.glb'
				of=playerParameters.parameters[n].of
			}
			sF1=`playerParameters.position`
			fObj=`loadPlayerMesh('`+fp+`','`+fn+`',`+sF0+`[`+n+`].loader,`+sF1+`.x,`+sF1+`.y,`+sF1+`.z,Math.PI/180*`+sF1+`.o,`+sF0+`[`+n+`].s,playerParameters.index,`+sF0+`[`+n+`].ht,`+sF0+`[`+n+`].kg,false,`+sF0+`[`+n+`].si,`+of+`)`
			if(oRyt('true',fObj))return
		}
		// Onject
		if(playerParameters.parameters[n].type.match(/(chassis|vehiclebody|wheel|objectmesh|animesh|object|animated|trimesh|polyhedron)/)){
			registerModel(n)
			objectSound(n)
			sF1=`null,`+sF0+`[`+n+`].type,null,`+sF0+`[`+n+`].kg,false,false,false,`+sF0+`[`+n+`].si,`+sF0+`[`+n+`].of,false,`+sF0+`[`+n+`].ds,`+sF0+`[`+n+`].obID,`+n
			sF0=`'assets/models/objects/',`+sF0+`[`+n+`].name+'.'+`+sF0+`[`+n+`].loader,`+sF0+`[`+n+`].x,`+sF0+`[`+n+`].y,`+sF0+`[`+n+`].z,`+sF0+`[`+n+`].o,`+sF0+`[`+n+`].s,`
			if(playerParameters.parameters[n].loader.toLowerCase()=='fbx'){
				fObj=`loadFBX(`+sF0+sF1+`)`
			}else fObj=`loadGlft(`+sF0+`true,`+sF1+`)`
			if(oRyt('true',fObj))return
		}
		// Terrain
		if(playerParameters.parameters[n].type.match(/(terrain|heightmap)/)){
			registerModel(n)
			objectSound(n)
			if(isOnL()&&worldModelLink!=undefined){
				fn=worldModelLink.split('/').slice(-1)
				fp=appLink+worldModelLink.replace(fn,'')
			}else{
				fp='assets/models/objects/'
				fn=playerParameters.parameters[n].name+'.'+playerParameters.parameters[n].loader
			}
			sF1=`null,`+sF0+`[`+n+`].type,null,`+sF0+`[`+n+`].kg,`+sF0+`[`+n+`].pd,false,false,`+sF0+`[`+n+`].si,`+sF0+`[`+n+`].of,false,`+sF0+`[`+n+`].ds,`+sF0+`[`+n+`].obID,`+n
			sF0=`'`+fp+`','`+fn+`',`+sF0+`[`+n+`].x,`+sF0+`[`+n+`].y,`+sF0+`[`+n+`].z,`+sF0+`[`+n+`].o,`+sF0+`[`+n+`].s,`
			if(playerParameters.parameters[n].loader.toLowerCase()=='fbx'){
				fObj=`loadFBX(`+sF0+sF1+`)`
			}else fObj=`loadGlft(`+sF0+`false,`+sF1+`)`
			if(oRyt('true',fObj))return
		}
		// Debug
		if(playerParameters.parameters[n].type.match(/(ground|box)/)){
			if(playerParameters.parameters[n].type=='ground'){
				var ground=new CANNON.Body({mass:0,material:engineParameters.genericMaterial})
				ground.position.set(playerParameters.parameters[n].x,playerParameters.parameters[n].y,playerParameters.parameters[n].z)
				ground.addShape(new CANNON.Plane())
				ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2)
				ground.id=getObjectID()
				engineParameters.world.addBody(ground)
				objectCollision(ground)
			}else{
				let object=new CANNON.Body({mass:playerParameters.parameters[n].kg,material:engineParameters.genericMaterial})
				object.addShape(new CANNON.Box(new CANNON.Vec3(playerParameters.parameters[n].l,playerParameters.parameters[n].h,playerParameters.parameters[n].w)))
				object.position.set(playerParameters.parameters[n].x,playerParameters.parameters[n].y,playerParameters.parameters[n].z)
				object.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),Math.PI/180*playerParameters.parameters[n].o)
				object.id=getObjectID()
				engineParameters.world.addBody(object)
				objectCollision(object)
			}
			isLoaded()
		}
	}else isLoaded()
}
// Loaded pgress
window.isLoaded=function(){
	if(modelsParameters.loaded==0){
		if(modelsParameters.complete==false){
			modelsParameters.complete=true
			$('#loadingFill').css('width','95%')
			setTimeout(function(){
				$('#loadingFill').css('width','100%')
				createCameras(true)
				isVR(false)
				animate()
				setTimeout(function(){
					$('#world').fadeIn('slow')
					$('body').css('background-image','url(assets/images/black.jpg)')
					if(checkRequired(false)!=null||playerParameters.prerequisite==null){
						setTimeout(function(){
							$('#loadingBar').fadeOut('slow')
							if(lsRd('walletAmount'+myUserID.uid)!=null)$('#walletAmount').text(iCommas(deSuStr(lsRd('walletAmount'+myUserID.uid))))
							if(lsRd(playerParameters.levelName+'playerAvatar')==null){
								$('#loadingBar').fadeOut('slow')
								myCharacter(null,false)
							}else if(playerParameters.mission!==undefined){
								if(lsRd('mission'+playerParameters.levelName)==null){
									showDialog('myObjective.png',playerParameters.mission,'startSounds()','Dismiss')
								}else showDialog('myObjective.png','You alread have completed the "'+playerParameters.levelName+'" mission','startSounds()','Dismiss')
							}else isVR(true)
						},600)
					}else showDialog('myObjective.png','Please complete the "'+playerParameters.prerequisite+'" world mission first','history.back()','Back')
				},1200)
			},isMobile?1200:600)
		}
	}else loadModels(modelsParameters.loaded-1)
}
// Loading error message
window.loadingError=function(fn){
	if(!engineParameters.broken.includes(fn)){
		engineParameters.broken.push(fn)
		lsSv('brokenurl',JSON.stringify(engineParameters.broken))
	}
	let m0,m1=`Unable load asset`,f0='',b0='Dismiss'
	if(modelsParameters.loaded>0){
		m1=`Unable to load "`+fn.replace(',','')
		m0=`", because the asset is not downloaded`
		f0='history.back()'
		b0='Back'
	}else if(!isOnL()){
		m0=`, because you are not connected to the internet`
	}else m0=`, because the asset is blocked by CORS policy`
	showDialog('nointernet.png',m1+(isOnL()?m0:`", because you're not connected to the internet`),f0,b0)
}
// Get spawn position
function getSpawnPosition(sp0,cC0){
	if(sp0!=null&&sp0!=false&&sp0!==undefined){
		if(cC0)playerControlsParameters.player=new THREE.Object3D()
		let sp1=Math.floor(Math.random()*sp0.length)
		playerControlsParameters.player.position.x=playerParameters.position.x=sp0[sp1].x-sp0[sp1].s+Math.floor(Math.random()*sp0[sp1].s*2)
		playerControlsParameters.player.position.y=playerParameters.position.y=sp0[sp1].y
		playerControlsParameters.player.position.z=playerParameters.position.z=sp0[sp1].z-sp0[sp1].s+Math.floor(Math.random()*sp0[sp1].s*2)
		playerParameters.position.o=sp0[sp1].o
	}
}
// ==== LOAD ENVIRONMENT ====
// Load renderer
function loadRenderer(){
	engineParameters.renderer=new THREE.WebGLRenderer({alpha:true,antialias:true})
	engineParameters.renderer.debug.checkShaderErrors=true
	engineParameters.renderer.autoClear=false
	engineParameters.renderer.shadowMap.enabled=true
	engineParameters.renderer.shadowMap.type=THREE.VSMShadowMap
	engineParameters.renderer.setSize(window.innerWidth,window.innerHeight)
	engineParameters.renderer.toneMapping=THREE.ACESFilmicToneMapping
	engineParameters.renderer.toneMappingExposure=setRenderSettings() // Vray parameters
	engineParameters.renderer.outputEncoding=THREE.sRGBEncoding
	document.getElementById('world').appendChild(engineParameters.renderer.domElement)
	engineParameters.camera=new THREE.PerspectiveCamera(42,window.innerWidth/window.innerHeight,.001,engineParameters.size)
	engineParameters.stereo=new StereoEffect(engineParameters.renderer)
	engineParameters.stereo.setSize(window.innerWidth,window.innerHeight)
}
// Create cameras
window.createCameras=function(c0){
	engineParameters.camera.zoom=1
  engineParameters.cameras=[]
	let lc0=lsRd('myCamera')
	engineParameters.cameraIndex=lc0==null?1:parseInt(lc0)
	// Chase camera
	registerCamera(modelsParameters.driveVehicleIndex[playerParameters.index]!=null?.65:.86,modelsParameters.driveVehicleIndex[playerParameters.index]!=null?.5:orientation==0?.3:.36,0,c0)
	// First person camera
  registerCamera(modelsParameters.driveVehicleIndex[playerParameters.index]!=null?.65:.86,.015,1,c0)
	// Aerial camera
	registerCamera(orientation==0?.86:1,modelsParameters.driveVehicleIndex[playerParameters.index]!=null?4:orientation==0?1.2:2,2,c0)
	// Orbit camera
	registerCamera(orientation==0?1.5:3,orientation==0?1.5:3,3,c0)
}
// Register camera
function registerCamera(ht0,ds0,iC0,c0){
	var cam=new THREE.Object3D()
	cam.position.set(0,playerControlsParameters.height[playerParameters.index]*ht0,-playerControlsParameters.height[playerParameters.index]*ds0)
	if(true){
		playerControlsParameters.player.add(cam)
	}else playerControlsParameters.player.children[iC0]=cam
	engineParameters.cameras.push(cam)
}
// Load environment
function loadEnvironment(c0,sz){
	engineParameters.size=sz
  engineParameters.isWaterLoaded=c0
  engineParameters.scene=new THREE.Scene()
  engineParameters.sun=new THREE.Vector3()
  const waterGeometry=new THREE.PlaneGeometry(engineParameters.size,engineParameters.size)
	if(engineParameters.isWaterLoaded){
		engineParameters.water=new Water(
	    waterGeometry,{
	      textureWidth:512,
	      textureHeight:512,
	      waterNormals:new THREE.TextureLoader().load('assets/images/waternormals.jpg',function(texture){
	        texture.wrapS=texture.wrapT=THREE.RepeatWrapping
	      }),
				alpha:1.0,
	      sunDirection:new THREE.Vector3(),
	      sunColor:0xffffff,
	      waterColor:0x001e0f,
	      distortionScale:3.7,
				side:THREE.DoubleSide,
				fog:true
	    }
	  );
	  engineParameters.water.rotation.x=-Math.PI/2
	  engineParameters.scene.add(engineParameters.water)
	}
	engineParameters.ambientLight=new THREE.AmbientLight(0xaaaaaa)
	engineParameters.scene.add(engineParameters.ambientLight)
  engineParameters.sky=new Sky()
  engineParameters.sky.scale.setScalar(engineParameters.size)
  engineParameters.scene.add(engineParameters.sky)
  let skyUniforms=engineParameters.sky.material.uniforms
  skyUniforms.turbidity.value=8
  skyUniforms.rayleigh.value=2
  skyUniforms.mieCoefficient.value=.004
  skyUniforms.mieDirectionalG.value=.4
  engineParameters.pmremGenerator=new THREE.PMREMGenerator(engineParameters.renderer)
	window.addEventListener('resize',onWindowResize)
}
// Window resize
function onWindowResize(){
	engineParameters.camera.aspect=window.innerWidth/window.innerHeight
  engineParameters.camera.updateProjectionMatrix()
  engineParameters.renderer.setSize(window.innerWidth,window.innerHeight)
	pixelRatio=engineParameters.renderer.getPixelRatio()
	engineParameters.fxaaPass.uniforms.resolution.value.set(1/(window.innerWidth*pixelRatio),1/(window.innerHeight*pixelRatio))
	isVR(true)
}
// Update sun
function updateSun(){
	sunShadowParameters.elevation+=.01
	if(sunShadowParameters.elevation>360)sunShadowParameters.elevation=0
	engineParameters.sun.setFromSphericalCoords(1,THREE.MathUtils.degToRad(90-sunShadowParameters.elevation),THREE.MathUtils.degToRad(sunShadowParameters.azimuth))
	engineParameters.sky.material.uniforms.sunPosition.value.copy(engineParameters.sun)
	if(engineParameters.isWaterLoaded)engineParameters.water.material.uniforms.sunDirection.value.copy(engineParameters.sun).normalize()
	engineParameters.scene.environment=engineParameters.pmremGenerator.fromScene(engineParameters.sky).texture
	engineParameters.sunShadow=updateSunShadow()
	setTimeout(updateSun,5000)
}
// ==== CAMERA CONTROLS ====
// Load orbit controls
window.loadOrbitControl=function(x,y,z){
	engineParameters.orbitControl=new OrbitControls(engineParameters.camera,engineParameters.renderer.domElement)
	engineParameters.orbitControl.maxPolarAngle=Math.PI*.495
	engineParameters.orbitControl.minDistance=1.0
	engineParameters.orbitControl.maxDistance=5
	engineParameters.orbitControl.target.set(x,y,z)
	engineParameters.orbitControl.update()
}
// New raycaster vector positions
window.newRayCasterVectorPostion=function(){
	return{
		raycaster:new THREE.Raycaster(),
		position:new THREE.Vector3(),
		axis:new THREE.Vector3(0,1,0)
	}
}
// Return constants
window.returnConstant=function(sel0,str0){
	if(sel0=='engineSoundGenerator')return new EngineSoundGenerator(str0)
	if(sel0=='carEngine')return new carEngine()
	if(sel0=='contactMaterial')return new CANNON.ContactMaterial(str0[0],str0[1],str0[2])
	if(sel0=='quaternion')return new CANNON.Quaternion()
	if(sel0=='vec3zero')return CANNON.Vec3.ZERO
	if(sel0=='kinematic')return CANNON.Body.KINEMATIC
	if(sel0=='sphere')return new CANNON.Sphere(str0)
	if(sel0=='material')return new CANNON.Material(str0)
	if(sel0=='raycastVehicle')return new CANNON.RaycastVehicle(str0)
	if(sel0=='object3D')return new THREE.Object3D()
	if(sel0=='cannonVec3')return new CANNON.Vec3(str0.x,str0.y,str0.z)
	if(sel0=='bufferGeometryUtils')return BufferGeometryUtils.mergeVertices(str0)
	if(sel0=='trimesh')return new CANNON.Trimesh(str0.vertices,str0.faces)
	if(sel0=='convexPolyhedron')return new CANNON.ConvexPolyhedron(str0)
	if(sel0=='box')return new CANNON.Box(new CANNON.Vec3(str0.x,str0.y,str0.z))
	if(sel0=='body')return new CANNON.Body(str0)
	if(sel0=='threeToCannon')return threeToCannon(str0)
	if(sel0=='Geometry')return new THREE.Geometry.fromBufferGeometry(str0)
	if(sel0=='vector3')return new THREE.Vector3(str0.x,str0.y,str0.z)
	if(sel0=='newVector')return new THREE.Vector3()
	if(sel0=='clock')return clock.getDelta()
	if(sel0=='loopOnce')return THREE.LoopOnce
	if(sel0=='loadAnimation')return new THREE.AnimationMixer(str0)
	if(sel0=='aniMatrix')return new THREE.AnimationMixer(str0)
	if(sel0=='animation'){
		let ani0='readyplayerme/'
		if(playerControlsParameters.animation.includes(str0)||str0.includes('firebasestorage.googleapis.com'))ani0='rigged/'
		return new FBXLoader().setPath('assets/models/animations/'+ani0)
	}
  if(sel0=='boundingBox'){
    var box=new THREE.Box3().setFromObject(str0)
    return {x:(box.max.x-box.min.x)/2,y:(box.max.y-box.min.y)/2,z:(box.max.z-box.min.z)/2}
  }
	if(sel0=='csm')return new CSM(str0)
	if(sel0=='fbx')return new FBXLoader(engineParameters.loadingManager).setCrossOrigin('anonymous').setPath(str0)
	if(sel0=='draco')return new DRACOLoader(engineParameters.loadingManager).setDecoderPath('./assets/js/')
	if(sel0=='gltf')return new GLTFLoader(engineParameters.loadingManager).setCrossOrigin('anonymous').setPath(str0)
	if(sel0=='BasicShadowMap')return THREE.BasicShadowMap
	if(sel0=='PCFShadowMap')return THREE.PCFShadowMap
	if(sel0=='PCFSoftShadowMap')return THREE.PCFSoftShadowMap
	if(sel0=='VSMShadowMap')return THREE.VSMShadowMap
	if(sel0=='NoToneMapping')return THREE.NoToneMapping
	if(sel0=='LinearToneMapping')return THREE.LinearToneMapping
	if(sel0=='ReinhardToneMapping')return THREE.ReinhardToneMapping
	if(sel0=='CineonToneMapping')return THREE.CineonToneMapping
	if(sel0=='ACESFilmicToneMapping')return THREE.ACESFilmicToneMapping
	if(sel0=='effectComposer')return new EffectComposer(engineParameters.renderer)
	if(sel0=='renderPass')return new RenderPass(engineParameters.scene,str0)
	if(sel0=='shaderPass')return new ShaderPass(getDistortionShaderDefinition())
	if(sel0=='rPassMath')return THREE.Math.degToRad(engineParameters.camera.fov*2)
	if(sel0=='uBloomPass')return new UnrealBloomPass(new THREE.Vector2(window.innerWidth,window.innerHeight),.64,.16,.96)
	if(sel0=='fXAAShader')return new ShaderPass(FXAAShader)
	if(sel0=='SimplifyModifier')return new SimplifyModifier()
}
// Load GUI
function loadGUI(sunShadowParameters,updateSun){
  const gui=new GUI()
  const folderSky=gui.addFolder('Sky')
  folderSky.add(sunShadowParameters,'elevation',0,360,.1).onChange(updateSun)
  folderSky.add(sunShadowParameters,'azimuth',-180,180,.1).onChange(updateSun)
  folderSky.open()
	if(engineParameters.isWaterLoaded){
		const waterUniforms=engineParameters.water.material.uniforms
	  const folderWater=gui.addFolder('Water')
	  folderWater.add(waterUniforms.distortionScale,'value',0,8,.1).name('distortionScale')
	  folderWater.add(waterUniforms.size,'value',.1,10,.1).name('size')
	  folderWater.open()
	}
	document.getElementById('world').appendChild(stats.dom)
}
// ==== PHYSICS ====
// Initialize physics
window.initPhysics=function(){
	engineParameters.world=new CANNON.World()
	engineParameters.world.broadphase=new CANNON.SAPBroadphase(engineParameters.world)
	engineParameters.world.gravity.set(0,-9.8,0)
	engineParameters.world.solver.iterations=10
	engineParameters.world.defaultContactMaterial.friction=.001
	engineParameters.world.defaultContactMaterial.restitution=.3
	engineParameters.world.defaultContactMaterial.contactEquationStiffness=1e10
	engineParameters.world.defaultContactMaterial.contactEquationRelaxation=10
	engineParameters.world.defaultContactMaterial.frictionEquationRegularizationTime=3
	engineParameters.genericMaterial=new CANNON.ContactMaterial(engineParameters.world.defaultContactMaterial,new CANNON.Material('terrainMaterial'),{
		friction:.4,
		restitution:.3,
		contactEquationStiffness:1e8,
		contactEquationRelaxation:3
	})
}
// Create player physics material
window.createPhysicsMaterial=function(fr0,rs0){
	let mat=new CANNON.Material()
	engineParameters.world.addContactMaterial(new CANNON.ContactMaterial(engineParameters.genericMaterial,mat,{friction:fr0,restitution:rs0}))
	return mat
}
// Get capsule
window.getCapsule=function(index,kg,ht,x,y,z){
	let cA0=true
	if(modelsParameters.driveVehicleIndex[index]!=null){
		ht/=10
		cA0=false
	}
	var body=new CANNON.Body({mass:kg,material:createPhysicsMaterial(0,0)})
	.addShape(new CANNON.Sphere(ht*.18),new CANNON.Vec3(0,ht*.18,0))
	.addShape(new CANNON.Sphere(ht*.18),new CANNON.Vec3(0,ht-ht*.18,0))
	.addShape(new CANNON.Cylinder(ht*.18,ht*.18,ht-ht*.36,12),new CANNON.Vec3(0,ht/2,0))
	body.id=index
	body.position.set(x,y,z)
	body.angularDamping=cA0
	return body
}
// Generate height field coordinate
window.generateTerrain=async function(terrainMesh,kg){
	const {heightMap,pointDistance,position:[x,y,z]}=terrainMesh
	const terrainShape=new CANNON.Heightfield(heightMap,{elementSize:pointDistance})
	const terrain=new CANNON.Body({mass:kg,shape:terrainShape,material:engineParameters.genericMaterial})
	terrain.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2)
	terrain.position.set(x,y,z)
	return terrain
}
// Load heightfield from mesh
window.loadMeshHeightfield=async function(mesh,fn,pd,kg){
	let terrain
	if(lsRd(fn)==null||lsRd('_set'+fn)!=pd){
		terrain=await createMeshPhysicsHeightfield(mesh,pd,kg)
		lsSv(fn,CircularJSON.stringify(terrain))
		lsSv('_set'+fn,pd)
	}else{
		let heightMap=JSON.parse(lsRd(fn))
		let position=[heightMap.position.x,heightMap.position.y,heightMap.position.z]
		heightMap=JSON.parse('[['+JSON.stringify(heightMap.shapes).split('"data":[[')[1].split(']],"maxValue":')[0]+']]')
		heightMap={pointDistance:pd,position:position,heightMap:heightMap}
		terrain=generateTerrain(heightMap,kg)
	}
	return terrain
}
// generate height field from mesh
async function createMeshPhysicsHeightfield(mesh,pointDistance,kg){
	let newRayCaster=newRayCasterVectorPostion()
	const rayCaster=newRayCaster.raycaster
	const rayCasterPosition=newRayCaster.position
	const upAxis=newRayCaster.axis
	const heightMap=[]
	const geometry=findGeometry(mesh)
	geometry.computeBoundingBox()
	const{
		min:{x:minX,y:minY,z:minZ},
		max:{x:maxX,z:maxZ},
	}=geometry.boundingBox
	const width=maxX-minX
	const length=maxZ-minZ
	const totalX=width/pointDistance+1
	const totalZ=length/pointDistance+1
	const totalSteps=totalX*totalZ
	let currentStep=0
	for(let x=minX;x<=maxX;x+=pointDistance){
		const heightDataRow=[]
		heightMap.push(heightDataRow)
		for(let z=maxZ;z>=minZ;z-=pointDistance){
			rayCasterPosition.set(x,minY,z)
			rayCaster.set(rayCasterPosition,upAxis)
			const y=await calculateMeshSurfaceDistanceByRayCast()
			heightDataRow.push(y)
		}
	}
	const terrainShape=new CANNON.Heightfield(heightMap,{elementSize:pointDistance})
	const heightfield=new CANNON.Body({mass:kg,shape:terrainShape})
	heightfield.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2)
	heightfield.position.set(minX,0,maxZ)
	return heightfield
	function calculateMeshSurfaceDistanceByRayCast(){
		return new Promise((resolve)=>{
			window.setTimeout(()=>{
				currentStep++
				showProgress(((playerParameters.parameters.length-modelsParameters.loaded-1)/(playerParameters.parameters.length)+currentStep/totalSteps/(playerParameters.parameters.length))*80+10+'%','#228b22','Generating...',false)
				const [result]=rayCaster.intersectObject(mesh,true)
				resolve(result.distance)
			})
		})
	}
	function findGeometry(mesh){
		let geometry
		mesh.traverse((child)=>{
			if(!geometry&&child.type==='Mesh'&&child.geometry)geometry=child.geometry
		})
		return geometry
	}
}
// Update camera position
window.updateCamPos=function(){
	if(modelsParameters.driveVehicleIndex[playerParameters.index]==null||engineParameters.cameraIndex==engineParameters.cameras.length-1){
		playerControlsParameters.player.position.copy(modelsParameters.meshesData[playerParameters.index].position)
		engineParameters.orbitControl.target.set(playerControlsParameters.player.position.x,playerControlsParameters.player.position.y+playerControlsParameters.height[playerParameters.index],playerControlsParameters.player.position.z)
		engineParameters.orbitControl.maxDistance=modelsParameters.driveVehicleIndex[playerParameters.index]!=null?9:5
		engineParameters.orbitControl.update()
	}else{
		playerControlsParameters.player.position.copy(compensateForce(modelsParameters.meshesData[playerParameters.index].position,modelsParameters.vehicle[modelsParameters.driveVehicleIndex[playerParameters.index]].chassisBody.velocity,.032))
	}
	if(engineParameters.cameraIndex<engineParameters.cameras.length-1){
		engineParameters.camera.position.lerp(engineParameters.cameras[engineParameters.cameraIndex].getWorldPosition(returnConstant('newVector')),modelsParameters.driveVehicleIndex[playerParameters.index]!=null?1:engineParameters.cameraIndex==1?1:isPlayerFalling(playerParameters.index,-9)?.16:(stickLD[playerParameters.index]=='C'&&stickRD[playerParameters.index]=='C')?.05:.5)
		let pH0=playerControlsParameters.height[playerParameters.index]
		if(modelsParameters.driveVehicleIndex[playerParameters.index]!=null){
			pH0*=.65
		}else pH0*=.86
		const pos=playerControlsParameters.player.position.clone()
		pos.y+=pH0+engineParameters.lookElevation
		engineParameters.camera.lookAt(pos)
	}
	if(modelsParameters.driveVehicleIndex[playerParameters.index]!=null)playerControlsParameters.player.quaternion.copy(modelsParameters.meshesData[playerParameters.index].quaternion)
	if(engineParameters.cameraIndex==engineParameters.cameras.length-1&&engineParameters.camera.position.y<playerControlsParameters.player.position.y+playerControlsParameters.height[playerParameters.index])engineParameters.camera.position.y+=.01
	return true
}
// Update physics
window.updatePhysics=function(){
	let delta=returnConstant('clock')
	let deltaTime=Math.min(.05,delta)/5
	isWaterFog()
	for(let up0=0;up0<modelsParameters.meshesData.length;up0++){
		if(engineParameters.scene.children[modelsParameters.meshIndex[up0]]!=undefined){
			try{
				if(!isFirstPerson(up0))modelsParameters.playerMixers[up0].update(delta)
			}catch(err){}
			updateStickXY(up0)
			playerControls(deltaTime,up0)
			playerControlsParameters.velocity[up0].addScaledVector(playerControlsParameters.velocity[up0],Math.exp(-4*deltaTime)-1)
			let act=playArtificialBehaviours(up0,'update')
			if(prevAct[up0]!=act&&act!='none'){
				prevAct[up0]=act
				loadFBXAnim(prevAct[up0]+'.fbx',engineParameters.scene.children[modelsParameters.meshIndex[up0]],up0,false,true)
			}
			if(engineParameters.isWaterLoaded)updateBuoyancy(up0,'player')
			adjustColliderPosition(up0,true)
		}
	}
  for(let up0=0;up0<modelsParameters.objectMeshes.length;up0++){
		try{
			if(engineParameters.isWaterLoaded)updateBuoyancy(up0,'object')
			let offset
			if(engineParameters.objectOffset[up0]!=null){
				offset={
					x:engineParameters.objectPhysics[up0].position.x-engineParameters.objectOffset[up0].x,
					y:engineParameters.objectPhysics[up0].position.y-engineParameters.objectOffset[up0].y,
					z:engineParameters.objectPhysics[up0].position.z-engineParameters.objectOffset[up0].z,
				}
			}else{
				offset=engineParameters.objectPhysics[up0].position
				engineParameters.scene.children[modelsParameters.objMeshIndex[up0]].quaternion.copy(engineParameters.objectPhysics[up0].quaternion)
			}
			engineParameters.scene.children[modelsParameters.objMeshIndex[up0]].position.copy(offset)
			if(modelsParameters.objectMixers[up0]!==undefined)modelsParameters.objectMixers[up0].update(delta)
		}catch(err){}
	}
	return true
}
// Underwater fog
function isWaterFog(){
	let fG0=engineParameters.camera.position.y>0
	if(fG0!=engineParameters.underFog){
		if(engineParameters.isWaterLoaded||engineParameters.underFog===undefined){
			let fC0
			if(sunShadowParameters.elevation<180){
				fC0=0xaeb1b2
			}else fC0=0x001e0f
			if(!fG0){
				engineParameters.scene.fog=new THREE.FogExp2(fC0,.05)
			}else engineParameters.scene.fog=new THREE.FogExp2(fC0,.0025)
		}
		engineParameters.underFog=fG0
	}
}
// Update collider position
function adjustColliderPosition(up0,ac0){
	let am0=0,am1=1
	modelsParameters.meshesData[up0].position.x=playerControlsParameters.physics[up0].position.x
	modelsParameters.meshesData[up0].position.z=playerControlsParameters.physics[up0].position.z
	if(modelsParameters.driveVehicleIndex[up0]==null){
		if(ac0&&!playerControlsParameters.onfloor[up0]){
			if(isPlayerFalling(up0,-40)&&prevAct[up0]=='Falling')am0=-playerControlsParameters.height[up0]-.3
			if(prevAct[up0]=='FallingIdle'||prevAct[up0]=='Flying'||prevAct[up0]=='Floating')am0=-.3
			am1=isPlayerFalling(up0,-1)?.5:.2
		}else am0=playerControlsParameters.offset[up0]
		modelsParameters.meshesData[up0].position.y=modelsParameters.meshesData[up0].position.y+(playerControlsParameters.physics[up0].position.y+am0-modelsParameters.meshesData[up0].position.y)*am1
		if(playerControlsParameters.invertQuaternion[up0]!==null){
			playerControlsParameters.player.quaternion.copy(modelsParameters.meshesData[playerParameters.index].quaternion)
			playerControlsParameters.invertQuaternion[up0]=null
		}
	}else{
		let cPos,cQua
		if(modelsParameters.chassisMeshIndex[modelsParameters.driveVehicleIndex[up0]]!==undefined){
			if(engineParameters.scene.children[modelsParameters.chassisMeshIndex[modelsParameters.driveVehicleIndex[up0]]].name!='chassis')updateMeshIndex()
			cPos=engineParameters.scene.children[modelsParameters.chassisMeshIndex[modelsParameters.driveVehicleIndex[up0]]].position
			cQua=engineParameters.scene.children[modelsParameters.chassisMeshIndex[modelsParameters.driveVehicleIndex[up0]]].quaternion
			modelsParameters.driveAnchor[modelsParameters.driveVehicleIndex[up0]].position.copy(compensateForce(cPos,modelsParameters.vehicle[modelsParameters.driveVehicleIndex[up0]].chassisBody.velocity,.018))
			modelsParameters.driveAnchor[modelsParameters.driveVehicleIndex[up0]].position.y+=modelsParameters.driveAnchor[modelsParameters.driveVehicleIndex[up0]].offset
			modelsParameters.driveAnchor[modelsParameters.driveVehicleIndex[up0]].quaternion.copy(cQua)
			playerControlsParameters.physics[up0].position.copy(modelsParameters.driveAnchor[modelsParameters.driveVehicleIndex[up0]].position)
			playerControlsParameters.physics[up0].quaternion.copy(cQua)
			if(playerControlsParameters.invertQuaternion[up0]===null){
				modelsParameters.meshesData[up0].rotation.set(0,0,0)
				modelsParameters.meshesData[up0].rotation.y+=Math.PI/180*90
				playerControlsParameters.invertQuaternion[up0]=new THREE.Quaternion().multiply(modelsParameters.meshesData[up0].quaternion.invert())
			}
			modelsParameters.meshesData[up0].quaternion.multiplyQuaternions(cQua,playerControlsParameters.invertQuaternion[up0])
			modelsParameters.meshesData[up0].position.lerp(modelsParameters.driveSeat[modelsParameters.driveVehicleIndex[up0]][playerControlsParameters.mySeat[up0]].getWorldPosition(returnConstant('newVector')),1)
		}else switchDriving(up0,false)
	}
	return true
}
// Update buoyancy
function updateBuoyancy(up0,by0){
	if(by0=='player'){ // Prevent player to sink underwater further
		playerControlsParameters.physics[up0].mass=playerControlsParameters.mass[up0]
		if(playerControlsParameters.onfloor[up0]==false){
			if(modelsParameters.meshesData[up0].position.y<(playerControlsParameters.height[up0]+.5)*-1){
				playerControlsParameters.physics[up0].velocity.y/=1.1
				playerControlsParameters.physics[up0].mass=-playerControlsParameters.mass[up0]/5
				playerSlowDown(up0,1.1)
			}else if(modelsParameters.meshesData[up0].position.y<(playerControlsParameters.height[up0]-.45)*-1){
				if(playerControlsParameters.physics[up0].velocity.y>.1)playerControlsParameters.physics[up0].velocity.y/=1.05
				playerControlsParameters.physics[up0].mass=-playerControlsParameters.mass[up0]/600
			}else if(modelsParameters.meshesData[up0].position.y<(playerControlsParameters.height[up0]-.6)*-1)playerControlsParameters.physics[up0].mass=playerControlsParameters.mass[up0]/5
		}else if(modelsParameters.meshesData[up0].position.y<(playerControlsParameters.height[up0]-.3)*-1)isJumpForwardBackward(up0)
		if(modelsParameters.meshesData[up0].position.y<-.3&&playerControlsParameters.velocity[up0]<-2)playerControlsParameters.onfloor[up0]=false
	}
	if(by0=='object'){ // Prevent object to sink underwater further
		let mI0=modelsParameters.objMeshIndex[up0]
		if(engineParameters.scene.children[mI0].position.y<-3){
			engineParameters.objectPhysics[up0].velocity.y/=1.05
			engineParameters.objectPhysics[up0].mass=-engineParameters.objectMass[up0]/2
		}else if(engineParameters.scene.children[mI0].position.y<-1.5){
			engineParameters.objectPhysics[up0].mass=-engineParameters.objectMass[up0]/20
		}else if(engineParameters.scene.children[mI0].position.y<-1){
			engineParameters.objectPhysics[up0].mass=-engineParameters.objectMass[up0]/200
		}else if(engineParameters.scene.children[mI0].position.y<-.5){
			if(engineParameters.objectPhysics[up0].velocity.y>.1)engineParameters.objectPhysics[up0].velocity.y/=1.05
			engineParameters.objectPhysics[up0].mass=engineParameters.objectMass[up0]/750
		}else if(engineParameters.scene.children[mI0].position.y<0){
			engineParameters.objectPhysics[up0].mass=engineParameters.objectMass[up0]/1500
		}else engineParameters.objectPhysics[up0].mass=engineParameters.objectMass[up0]
	}
}
// Object collision
window.objectCollision=function(body){
	body.addEventListener('collide',function(e){
		if(engineParameters.updateObjectsBusy==undefined){
			let iF0=(e.body.velocity.x<0?-e.body.velocity.x:e.body.velocity.x+e.body.velocity.y<0?-e.body.velocity.y:e.body.velocity.y+e.body.velocity.z<0?-e.body.velocity.z:e.body.velocity.z)/30
			iF0=iF0>1?1:iF0<.01?.01:iF0
			if(engineParameters.isCollisionBusy===undefined){
				engineParameters.isCollisionBusy=true
				if(isPlayersIndex(e.body.id)){
					if(playerControlsParameters.onfloor[e.body.id]==false){
						playerControlsParameters.onfloor[e.body.id]=true
						let act=playArtificialBehaviours(e.body.id,'terrain')
						adjustColliderPosition(e.body.id,false)
						if(isMovingJump(e.body.id)||stickLD[e.body.id]=='C'){
							playerSlowDown(e.body.id,7)
						}else playerSlowDown(e.body.id,1.2)
						if(prevAct[e.body.id]!=act&&act!='none'){
							prevAct[e.body.id]=act
							if(act.match(/(Dying|FlatImpact)/))engineParameters.cameraIndex=2
							loadFBXAnim(act+'.fbx',engineParameters.scene.children[modelsParameters.meshIndex[e.body.id]],e.body.id,false,true)
							if(act.match(/(Dying|FlatImpact)/))playerControlsParameters.alive[e.body.id]=false
							if(act=='FallingFlatImpact')playerControlsParameters.physics[e.body.id].velocity.y=-playerControlsParameters.physics[e.body.id].velocity.y/5
						}
					}
				}else try{
					if(engineParameters.sound&&engineParameters.archive[e.body.id-10000].objectIndex!==undefined){
						let ds0=getObjectDistance(engineParameters.archive[e.body.id-10000].objectIndex)
						if(ds0!==undefined){
							if(engineParameters.objectSounds[e.body.id-10000].hit!==undefined){
								try{
									let sh=engineParameters.objectSounds[e.body.id-10000].hit
									if(sh!==undefined&&sh!=null&&sh!=''){
										sh.currentTime=0
										sh.loop=false
										sh.volume=((1/ds0>1?1:1/ds0)+iF0*2)/3
										sh.play()
									}
								}catch(err){}
							}
						}
					}
				}catch(err){}
				engineParameters.isCollisionBusy=undefined
			}
		}
	})
}
// ==== ANIMATION ====
// Get random string
window.randomString=function(rs0){
	return rs0[Math.floor(Math.random()*rs0.length)]
}
// Play player artificial behaviours
window.playArtificialBehaviours=function(ai0,ca){
	let act='none'
	if(isMovingJump(ai0)&&isPlayersIndex(ai0)){
		if(ca=='update'){
			if(isPlayerFalling(ai0,-2)&&modelsParameters.meshesData[playerParameters.index].position.y<-.3&&$('#menuOption').css('display')=='none')showMenu()
			if(playerControlsParameters.onfloor[ai0]){
				if(isPlayerFalling(ai0,-20)||isPlayersEscaping(ai0,9)){
					if(playerControlsParameters.onfloor[ai0])act='Floating'
					playerControlsParameters.onfloor[ai0]=false
				}else if(isPlayersEscaping(ai0,1)&&playerControlsParameters.onfloor[ai0])playerControlsParameters.physics[ai0].velocity.y=playerControlsParameters.physics[ai0].velocity.y/2
			}
			if(isAboveWater(ai0,-.3)){
				if(!playerControlsParameters.onfloor[ai0]){
					if(playerControlsParameters.physics[ai0].velocity.y.toFixed(1)==0){
						setTimeout(function(){
							if(playerControlsParameters.physics[ai0].velocity.y.toFixed(1)==0)playerControlsParameters.onfloor[ai0]=true
						},2400)
					}
					if(!prevAct[ai0].match(/(FallingIdle|Flying|JumpingUp)/)){
						if(playerControlsParameters.physics[ai0].velocity.y>5&&stickLD[ai0]=='C')act='Floating'
						if(isPlayerFalling(ai0,-1)&&isPlayersEscaping(ai0,-40)){
							playerControlsParameters.physics[ai0].material.friction=.00001
							act='FallingIdle'
						}
					}
				}else if(isPlayerFalling(ai0,-2))playerControlsParameters.onfloor[ai0]=false
			}
		}
		if(ca=='player'){
			if(playerControlsParameters.onfloor[ai0]){
				if(stickLD[ai0]!='C'){
					act='JumpingUp'
				}else{
					act=randomString(playerHit)
					playerControlsParameters.stunned[ai0]=true
				}
			}else if(isAboveWater(ai0,-.3)){
				if(stickLD[ai0]!='C'){
					act='JumpingUp'
				}else act='FallingToLanding'
			}else act='Floating'
		}
	}
	if(ca=='mixer'){
		playerControlsParameters.stunned[ai0]=false
		if(playerControlsParameters.onfloor[ai0]){
			if(isAboveWater(ai0,-.9)&&stickLD[ai0]=='C'&&stickLA[ai0]!='GettingUp')act=randomString(standIdle)
		}else if(engineParameters.isWaterLoaded&&modelsParameters.meshesData[ai0].position.y<-.9&&stickLA[ai0]!='Swimming'){
			act='TreadingWater'
		}else{
			if(isAboveWater(ai0,-.9)){
				if(isPlayerFalling(ai0,-40)||stickLA[ai0]=='Flying'){
					act='Falling'
				}else if(isPlayersEscaping(ai0,10)){
					act='Floating'
				}else act='FallingIdle'
			}
		}
	}
	if(ca=='terrain'){
		if(isAboveWater(ai0,-.9)){
			if(isPlayerFalling(ai0,-30)&&$('#menuOption').css('display')=='none')showMenu()
			if(isPlayerFalling(ai0,-50)){
				act='FallingFlatImpact'
			}else if(isPlayerFalling(ai0,-40)){
				act='Dying'
			}else if(isPlayerFalling(ai0,-30)){
				act='DyingBackwards'
			}else if(stickLD[ai0]=='C'||stickLA[ai0].match(/(Walking|WalkingBackwards)/)||stickLA[ai0].includes('Left')||stickLA[ai0].includes('Right')){
				if(stickLD[ai0]=='C')playerControlsParameters.physics[ai0].material.friction=0
				act='FallingToLanding'
			}else act=isJumpForwardBackward(ai0)
		}
	}
	if(modelsParameters.driveVehicleIndex[ai0]!=null)act='Driving'
	return act
}
// Check if jump forward or backward
function isJumpForwardBackward(jp0){
	let jv0=.1,act='none'
	if(isMovingJump(jp0)&&isAboveWater(jp0,-.3)){
		if(stickLA[jp0].match(/(RunningBackward|SlowJogBackwards)/)){
			if(isPlayerFalling(jp0,-1)&&stickLA[jp0]=='RunningBackward'){
				act='BackwardJump'
				jv0=.15
			}else if(isPlayersEscaping(jp0,-2)){
				act='BackFlip'
				jv0=.5
			}
		}
		if(stickLA[jp0].match(/(Running|RunningFast|Flying)/)&&!stickLA[jp0].match(/(Back|Strafe)/)){
			if(isPlayerFalling(jp0,-1)&&stickLA[jp0].match(/(RunningFast|Flying)/)){
				act='ForwardJump'
				jv0=.25
			}else if(isPlayersEscaping(jp0,-2)){
				act='RunningForwardFlip'
				jv0=.15
			}
		}
	}
	playerControlsParameters.velocity[jp0].y+=1.6*jv0
	playerControlsParameters.physics[jp0].velocity.y=playerControlsParameters.velocity[jp0].y
	playerControlsParameters.onfloor[jp0]=false
	return act
}
// ==== MULTIPLAYER CODES ====
// Check if multiplayer
function isMultiplayer(){
	if(vAIn&&playerParameters.online){
		return true
	}else return false
}
// Update player activity online
window.updateActivity=function(ua0){
	if(parseInt(onlinePosition.update)+2<parseInt(cDtTm())||ua0.match(/(horn|drivevehicle|exitvehicle|replay|halt|change|wave|jump|replay|leave)/)){
		onlinePosition.update=cDtTm()
		let act,x,y,z,o,ov0=playerParameters.index
		if(ua0.match(/(horn|drivevehicle|exitvehicle|replay|halt|change|wave|jump|replay|leave)/)){
			act=ua0
			ua0=true
		}else act=prevAct[ov0]
		if(ua0!='none'||playerParameters.levelName!==undefined&&$('#loadingBar').css('display')=='none'){
			x=parseInt(playerControlsParameters.physics[ov0].position.x*10)/10
			y=parseInt(playerControlsParameters.physics[ov0].position.y*10)/10
			z=parseInt(playerControlsParameters.physics[ov0].position.z*10)/10
			o=parseInt(modelsParameters.meshesData[ov0].rotation.y*10)/10
			if(ua0!='none'||onlinePosition.x!=x||onlinePosition.z!=z||onlinePosition.o!=o){
				updateModels()
				if(isMultiplayer()&&isOnL()){
					onlinePosition.x=x
					onlinePosition.y=y
					onlinePosition.z=z
					onlinePosition.o=o
					let carState={stickLY:null,stickRX:null,gear:null,forwardForce:null,reverseForce:null,brakeForce:null}
					if(modelsParameters.driveVehicleIndex[ov0]!=null){
						carState.stickLY=modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[ov0]].stickLY
						carState.stickRX=modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[ov0]].stickRX
						carState.gear=modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[ov0]].gear
						carState.forwardForce=modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[ov0]].forwardForce
						carState.reverseForce=modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[ov0]].reverseForce
						carState.brakeForce=modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[ov0]].brakeForce
					}
					onSv(engineName.toLowerCase()+'/'+playerParameters.levelName+'/'+myUserID.uid+'/',{
						type:'player',
						path:playerParameters.path,
						model:playerParameters.model,
						animation:act,
						update:cDtTm(),
						x:x,
						y:y,
						z:z,
						o:o,
						ht:playerControlsParameters.height[ov0],
						kg:playerControlsParameters.mass[ov0],
						of:playerControlsParameters.offset[ov0],
						name:myUserID.name,
						carState:carState,
					})
					setTimeout(function(){
						onRd(engineName.toLowerCase()+'/transfers/'+myUserID.uid+'/',['amount','name'],`receiveTransfer()`)
					},600)
				}
			}
		}
	}
}
// Add my model
window.addMyModel=function(fn,x,y,z,o,sc,typ,kg){
	let nw0={
		type:'model',
		model:fn,
		id:genRan(charString,9),
		x:x,
		y:y,
		z:z,
		o:o,
		sc:sc,
		typ:typ,
		kg:kg,
	}
	engineParameters.models.push(nw0)
	onSv(engineName.toLowerCase()+'/'+playerParameters.levelName+'/'+myUserID.uid+'/',nw0)
	setTimeout(function(){
		onSv(engineName.toLowerCase()+'/models/'+playerParameters.levelName+'/',engineParameters.models)
	},300)
}
// Load level new models
window.loadNewModels=function(){
	if(onRe.data[0]!=null){
		let br0=lsRd('brokenurl')
		if(br0!=null){
			engineParameters.broken=JSON.parse(br0)
		}else engineParameters.broken=[]
		br0=false
		engineParameters.models=[]
		for(let nw1=0;nw1<onRe.data[0].length;nw1++){
			if(engineParameters.broken.includes(onRe.data[0][nw1].model)){
				delete onRe.data[0][nw1]
				br0=true
			}else{
				engineParameters.models.push(onRe.data[0][nw1])
				loadingNewModels(onRe.data[0][nw1])
			}
		}
		if(br0){
			onSv(engineName.toLowerCase()+'/models/'+playerParameters.levelName+'/',engineParameters.models)
			lsEr('brokenurl')
		}
	}
}
// ==== NAVIGATE PLAYERS POSITION ====
// Load new models
function loadingNewModels(ln0){
	loadObject(ln0.model.match(/(fbx)/)?'fbx':'gltf','',ln0.model,ln0.x,ln0.y,ln0.z,ln0.o,ln0.sc,false,ln0.typ,ln0.kg,null,false)
}
// Load object
window.loadObject=function(ft,fp,fn,x,y,z,o,sc,iL0,typ,kg,of,cm,ds,obID,pn){
	if(ft=='fbx')loadFBX(fp,fn,[x],[y],[z],[o],[sc],iL0,typ,null,[kg],1,false,false,false,of,cm,ds,[obID],pn)
	if(ft.match(/(gltf|glb)/))loadGlft(fp,fn,[x],[y],[z],[o],[sc],!typ.match(/(terrain|heightmap)/),iL0,typ,null,[kg],1,false,false,false,of,cm,ds,[obID],pn)
	if(ft=='file')showDialog('file.png','Unable to load file, because the file format is not an fbx or gltf model','','Dismiss')
}
// Check if within height
function isInHeight(sY0,dH0){
	return sY0<modelsParameters.meshesData[playerParameters.index].position.y+dH0&&sY0>modelsParameters.meshesData[playerParameters.index].position.y-dH0
}
// Is player in range
function isInRange(oB0,fDs){
	return fDs>getVectorDistance(modelsParameters.meshesData[playerParameters.index].position.x,
oB0.x,modelsParameters.meshesData[playerParameters.index].position.z,oB0.z).distance&&isInHeight(oB0.y,fDs)
}
// Navigate players position
window.updatePlayersTarget=function(){
	if(isMultiplayer()&&isOnL()&&onRe.target.type!==undefined){
		onlineMultiplayer.ready=false
		if(onRe.target.type.match(/(player)/)){
			if(!onlineMultiplayer.uid.includes(onRe.key)){
				if(onlineMultiplayer.uid.length==0){
					onlineMultiplayer.uid.push(myUserID.uid)
					onlineMultiplayer.target.push(null)
				}else{
					if(parseInt(onRe.target.update)+10>cDtTm()&&onlineMultiplayer.uid.length<(meAndF?5:isMobile?10:40)&&isInRange(onRe.target,playerParameters.proximity)){
						onlineMultiplayer.uid.push(onRe.key)
						onlineMultiplayer.target.push(onRe.target)
						loadPlayerMesh(onRe.target.path,onRe.target.model,true,onRe.target.x,onRe.target.y,onRe.target.z,onRe.target.o,1,onlineMultiplayer.target.length-1,onRe.target.ht,onRe.target.kg,false,0,onRe.target.of)
					}
				}
			}
			if(onRe.key!=myUserID.uid){
				for(let uo0=0;uo0<modelsParameters.meshesData.length;uo0++){
					if(uo0!=playerParameters.index&&modelsParameters.meshesData[uo0].name==onRe.key){
						let oI0=modelsParameters.meshIndex[uo0]
						if(onlineMultiplayer.target[uo0].model!=onRe.target.model)loadPlayerMesh(onRe.target.path,onRe.target.model,true,onRe.target.x,onRe.target.y,onRe.target.z,onRe.target.o,1,uo0,onRe.target.ht,onRe.target.kg,true,0,onRe.target.of)
						if(!stickLA[uo0].match(/(Falling|FallingIdle|Flying|Walking|Running|RunningFast)/)){
							if(onRe.target.animation.match(/(leave)/)||!isInRange(onRe.target,playerParameters.proximity)){
								unloadModel('player',uo0)
								onlineMultiplayer.uid=deleteArray(onlineMultiplayer.uid,uo0)
								delete onlineMultiplayer.target[uo0]
								onlineMultiplayer.target=JSON.parse(JSON.stringify(onlineMultiplayer.target).replace(',null',''))
								onlineMultiplayer.ready=true
								return
							}
							if(onRe.target.animation.match(/(halt)/))loadFBXAnim(randomString(standIdle)+'.fbx',engineParameters.scene.children[oI0],uo0,false,true)
							if(onRe.target.animation.match(/(wave)/)&&modelsParameters.driveVehicleIndex[uo0]==null)loadFBXAnim('Waving.fbx',engineParameters.scene.children[oI0],uo0,false,false)
						}
						if(onRe.target.animation.match(/(jump)/)&&modelsParameters.driveVehicleIndex[uo0]==null)jumpLD[uo0]=true
						onlineMultiplayer.target[uo0]=onRe.target
						if(onRe.target.animation.match(/(replay)/)){
							if(modelsParameters.driveVehicleIndex[uo0]==null){
								playerControlsParameters.physics[uo0].position.set(onRe.target.x,onRe.target.y,onRe.target.z)
								playerControlsParameters.physics[uo0].velocity.y=0
								modelsParameters.meshesData[uo0].position.copy(playerControlsParameters.physics[uo0].position)
								engineParameters.scene.children[oI0].position.copy(playerControlsParameters.physics[uo0].position)
								if(!playerControlsParameters.alive[uo0]){
									playerControlsParameters.alive[uo0]=true
									prevAct[uo0]='GettingUp'
									loadFBXAnim(prevAct[uo0]+'.fbx',engineParameters.scene.children[oI0],uo0,false,true)
								}
							}
						}
						if(onRe.target.animation.match(/(drivevehicle)/))getNearVehicle(uo0,true)
						if(onRe.target.animation.match(/(exitvehicle)/))switchDriving(uo0,false)
						if(onRe.target.animation.match(/(horn)/)){
							if(onRe.target.animation.match(/(hornstop)/)){
								playSounds[17].pause()
								playSounds[17].currentTime=0
							}else{
								let vH0=getVectorDistance(modelsParameters.meshesData[playerParameters.index].position.x,onRe.target.x,modelsParameters.meshesData[playerParameters.index].position.z,onRe.target.z).distance
								playSounds[17].volume=1/vH0>1?1:1/vH0
								playSounds[17].play()
							}
						}
						if(modelsParameters.driveVehicleIndex[uo0]!=null&&onRe.target.carState!=undefined){
							modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[uo0]].stickLY=onRe.target.carState.stickLY
							modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[uo0]].stickRX=onRe.target.carState.stickRX
							modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[uo0]].gear=onRe.target.carState.gear
							modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[uo0]].forwardForce=onRe.target.carState.forwardForce
							modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[uo0]].reverseForce=onRe.target.carState.reverseForce
							modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[uo0]].brakeForce=onRe.target.carState.brakeForce
						}
						if(parseInt(onRe.target.update)+1500<parseInt(cDtTm()))onEr(engineName.toLowerCase()+'/'+playerParameters.levelName+'/'+onRe.key)
					}
				}
			}
		}
		if(onRe.target.type.match(/(model)/)&&onRe.key!=myUserID.uid){
			if(!engineParameters.addedModels.includes(onRe.target.id)){
				engineParameters.models.push(onRe.target)
				engineParameters.addedModels.push(onRe.target.id)
				loadingNewModels(onRe.target)
			}
		}
		onlineMultiplayer.ready=true
	}
}
// ==== NOTIFICATION ====
// Update notification
window.updateNotification=function(){
	if(!onRe.contacts.includes(onRe.contact)){
		let fn
		onRe.contacts.push(onRe.contact)
		if(onRe.target.model!=null){
			fn=onRe.target.model.replace('.glb','')
		}else fn='onlineAvatar'
		if(playerParameters.online)saveNewContact(onRe.contact,fn,onRe.target.name)
		if($('#notifyDot').css('display')=='none')$('#notifyDot').fadeIn('slow')
		if(engineParameters.sound)playSounds[3].play()
	}
}
// ==== MESSAGING ====
// Verify message before sending
window.sendMessage=function(uid){
	let m0
	if(vAIn&&isOnL()&&$('#sendMessage').val()!=''){
		let p0=getPolarity(uid)
		if(p0==myUserID.uid+uid){
			m0='/messageA/'
		}else m0='/messageB/'
		let fKey=engineName.toLowerCase()+'/'+playerParameters.levelName+'messages/'+p0+m0
		fExst(fKey,'message',`opSendMessage('`+fKey+`','`+uid+`')`)
	}else{
		$('#optionWindow').fadeOut('slow')
		$('#contactWindow').fadeOut('slow')
		$('#contactChat').fadeOut('slow')
		$('#contactICON').fadeIn('slow')
		if($('#sendMessage').val()!=''){
			m0=`Your message was not sent, because you're not connected to the internet`
		}else m0=`Unable to send, because there is no message`
		showDialog('nointernet.png',m0,'','Dismiss')
	}
}
// Send message
window.opSendMessage=function(fKey,uid){
	let m0=[],s0
	if(onRe.exist){
		s0=lsRd('to'+myUserID.contact)
		if(s0!=null)m0=JSON.parse(s0)
	}
	m0.push($('#sendMessage').val())
	s0=JSON.stringify(m0)
	lsSv('to'+myUserID.contact,s0)
	let dte=cNow()
	onSv(fKey,{
		message:JSON.stringify(m0),
		datetime:dte,
		profile:myUserID.profile,
	})
	let msg=[$('#sendMessage').val()]
	$('#sendMessage').val('')
	saveMessage(myUserID.uid,msg,dte)
	if($('#chatMessageList').html().includes(dte))dte=''
	$('#chatMessageList').html($('#chatMessageList').html().replace(/<br><br><br>/g,''))
	let tg=genRan(charString,9)
	$('#chatMessageList').html($('#chatMessageList').html()+messageBubble(msg,dte,'end','right',tg)+'<br><br><br>')
	eScrl(tg,'center')
	onSv(engineName.toLowerCase()+'/notifications/'+uid+'/'+myUserID.uid+'/',oRyt(`{when:cNow()}`))
	setTimeout(function(){$('#sendMessage').focus()},100)
	saveNewContact(uid,$('#contactModel').text(),$('#contactName').text())
}
// Save new contact
function saveNewContact(uid,fn,nm){
	if(isMyContacts(JSON.stringify(onlineMultiplayer.myContacts),uid)){
		for(let i=0;i<onlineMultiplayer.myContacts.uid.length;i++){
			if(onlineMultiplayer.myContacts.uid[i]==uid)onlineMultiplayer.myContacts.data[i].name=nm
		}
	}else{
		onlineMultiplayer.myContacts.uid.push(uid)
		onlineMultiplayer.myContacts.data.push({path:'none',model:fn,name:nm})
	}
	lsSv('myContacts',JSON.stringify(onlineMultiplayer.myContacts))
}
// Check is uid is myContacts
function isMyContacts(s0,uid){
	if(onlineMultiplayer.myContacts==null){
		s0=lsRd('myContacts')
		if(s0==null){
			s0=''
			onlineMultiplayer.myContacts={uid:[],data:[]}
		}else onlineMultiplayer.myContacts=JSON.parse(s0)
	}
	return s0.includes(uid)
}
// Save received messages
function saveMessage(uid,msg,dte){
	let m0=[],s0=lsRd('rx'+myUserID.contact)
	if(s0!=null)m0=JSON.parse(s0)
	m0.push({uid:uid,message:msg,datetime:dte})
	s0=JSON.stringify(m0)
	lsSv('rx'+myUserID.contact,s0)
}
// Message bubble
function messageBubble(m0,d0,se,lr,tg){
	return `<div class="chatMessageBubble" style="align-self:flex-`+se+`" id="`+tg+`">`+m0+`</div>
		<span style="font-size:10px;margin-`+lr+`:9px;text-align:`+lr+`">`+d0+`</span>`
}
// Receive message
window.receiveMessage=function(fKey){
	if(onRe.data[0]!=null){
		saveMessage(myUserID.contact,onRe.data[0],onRe.data[1])
		if(onRe.data[2]!=null)lsSv('profile'+myUserID.contact,onRe.data[2])
		let m0='',m2=JSON.parse(onRe.data[0])
		for(let m1=0;m1<m2.length;m1++)m0+=m2[m1]+'<br>'
		if($('#chatMessageList').html().includes(onRe.data[1]))onRe.data[1]=''
		$('#chatMessageList').html($('#chatMessageList').html().replace(/<br><br><br>/g,''))
		let tg=genRan(charString,9)
		$('#chatMessageList').html($('#chatMessageList').html()+messageBubble(m0,onRe.data[1],'start','left',tg)+'<br><br><br>')
		eScrl(tg,'center')
	}
	lsEr('to'+myUserID.uid)
	onEr(fKey)
	onFdb(engineName.toLowerCase()+'/'+playerParameters.levelName+'messages/'+getPolarity(myUserID.contact))
}
// Receive notification
window.notifyReceiver=function(data){
	if(myUserID.update==null||parseInt(myUserID.update)<parseInt(cDtTm())){
		ofFdb(engineName.toLowerCase()+'/'+playerParameters.levelName+'messages/'+getPolarity(myUserID.contact))
		myUserID.update=cDtTm()
		let m0,p0=getPolarity(myUserID.contact)
		if(p0==myUserID.contact+myUserID.uid){
			m0='/messageA/'
		}else m0='/messageB/'
		let fKey=engineName.toLowerCase()+'/'+playerParameters.levelName+'messages/'+p0+m0
		onRd(fKey,['message','datetime','profile'],`receiveMessage('`+fKey+`')`)
	}
}
// Get message polarity
function getPolarity(uid){
	if(uid>myUserID.uid){
		return uid+myUserID.uid
	}else return myUserID.uid+uid
}
// Load contact messages
window.loadContactMessages=function(mn0){
	let s0=lsRd('rx'+myUserID.contact),se,lr,m2,pr0='',tg
	if(s0!=null){
		let m0=JSON.parse(s0)
		let m5='<br>'
		for(let m1=m0.length>mn0?m0.length-mn0:0;m1<m0.length;m1++){
			if(m0[m1].uid==myUserID.uid){
				se='end'
				lr='right'
				m2=m0[m1].message
			}else{
				se='start'
				lr='left'
				m2=JSON.parse(m0[m1].message)
			}
			let dte=m0[m1].datetime
			let m4=''
			if($('#chatMessageList').html().includes(m0[m1].datetime))dte=''
			if(m2.length>1){
				for(let m3=0;m3<m2.length;m3++)m4+=m2[m3]+'<br>'
			}else m4=m2
			tg=genRan(charString,9)
			m5+=messageBubble(m4,dte,se,lr,tg)
		}
		if(m0.length>mn0)pr0=`<span
				ontouchend="loadContactMessages(`+(mn0+9)+`)"
				onmouseup="if(!isMobile)loadContactMessages(`+mn0+10+`)"
				style="text-align:center">Load previous</span>`
		$('#chatMessageList').html(`<br>`+pr0+m5+`<br><br><br>`)
		if(mn0==9)eScrl(tg,'center')
		setTimeout(function(){$('#sendMessage').focus()},1200)
	}
}
// Load found or saved contacts
function loadSavedContacts(u0,s0,i){
	let n0=''
	if(s0[i].path.includes('assets/models/players')||s0[i].path=='none'){
		fn=s0[i].model.replace('.glb','')
	}else fn='onlineAvatar'
	let im=lsRd('profile'+u0[i])
	if(im==null)im=`assets/models/players/`+fn+`.jpg`
	if(onRe.contacts.includes(u0[i])){
		n0=`<div class="notifyDot" style="margin:4px;z-index:1"></div>`
	}else n0=''
	$('#contactList').html($('#contactList').html()
	+`<div class="dialogbox"
			ontouchend="openContactChat('`+u0[i]+`','`+fn+`','`+s0[i].name+`')"
			onmouseup="if(!isMobile)openContactChat('`+u0[i]+`','`+fn+`','`+s0[i].name+`')"
			style="margin:6px;width:62vw;max-width:600px">
			`+n0+`
			<img class="contactProfileImage" src="`+im+`"
			onerror="$(this).attr('src','assets/models/players/`+fn+`.jpg');lsEr('profile`+u0[i]+`')"/>
			<span>`+s0[i].name+`</span>
		</div>`)
}
// Load contacts
function loadContactList(u0,s0,d0){
	if(s0.length>0){
		$('#contactChat').html('')
		$('#contactList').html('')
		for(let i=0;i<s0.length;i++){
			if(s0[i]!=null){
				if(s0[i].path=='none'){
					loadSavedContacts(u0,s0,i)
				}else for(let j=0;j<modelsParameters.meshesData.length;j++){
					if(modelsParameters.meshesData[j].name==u0[i]&&isInRange(modelsParameters.meshesData[j].position,d0))loadSavedContacts(u0,s0,i)
				}
			}
		}
	}
	if($('#contactList').html()!=''){
		$('#dialogWindow').fadeOut('fast')
		$('#userIDWindow').hide()
		$('#contactWindow').show()
		$('#contactList').show()
		$('#optionWindow').fadeIn('slow')
	}else{
		let m0=`Explore and find people to talk to`
		if(!isOnL())m0=`Cannot load contacts, because you're not connected to the internet`
		showDialog('closeby.png',m0,'','Dismiss')
	}
	$('#notifyDot').fadeOut('slow')
}
// Load contact gallery
window.loadContactGallery=function(uid,nm){
	showDialog(null,`"`+nm+`" profile photos<div hidden class="dialogbox" style="align-content:stretch;flex-wrap:wrap;max-height:30vh" id="contactGallery"></div>`,'','Dismiss')
	upKey=engineName.toLowerCase()+'/profile/'+uid+'/'
	upDisp('upPPs','contactGallery',isMobile?'96px':'128px',false)
	setTimeout(function(){
		showDialog(null,`"`+nm+`" has no profile photos`,'','Dismiss')
	},5600)
}
// Open chat contact window
window.openContactChat=function(uid,fn,nm){
	saveNewContact(uid,fn,nm)
	myUserID.contact=uid
	emoL=false
	let im=lsRd('profile'+uid)
	if(im==null)im=`assets/models/players/`+fn+`.jpg`
	onFdb(engineName.toLowerCase()+'/'+playerParameters.levelName+'messages/'+getPolarity(myUserID.contact))
	for(let i=0;i<onRe.contacts.length;i++)if(onRe.contacts[i]==uid)delete onRe.contacts[i]
	onEr(engineName.toLowerCase()+'/notifications/'+myUserID.uid+'/'+uid)
	$('#contactICON').fadeIn('slow')
	$('#contactList').hide()
	$('#contactChat').html(`
		<div class="dialogbox" style="height:56vh;width:60vw;position:absolute;bottom:50px;right:3px;overflow:hidden" id="messageContainer">
			<div style="display:flex;position:fixed">
				<span hidden id="contactModel">`+fn+`</span>
				<img class="chatProfileImage" src="`+im+`"
				ontouchend="loadContactGallery('`+uid+`','`+nm+`')"
				onmouseup="if(!isMobile)loadContactGallery('`+uid+`','`+nm+`')"/>
				<span style="margin-left:0px;margin-top:-30px;position:fixed;font-size:24px" id="contactName">`+nm+`</span>
			</div>
			<div class="chatMessageList" id="chatMessageList"></div>
		</div>
		<div class="dialogbox" style="width:60vw;position:absolute;bottom:0px;right:3px;overflow:hidden">
			<span id="emojiContainer"></span>
			<div class="dialogbox" style="margin:0px;width:44vw;height:20px">
				<img src="assets/images/emoji.png"
				ontouchend="loadEmojis()"
				onmouseup="if(!isMobile)loadEmojis()"
				style="position:absolute"/>
				<input class="chatInput" type="text"
				onkeyup="if(event.keyCode===13)sendMessage('`+uid+`')"
				placeholder="Message here..." id="sendMessage"/>
			</div>
			<div class="dialogbox" style="height:20px;position:absolute;bottom:-5px;right:-6px;overflow:hidden">
				<div class="buttonContainer">
					<span
					ontouchend="sendMessage('`+uid+`')"
					onmouseup="if(!isMobile)sendMessage('`+uid+`')"
					style=""><img src="assets/images/send.png"/></span>
				</div>
			</div>
		</div>`)
		$('#contactChat').fadeIn('fast')
		loadContactMessages(9)
		showTouchControls(false)
}
// ==== EMOJI ====
// Load emojis
window.loadEmojis=function(){
	if($('#emojiContainer').html()==''){
		$('#emojiContainer').html(`<div class="dialogbox" style="margin:0px;margin-bottom:5px;height:40px;overflow:auto" id="emoji-type"></div>`)
		$('#messageContainer').css({height:'46vh',bottom:'106px'})
		$('#chatMessageList').css({height:'40vh'})
		loadEmojiGroup()
	}else{
		$('#emojiContainer').html('')
		$('#messageContainer').css({height:'56vh',bottom:'50px'})
		$('#chatMessageList').css({height:'50vh'})
	}
	setTimeout(function(){$('#sendMessage').focus()},100)
}
// Load emojis
function loadEmojiGroup(){
	let e1,e2,em
  e1=lsRd('recentEmojis')
  if(e1!=null){
		newEmo()
		$('#emoji').html(emoFm('Recent:none:'+e1))
	}
  if($('#emoji-type').html()==''){
    e2=''
		e1=emojis.split('\n')
    for(let o0=0;o0<e1.length;o0++){
      if(e1[o0].includes(':')){
        em=e1[o0].split(':')[1][1]
        em=`&#x`+e1[o0].split(':')[1]
        e2+=`<a class="mdc-button"
					ontouchend="newEmo();$('#emoji').html(emoFm('`+e1[o0]+`'))"
					onmouseup="if(!isMobile){newEmo();$('#emoji').html(emoFm('`+e1[o0]+`'))}"
					style="margin:0px;padding:0px;font-size:20px">`+em+`</a>`
      }
    }
		$('#emoji-type').html(e2)
  }
}
// Create emojis container
var emoL
window.newEmo=function(){
	if(!emoL){
		emoL=true
		$('#emojiContainer').html(`<div class="dialogbox" style="margin:0px;margin-bottom:5px;height:40px;overflow:auto" id="emoji"></div>`+$('#emojiContainer').html())
		$('#messageContainer').css({height:'34vh',bottom:'162px'})
		$('#chatMessageList').css({height:'28vh'})
	}
	setTimeout(function(){$('#sendMessage').focus()},100)
}
// Display emojis
window.emoFm=function(e0){
	let e1,e2='',em,f0
	e0=e0.split(`:`)[2].split(`,`)
  for(let j0=0;j0<e0.length;j0++){
    e1=e0[j0].split('-')
		if(e1.length==1)e1[1]=e1[0]
    for(let j1=parseInt(e1[0],16);j1<=parseInt(e1[1],16);j1++){
      em=j1.toString(16)[1]
			f0=`$('#sendMessage').val($('#sendMessage').val()+this.text);saveRecentEmojis(this.text);setTimeout(function(){$('#sendMessage').focus()},100)`
			em=`&#x`+j1.toString(16)
      e2+=`<a class="mdc-button"
				ontouchend="`+f0+`"
				onmouseup="if(!isMobile){`+f0+`}"
				style="margin:0px;padding:0px;font-size:20px">`+em+`</a>`
    }
  }
	return e2
}
//Save recently used emoji
window.saveRecentEmojis=function(e0){
	let e1,e2,br
  e1=lsRd('recentEmojis')
	if(e1==null){
		e1=br=``
	}else br=`,`
  e2=emoHex(e0)
	e1=e1.replace(new RegExp(br+e2,'gi'),'').replace(new RegExp(e2+br,'gi'),'')
	lsSv('recentEmojis',e2+br+e1)
}
// ==== PLAYER LIBRARY ====
function showTouchControls(st0){
	let fd0='.3'
	if(st0){
		if($('#contactWindow').css('display')=='none'){
			hideLeftOptions()
			$('#dialogWindow').fadeOut('fast')
			$('#contactICON').fadeOut('slow')
			$('#optionWindow').fadeOut('slow')
			$('#avatarLibrary').fadeOut('slow')
			$('#userIDWindow').fadeOut('slow')
			if(!engineParameters.vr)$('#touchControls').fadeIn('slow')
			fd0='1'
		}
	}else $('#touchControls').fadeOut('slow')
	$('#driveVehicle').hide()
	$('#takeIT').hide()
	$('#avatarLibrary').hide()
	$('#takeSnap').hide()
	$('#screenTarget').hide()
	$('#world').fadeTo('slow',fd0)
	if(modelsParameters.driveVehicleIndex[playerParameters.index]!=null){
		if(playerControlsParameters.mySeat[playerParameters.index]!=0){
			$('#stickRIGHT').fadeOut('slow')
			$('#stickLEFT').fadeOut('slow')
		}else{
			$('#stickRIGHT').fadeIn('slow')
			$('#stickLEFT').fadeIn('slow')
		}
	}
}
// Load avatar list
window.loadAvatarList=function(){
	if($('#avatarList').html()==''){
		playerParameters.avatars=[
			{name:'amareekon',height:1.55,weight:47,offset:0},
			{name:'eadiedavies',height:1.5,weight:42,offset:0},
			{name:'mariamoore',height:1.5,weight:44,offset:-.02},
			{name:'marlonkabilin',height:1.7,weight:82,offset:.08},
			{name:'umbawa',height:1.8,weight:97,offset:.12},
		]
		for(let i=0;i<playerParameters.avatars.length;i++){
			$('#avatarList').html($('#avatarList').html()
			+'<img class="avatarImage"'
			+'src="assets/models/players/'+playerParameters.avatars[i].name+'.jpg"'
			+'ontouchend="loadMyAvatar('+i+')"'
			+'onmouseup="if(!isMobile)loadMyAvatar('+i+')"/>')
		}
	}
}
// Save user name
window.saveUserID=function(){
	let m0
	$('#userIDWindow').fadeOut('slow')
	if($('#userName').val()!=''){
		playSounds[0].play()
		myUserID.name=$('#userName').val()
		lsSv('myUserID',JSON.stringify(myUserID))
		m0=`Your visitor name "`+myUserID.name+`" is saved`
	}else{
		myUserID.name='Noname'
		lsEr('myUserID')
		m0=`No name is saved, because you have not specified a visitor name`
	}
	hideOpTm=9
	showDialog('userProfile.png',m0,'','Dismiss')
}
// ==== GAME RULES ====
function checkRequired(cR0){
	if(cR0){
		if(playerParameters.required!=null){
			if(playerParameters.required=='amount'&&parseFloat($('#walletAmount').text().replace(/,/g,''))>=parseFloat(playerParameters.amount))playerParameters.required=null
			if(playerParameters.required==null&&lsRd('mission'+playerParameters.levelName)==null){
				lsSv('mission'+playerParameters.levelName,'done')
				if(engineParameters.sound)playSounds[16].play()
				$('#centerMessage').html('Mission<br><span style="font-size:4vh">Accomplished<span>')
				$('#loudICON').fadeIn('fast')
				$('#centerMessage').fadeIn('fast')
				setTimeout(function(){
					$('#loudICON').fadeOut('slow')
					$('#centerMessage').fadeOut('slow')
				},8400)
			}
		}
	}else return lsRd('mission'+playerParameters.prerequisite)
}
// ==== USER ====
// Close dialog
window.closeDialog=function(e,c0){
	if(!c0){
		if(checkRequired(false)==null&&playerParameters.prerequisite!=null)leaveLevel()
		$('#dialogWindow').fadeOut('slow')
		$('#worldControls').fadeIn('slow')
		showTouchControls(true)
		startSounds()
		hideOpTm=0
		s0=''
	}else s0='_pressed'
	if(e!=null)$(e).attr('src','assets/images/closeDialog'+s0+'.png')
}
// Leave level
window.leaveLevel=function(){
	updateActivity('leave');if(isOnL())onEr(engineName.toLowerCase()+'/'+playerParameters.levelName+'/'+myUserID.uid);setTimeout(function(){history.back()},900)
}
// ==== CAR ENGINE SOUND ====
// Load car engine sound
function loadCarEngineSound(){
	engineParameters.loadingManager=new THREE.LoadingManager()
	engineParameters.loadingManager.onLoad=function(){
		if(!engineParameters.carEngineOn){
			engineParameters.carEngineOn=true
			engineParameters.camera.add(engineParameters.listener)
		}
	}
	engineParameters.carEngineOn=false
	engineParameters.listener=new SoundGeneratorAudioListener()
	EngineSoundGenerator.load(engineParameters.loadingManager,engineParameters.listener,'.')
}
// Start car engine sound
window.startSoundCarEngine=function(eI0,sE0){
	if(modelsParameters.soundCarEngine[eI0]!==undefined){
		engineParameters.listener.context.resume()
	  if(sE0){
			modelsParameters.carEngine[eI0].start()
			modelsParameters.soundCarEngine[eI0].play()
	  }else{
			try{
				modelsParameters.soundCarEngine[eI0].gain.gain.value=.01*0
				modelsParameters.carEngine[eI0].starting=false
				modelsParameters.carEngine[eI0].started=false
				modelsParameters.soundCarEngine[eI0].stop()
				modelsParameters.carEngine[eI0].rpm=0
			}catch(err){}
		}
	}
}
// Play car engine sound
function playCarEngineSound(){
	var time=window.performance.now()
	var dt=time-engineParameters.lastTimeAnimate
	for(let uI0=0;uI0<modelsParameters.carEngine.length;uI0++){
		if(isNaN(modelsParameters.carEngine[uI0].rpm))modelsParameters.carEngine[uI0].rpm=1
		if(modelsParameters.soundCarEngine[uI0].source){
			modelsParameters.soundCarEngine[uI0].worklet.parameters.get('rpm').value=modelsParameters.carEngine[uI0].rpm
		}
		modelsParameters.carEngine[uI0].update(.001*dt)
	}
	engineParameters.lastTimeAnimate=time
}
// Car engine sound
window.carEngineSound=function(cI0,pW0,cE0){
	if(cE0===undefined&&engineParameters.carEngineRunning&&modelsParameters.soundCarEngine[modelsParameters.driveVehicleIndex[cI0]]!==undefined){
		let vC0=modelsParameters.vehicle[modelsParameters.driveVehicleIndex[cI0]].chassisBody.velocity
		let iF0=(vC0.x<0?-vC0.x:vC0.x+vC0.y<0?-vC0.y:vC0.y+vC0.z<0?-vC0.z:vC0.z)/300*pW0
		iF0=iF0>5?5:iF0<.1?.1:iF0
		let cP0=modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[cI0]].forwardForce/3500
		cP0=cP0>1?1:cP0
    modelsParameters.soundCarEngine[modelsParameters.driveVehicleIndex[cI0]].gain.gain.value=.01*100
		modelsParameters.soundCarEngine[modelsParameters.driveVehicleIndex[cI0]].gainIntake.gain.value=.01*(engineParameters.cameraIndex>1?100:0)
		modelsParameters.soundCarEngine[modelsParameters.driveVehicleIndex[cI0]].gainEngineBlockVibrations.gain.value=.01*100
    modelsParameters.soundCarEngine[modelsParameters.driveVehicleIndex[cI0]].gainOutlet.gain.value=.01*100
		modelsParameters.carEngine[modelsParameters.driveVehicleIndex[cI0]].throttle=.01*(pW0*cP0)
	}else if(cE0){
		engineParameters.carEngineRunning=true
	}else stopBrakeSound()
}
// Car brake sound
function carBrakeSound(cI0,bK0){
	if(engineParameters.carEngineRunning){
		if(bK0){
			let vC0=modelsParameters.vehicle[modelsParameters.driveVehicleIndex[cI0]].chassisBody.velocity
			let iF0=((vC0.x<0?-vC0.x:vC0.x+vC0.y<0?-vC0.y:vC0.y+vC0.z<0?-vC0.z:vC0.z)/50).toFixed(3)
			if(iF0>.1){
				iF0=iF0>1?1:iF0<.1?.1:iF0
				playSounds[21].volume=iF0
				if(engineParameters.carBraking===undefined)playSounds[21].play()
				engineParameters.carBraking=true
			}else stopBrakeSound()
		}else stopBrakeSound()
	}
}
// Stop brake sound
function stopBrakeSound(){
	engineParameters.carBraking=undefined
	playSounds[21].pause()
	playSounds[21].currentTime=0
}
// ==== VEHICLE ====
// Show drive option
window.showGearLevel=function(){
	$('#vehicleGear').html(modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[playerParameters.index]].gear)
}
// Near vehicle
window.nearVehicle=function(un0){
	try{
		if(un0!==undefined&&$('#optionWindow').css('display')=='none'&&engineParameters.objectPrice[engineParameters.objectSelect].amount==0){
			if(engineParameters.archive[un0].vehicleIndex!==undefined&&playerControlsParameters.stickState=='avatar'){
				modelsParameters.nearVehicleIndex=engineParameters.archive[un0].vehicleIndex
				$('#driveVehicle').fadeIn('slow')
			}
		}else $('#driveVehicle').fadeOut('slow')
	}catch(e){}
}
// Get near vehicle
function getNearVehicle(sw0,c0){
	if(modelsParameters.chassisMeshIndex.length>0){
		let nR0,nR1
		for(let gV0=0;gV0<modelsParameters.chassisMeshIndex.length;gV0++){
			if(engineParameters.scene.children[modelsParameters.chassisMeshIndex[gV0]]!==undefined){
				nR0=getVectorDistance(engineParameters.scene.children[modelsParameters.chassisMeshIndex[gV0]].position.x,modelsParameters.meshesData[sw0].position.x,engineParameters.scene.children[modelsParameters.chassisMeshIndex[gV0]].position.z,modelsParameters.meshesData[sw0].position.z).distance
				if(nR1===undefined||nR0<nR1){
					modelsParameters.nearVehicleIndex=gV0
					nR1=nR0
				}
			}
		}
		switchDriving(sw0,c0)
	}
}
// Switch to drive
function switchDriving(sw0,c0){
	var vAct='none',dL0
	if(c0){
		if(modelsParameters.chassisMeshIndex[modelsParameters.nearVehicleIndex]===undefined)updateMeshIndex()
		if(modelsParameters.driveVehicleIndex[sw0]==null&&modelsParameters.nearVehicleIndex!==undefined){
			playerControlsParameters.mySeat[sw0]=-1
			do{playerControlsParameters.mySeat[sw0]++}while(modelsParameters.isOccupied[modelsParameters.nearVehicleIndex][playerControlsParameters.mySeat[sw0]]&&playerControlsParameters.mySeat[sw0]<modelsParameters.isOccupied[modelsParameters.nearVehicleIndex].length-1)
			if(!modelsParameters.isOccupied[modelsParameters.nearVehicleIndex][playerControlsParameters.mySeat[sw0]]&&playerControlsParameters.mySeat[sw0]<modelsParameters.isOccupied[modelsParameters.nearVehicleIndex].length&&engineParameters.scene.children[modelsParameters.chassisMeshIndex[modelsParameters.nearVehicleIndex]]!==undefined){
				modelsParameters.isOccupied[modelsParameters.nearVehicleIndex][playerControlsParameters.mySeat[sw0]]=true
				modelsParameters.driveSeat[modelsParameters.nearVehicleIndex][playerControlsParameters.mySeat[sw0]].position.y=-playerControlsParameters.height[sw0]*.5+.03
				modelsParameters.driveVehicleIndex[sw0]=modelsParameters.nearVehicleIndex
			}else{
				$('#driveVehicle').fadeOut('slow')
				return
			}
			vAct='Driving'
			if(sw0==playerParameters.index){
				s0='drive'
				$('#vehicleGear').fadeIn('slow')
				updateActivity('drivevehicle')
				showTouchControls(true)
			}
			startSoundCarEngine(modelsParameters.driveVehicleIndex[sw0],true)
			carEngineSound(sw0,0,true)
		}
		dL0=400
	}else{
		if(modelsParameters.driveVehicleIndex[sw0]!=null){
			modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[sw0]].gear=1
			if(sw0==playerParameters.index){
				s0='avatar'
				$('#vehicleGear').fadeOut('slow')
				updateActivity('exitvehicle')
				$('#stickRIGHT').fadeIn('slow')
				$('#stickLEFT').fadeIn('slow')
				engineParameters.lookElevation=0
				showGearLevel()
			}
			startSoundCarEngine(modelsParameters.driveVehicleIndex[sw0],false)
			vAct=randomString(standIdle)
			modelsParameters.isOccupied[modelsParameters.driveVehicleIndex[sw0]][playerControlsParameters.mySeat[sw0]]=false
			modelsParameters.meshesData[sw0].position.lerp(modelsParameters.driveDoor[modelsParameters.driveVehicleIndex[sw0]][playerControlsParameters.mySeat[sw0]].getWorldPosition(returnConstant('newVector')),1)
			modelsParameters.driveVehicleIndex[sw0]=null
			carEngineSound(sw0,0,false)
		}
		dL0=600
	}
	modelsParameters.meshesData[sw0].rotation.x=modelsParameters.meshesData[sw0].rotation.z=0
	engineParameters.world.removeBody(playerControlsParameters.physics[sw0])
	playerControlsParameters.physics[sw0]=getCapsule(sw0,playerControlsParameters.mass[sw0],playerControlsParameters.height[sw0],modelsParameters.meshesData[sw0].position.x,modelsParameters.meshesData[sw0].position.y,modelsParameters.meshesData[sw0].position.z)
	engineParameters.world.addBody(playerControlsParameters.physics[sw0])
	if(engineParameters.cameraIndex!=1){
		engineParameters.scene.children[modelsParameters.meshIndex[sw0]].visible=false
		setTimeout(function(){
			engineParameters.scene.children[modelsParameters.meshIndex[sw0]].visible=true
		},dL0)
	}
	if(sw0==playerParameters.index){
		playerControlsParameters.stickState=s0
		$('#sticksideLEFT').attr('src','assets/images/'+s0+'sticksideLEFT.png')
		$('#sticksideRIGHT').attr('src','assets/images/'+s0+'sticksideRIGHT.png')
		$('#sticktopLEFT').attr('src','assets/images/'+s0+'sticktopLEFT.png')
		$('#sticktopRIGHT').attr('src','assets/images/'+s0+'sticktopRIGHT.png')
		$('#driveVehicle').fadeOut('slow')
		playAnimSounds('ambience')
		createCameras(false)
	}
	if(prevAct[sw0]!=vAct&&vAct!='none'){
		prevAct[sw0]=vAct
		loadFBXAnim(vAct+'.fbx',engineParameters.scene.children[modelsParameters.meshIndex[sw0]],sw0,false,false)
	}
	playSounds[19].play()
}
// ==== DIALOGS ====
// Avatar urls
window.avatarURLS=function(){
	showDialog('userProfile.png',`You can paste your metaverse "Ready Player Me" or your uploaded "Mixamo" rigged avatar url`,'myCharacter(null,false)','Back')
}
// ==== UI CONTROLS ====
// Hide left options
window.hideLeftOptions=function(){
	$('#menuOption').fadeOut('fast')
	$('#loadingBar').fadeOut('fast')
	$('#cameraOption').fadeOut('fast')
	if($('#walletAmount').text()!='0.00')$('#walletICON').fadeIn('slow')
}
// Drive vehicle
window.driveVehicle=function(e,c0){
	if(!c0){
		switchDriving(playerParameters.index,true)
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/driveVehicle'+s0+'.png')
}
// Pay it
window.payIT=function(e,c0){
	if(!c0){
		if(parseFloat($('#walletAmount').text().replace(/,/g,''))>engineParameters.objectPrice[engineParameters.objectSelect].amount){
			if(engineParameters.sound)playSounds[14].play()
			$('#walletAmount').text(iCommas((parseFloat($('#walletAmount').text().replace(/,/g,''))-engineParameters.objectPrice[engineParameters.objectSelect].amount).toFixed(2)))
			engineParameters.objectPrice[engineParameters.objectSelect].amount=0
			lsSv('walletAmount'+myUserID.uid,enAdStr($('#walletAmount').text()))
			if($('#walletICON').css('display')=='none')$('#walletICON').fadeIn('slow')
			checkRequired(true)
		}else{
			if(engineParameters.sound)playSounds[22].play()
			showDialog('wallet.png',`Unable to pay υς`+engineParameters.objectPrice[engineParameters.objectSelect].amount.toFixed(2)+`, because you only have υς`+$('#walletAmount').text()+` in your wallet`,'','Dismiss')
		}
		$('#payIT').fadeOut('slow')
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/payIT'+s0+'.png')
}
// Take it
window.takeIT=function(e,c0){
	if(!c0){
		if(engineParameters.sound)playSounds[14].play()
		$('#walletAmount').text(iCommas((engineParameters.objectReward[engineParameters.objectSelect].amount+parseFloat($('#walletAmount').text().replace(/,/g,''))).toFixed(2)))
		engineParameters.objectReward[engineParameters.objectSelect].amount=0
		lsSv('walletAmount'+myUserID.uid,enAdStr($('#walletAmount').text()))
		if($('#walletICON').css('display')=='none')$('#walletICON').fadeIn('slow')
		$('#takeIT').fadeOut('slow')
		checkRequired(true)
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/takeIT'+s0+'.png')
}
// Load my custom object
window.loadMyObject=function(e,c0){
	if(!c0){
		setTimeout(function(){
			if(myUploadGallery===undefined)myUploadGallery=`<div class="profileFrame">
				<label class="dialogbox" style="overflow:hidden">
					<img class="profileImage"
					src="assets/images/upload.png"/>
					<input hidden type="file" multiple value="upload" accept=".gltf,.glb,.fbx"
					onChange="flMxSz=isMobile?2048*1024:8192*1024;cmprsF=true;uploadAssets('upMPs','upMGa',this.files)"/>
				</label>
			</div>
			<div hidden class="dialogbox" style="align-content:stretch;flex-wrap:wrap;max-height:30vh" id="upMGa"></div>
			<div hidden class="dialogbox" style="max-height:14vh" id="upMPs"></div>`
			showDialog(null,myUploadGallery,'','Close')
			upKey=engineName.toLowerCase()+'/assets/'+myUserID.uid+'/'
			if($('#upMGa').html()=='')upDisp('upMPs','upMGa',isMobile?'96px':'128px',true)
		},1000)
		hideOpTm=0
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/loadMyObject'+s0+'.png')
}
// Open user id
window.userID=function(e,c0){
	if(!c0){
		setTimeout(function(){
			showTouchControls(false)
			upKey=engineName.toLowerCase()+'/profile/'+myUserID.uid+'/'
			if($('#upPGa').html()=='')upDisp('upPPs','upPGa',isMobile?'96px':'128px',true)
			$('#userIDWindow').show()
			$('#optionWindow').fadeIn('slow')
			if(myUserID.name!='Noname')$('#userName').val(myUserID.name)
			setTimeout(function(){$('#userName').focus()},100)
			try{
				if(myUserID.profile!=null)$('#profileImage').attr('src',myUserID.profile)
			}catch(err){}
		},1000)
		hideOpTm=0
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/userID'+s0+'.png')
}
// Switch to day time
window.switchDay=function(e,c0){
	if(!c0){
		if(sunShadowParameters.elevation>180){
			engineParameters.underFog=undefined
			sunShadowParameters.elevation-=180
			updateSun()
			playAnimSounds('ambience')
		}
		hideOpTm=6
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/switchDay'+s0+'.png')
}
// Switch to night time
window.switchNight=function(e,c0){
	if(!c0){
		if(sunShadowParameters.elevation<180){
			engineParameters.underFog=undefined
			sunShadowParameters.elevation+=180
			updateSun()
			playAnimSounds('ambience')
		}
		hideOpTm=6
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/switchNight'+s0+'.png')
}
// Load avatar link
window.loadMyAvatar=function(i){
	if(modelsParameters.driveVehicleIndex[playerParameters.index]==null){
		let nm=null,ht=1.2,kg=36,of=0
		if(playerControlsParameters.alive[playerParameters.index]){
			if(i=='online'){
				if($('#avatarLink').val()!=''){
					playerModelLink=$('#avatarLink').val().replace('https://','')
				}else{
					showDialog('userProfile.png',`No avatar is loaded, because the url is unspecified`,'myCharacter()','Back')
					return
				}
			}else if(i!='myavatar'){
				playerModelLink=null
				nm=playerParameters.avatars[i].name
				ht=playerParameters.avatars[i].height
				kg=playerParameters.avatars[i].weight
				of=playerParameters.avatars[i].offset
				lsSv(playerParameters.levelName+'playerAvatar','{"model":"'+nm+'","offset":"'+of+'"}')
			}
			setTimeout(function(){
				if($('#world').css('display')=='none')showDialog('nointernet.png',`Cannot load your online avatar, because you're not connected to the internet`,'','Dismiss')
			},20000)
			if(!isOnL()&&playerModelLink!=null){
				showDialog('nointernet.png',`Cannot load your online avatar, because you're not connected to the internet`,'','Dismiss')
			}else{
				$('#loadingFill').css('width','2%')
				$('#loadingBar').fadeIn('fast')
				loadPlayerMesh('assets/models/players/'+nm+'/',nm+'.glb',true,modelsParameters.meshesData[playerParameters.index].position.x,modelsParameters.meshesData[playerParameters.index].position.y,modelsParameters.meshesData[playerParameters.index].position.z,modelsParameters.meshesData[playerParameters.index].rotation.y,1,playerParameters.index,ht,kg,true,0,of)
				setTimeout(function(){
					showTouchControls(true)
				},300)
			}
		}else showDialog('userProfile.png',`Unable to change avatar, because your dead avatar is disconnected`,'','Dismiss')
	}else showDialog('userProfile.png',`Unable to change avatar, because you are driving`,'','Dismiss')
	startSounds()
}
// Wallet icon
window.walletICON=function(e,c0){
	if(!c0){
		showTouchControls(false)
		showDialog('wallet.png',`Your wallet amount is υς`+$('#walletAmount').text(),'','Dismiss')
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/wallet'+s0+'.png')
}
// My wallet
window.myWallet=function(e,c0){
	if(!c0){
		isMyContacts(JSON.stringify(onlineMultiplayer.myContacts),'uid')
		if(onlineMultiplayer.myContacts.uid.length>0){
			showTouchControls(false)
			let ac0=''
			for(let i=0;i<onlineMultiplayer.myContacts.uid.length;i++){
				if(onlineMultiplayer.myContacts.uid[i]!=null){
					ac0+=`<div class="dialogbox"
							ontouchend="$('#AmountFrame`+onlineMultiplayer.myContacts.uid[i]+`').fadeIn('slow')"
							onmouseup="if(!isMobile)$('#AmountFrame`+onlineMultiplayer.myContacts.uid[i]+`').fadeIn('slow')"
							style="margin:6px;min-width:60vw;max-width:600px">
							<div style="display:flex">
								<img class="contactProfileImage" src="assets/models/players/`+onlineMultiplayer.myContacts.data[i].model.replace('.glb','')+`.jpg"/>
								<div hidden class="dialogbox" style="overflow:hidden" id="AmountFrame`+onlineMultiplayer.myContacts.uid[i]+`">
									<input class="linkInput" type="text"
									onkeyup="if(event.keyCode===13)transferCredit()"
									placeholder="0.00" style="font-size:22px"
									id="AmountIn`+onlineMultiplayer.myContacts.uid[i]+`"/>
								</div>
							</div>
							<span>`+onlineMultiplayer.myContacts.data[i].name+`</span>
						</div>`
				}
			}
			showDialog('wallet.png',
			`<span style="position:absolute;margin-left:86px;margin-top:-50px;font-size:30px">υς`+$('#walletAmount').text()+`</span><br>
			<div style="margin-top:-18px;max-height:22vh;overflow-y:scroll" id="accountList">`+ac0+`</div>`,
			'transferCredit()','Transfer')
		}else showDialog('wallet.png',`You don't have a contact to transfer credits to`,'','Dismiss')
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/myWallet'+s0+'.png')
}
// Receive credits
window.receiveTransfer=function(){
	showDialog('wallet.png',
	`You have received υς`+iCommas(onRe.data[0])+` from "`+onRe.data[1]+`"`,'','Transfer')
	$('#walletAmount').text(iCommas((parseFloat(onRe.data[0].replace(/,/g,''))+parseFloat($('#walletAmount').text().replace(/,/g,''))).toFixed(2)))
	lsSv('walletAmount'+myUserID.uid,enAdStr($('#walletAmount').text()))
	onEr(engineName.toLowerCase()+'/transfers/'+myUserID.uid)
}
// Transfer credits
window.transferCredit=function(){
	let ta0=0,tx0='',tx1
	for(let i=0;i<onlineMultiplayer.myContacts.uid.length;i++)if($('#AmountIn'+onlineMultiplayer.myContacts.uid[i]).val()!=''){
		tx1=$('#AmountIn'+onlineMultiplayer.myContacts.uid[i]).val().replace(/,/g,'')
		tx0+=`,"`+onlineMultiplayer.myContacts.uid[i]+`":{"amount":"`+tx1+`","name":"`+myUserID.name+`"}`
		ta0+=parseFloat(tx1)
	}
	if(ta0>0){
		if(ta0<=parseFloat($('#walletAmount').text().replace(/,/g,''))){
			$('#walletAmount').text(iCommas((parseFloat($('#walletAmount').text().replace(/,/g,''))-ta0).toFixed(2)))
			lsSv('walletAmount'+myUserID.uid,enAdStr($('#walletAmount').text()))
			onSv(engineName.toLowerCase()+'/transfers/',JSON.parse('{'+tx0.replace(',','')+'}'))
			showDialog('wallet.png','You have transferred υς'+iCommas(ta0)+' to the your contacts','','Dismiss')
		}else showDialog('wallet.png',`Unable to transfer υς`+ta0+` to your contacts, because your υς`+$('#walletAmount').text()+` are not sufficient enough`,'','Dismiss')
	}else showDialog('wallet.png',`Please select the contacts you want to transfer`,'','Dismiss')
}
// My mission
window.myMission=function(e,c0){
	if(!c0){
		showTouchControls(false)
		showDialog('myObjective.png',playerParameters.mission,'','Dismiss')
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/myMission'+s0+'.png')
}
// My chat messages
window.myChat=function(e,c0){
	if(!c0){
		showTouchControls(false)
		isMyContacts(JSON.stringify(onlineMultiplayer.myContacts),'uid')
		loadContactList(onlineMultiplayer.myContacts.uid,onlineMultiplayer.myContacts.data,1.5)
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/myChat'+s0+'.png')
}
// Contact icon
window.contactICON=function(e,c0){
	if(!c0){
		showTouchControls(false)
		loadContactList(onlineMultiplayer.uid,onlineMultiplayer.target,1.5)
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/contactICON'+s0+'.png')
}
// Back out
window.backOUT=function(e,c0){
	if(!c0){
		if($('#optionWindow').css('display')!='none'){
			if(myUserID.contact!=null){
				if(vAIn&&isOnL())ofFdb(engineName.toLowerCase()+'/'+playerParameters.levelName+'messages/'+getPolarity(myUserID.contact))
				myUserID.contact=null
			}
			$('#contactWindow').hide()
			showTouchControls(true)
			hideOpTm=6
			showMenu()
		}else{
			hideOpTm=20
			setTimeout(function(){
				showDialog('myObjective.png',
				`Do you want to leave the "`+playerParameters.levelName+`" world?`,
				`leaveLevel()`,
				'Leave')
			},300)
		}
		startSounds()
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/backOUT'+s0+'.png')
}
// Replay
window.replayIN=function(e,c0){
	if(!c0){
		let act
		if(modelsParameters.driveVehicleIndex[playerParameters.index]!=null)switchDriving(playerParameters.index,false)
		showTouchControls(false)
		if(playerControlsParameters.alive[playerParameters.index]){
			$('#loadingFill').css('width','10%')
			$('#loadingBar').fadeIn('fast')
			act=randomString(standIdle)
		}else act='GettingUp'
		prevAct[playerParameters.index]=act
		playerControlsParameters.alive[playerParameters.index]=true
		loadFBXAnim(act+'.fbx',engineParameters.scene.children[modelsParameters.meshIndex[playerParameters.index]],playerParameters.index,false,true)
		getSpawnPosition(playerParameters.spawn,false)
		playerControlsParameters.physics[playerParameters.index].position.set(playerParameters.position.x,playerParameters.position.y,playerParameters.position.z)
		modelsParameters.meshesData[playerParameters.index].quaternion.set(0,0,0,0)
		playerControlsParameters.player.rotation.y=modelsParameters.meshesData[playerParameters.index].rotation.y=Math.PI/180*playerParameters.position.o
		playerControlsParameters.physics[playerParameters.index].velocity.y=0
		updateActivity('replay')
		engineParameters.camera.position.set(playerParameters.position.x,playerParameters.position.y+10,playerParameters.position.z)
		engineParameters.camera.zoom=1
		engineParameters.lookElevation=0
		engineParameters.camera.updateProjectionMatrix()
		setTimeout(function(){
			$('#loadingFill').css('width','100%')
			setTimeout(function(){
				showTouchControls(true)
				updateActivity('halt')
			},600)
		},900)
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/replayIN'+s0+'.png')
}
// My character
window.myCharacter=function(e,c0){
	if(!c0){
		loadAvatarList()
		setTimeout(function(){
			showTouchControls(false)
			$('#userIDWindow').hide()
			$('#avatarLibrary').fadeIn('slow')
			$('#optionWindow').fadeIn('slow')
			setTimeout(function(){$('#avatarLink').focus()},100)
		},1000)
		hideOpTm=0
		s0=''
	}else s0='_pressed'
	$(e).attr('src','assets/images/myCharacter'+s0+'.png')
}
// Taka a snap
let snaplink=document.createElement('a')
snaplink.setAttribute('target','_blank')
snaplink.setAttribute('download','Snap'+cDtTm()+'.jpg')
window.takeSnap=function(e,c0,t0,n){
	if(n!==undefined)hideOpTm=n
	if(t0){
		if(c0){
			playSounds[0].play()
			render()
			snaplink.setAttribute('href',engineParameters.renderer.domElement.toDataURL())
	    snaplink.click()
			$('#screenTarget').fadeIn('fast')
			hideOpTm=6
			s0='_pressed'
		}else s0=''
		$(e).attr('src','assets/images/stickcontrolball'+s0+'.png')
	}else setTimeout(function(){
		if(hideOpTm>0){
			if(hideOpTm<6/2)$('#screenTarget').fadeOut('fast')
			hideOpTm--
			takeSnap(null,null,false)
		}else{
			showTouchControls(true)
			$('#takeSnap').fadeOut('slow')
		}
	},1000)
}
// Option zoom near
window.zoomNEAR=function(e,c0){
	if(c0){
		if(engineParameters.camera.zoom<51){
			engineParameters.camera.zoom+=engineParameters.camera.zoom*.25
			engineParameters.camera.updateProjectionMatrix()
		}
		showProgress(engineParameters.camera.zoom*2+'%','#61c4b0','Zoom',true)
		hideOpTm=6
		s0='_pressed'
	}else s0=''
	$(e).attr('src','assets/images/zoomNEAR'+s0+'.png')
}
// Option zoom far
window.zoomFAR=function(e,c0){
	if(c0){
		if(engineParameters.camera.zoom>1){
			engineParameters.camera.zoom-=engineParameters.camera.zoom*.25
			engineParameters.camera.updateProjectionMatrix()
		}
		showProgress(engineParameters.camera.zoom*2+'%','#61c4b0','Zoom',true)
		hideOpTm=6
		s0='_pressed'
	}else s0=''
	$(e).attr('src','assets/images/zoomFAR'+s0+'.png')
}
// Option fov up
window.fovUP=function(e,c0){
	if(c0){
		if(engineParameters.camera.fov<105){
			engineParameters.effect.uniforms["strength"].value+=.09
			engineParameters.camera.fov+=9
			engineParameters.camera.updateProjectionMatrix()
		}
		showProgress(engineParameters.camera.fov/105*100+'%','#61c6c0','Lens',true)
		hideOpTm=6
		s0='_pressed'
	}else s0=''
	$(e).attr('src','assets/images/fovUP'+s0+'.png')
}
// Option fov down
window.fovDOWN=function(e,c0){
	if(c0){
		if(engineParameters.camera.fov>15){
			engineParameters.effect.uniforms["strength"].value-=.09
			engineParameters.camera.fov-=9
			engineParameters.camera.updateProjectionMatrix()
		}
		showProgress(engineParameters.camera.fov/105*100+'%','#61c6c0','Lens',true)
		hideOpTm=6
		s0='_pressed'
	}else s0=''
	$(e).attr('src','assets/images/fovDOWN'+s0+'.png')
}
// No vr
window.noVR=function(e,c0){
	if(c0){
		lsEr('goVR')
		isVR(true)
		s0='_pressed'
	}else s0=''
	$(e).attr('src','assets/images/noVR'+s0+'.png')
}
// Check if VR mode
function isVR(sc0){
	if(isMobile&&orientation==90){
		if(lsRd('goVR')!=null){
			engineParameters.vr=true
			$('#goVRICON').hide()
			$('#touchControls').fadeOut('fast')
			$('#noVRICON').show()
			hideOpTm=0
		}else{
			engineParameters.vr=false
			engineParameters.renderer.setScissor(0,0,window.innerWidth,window.innerHeight)
			engineParameters.renderer.setViewport(0,0,window.innerWidth,window.innerHeight)
			$('#noVRICON').hide()
			$('#goVRICON').show()
			showTouchControls(sc0)
			hideOpTm=6
		}
	}else{
		$('#noVRICON').hide()
		$('#goVRICON').hide()
	}
}
// Go vr
window.goVR=function(e,c0){
	if(c0){
		lsSv('goVR',true)
		isVR(true)
		s0='_pressed'
	}else s0=''
	$(e).attr('src','assets/images/goVR'+s0+'.png')
}
// Option exposure up
window.exposureUP=function(e,c0){
	if(c0){
		if(engineParameters.renderer.toneMappingExposure<4){
			engineParameters.renderer.toneMappingExposure+=.2
		}
		showProgress(engineParameters.renderer.toneMappingExposure/4*100+'%','#61c8d0','Shutter',true)
		hideOpTm=6
		s0='_pressed'
	}else s0=''
	$(e).attr('src','assets/images/exposureUP'+s0+'.png')
}
// Option exposure down
window.exposureDOWN=function(e,c0){
	if(c0){
		if(engineParameters.renderer.toneMappingExposure>.4){
			engineParameters.renderer.toneMappingExposure-=.2
		}
		showProgress(engineParameters.renderer.toneMappingExposure/4*100+'%','#61c8d0','Shutter',true)
		hideOpTm=6
		s0='_pressed'
	}else s0=''
	$(e).attr('src','assets/images/exposureDOWN'+s0+'.png')
}
// Option pixel up
window.optionPixelUP=function(e,c0){
	if(c0){
		if(pixelRatio>1){
			pixelRatio--
			engineParameters.renderer.setPixelRatio(window.devicePixelRatio/pixelRatio)
		}
		showProgress((10-pixelRatio+1)*10+'%','#61cae0','Quality',true)
		hideOpTm=6
		s0='_pressed'
	}else s0=''
	$(e).attr('src','assets/images/optionPixelUP'+s0+'.png')
}
// Option pixel down
window.optionPixelDOWN=function(e,c0){
	if(c0){
		if(pixelRatio<10){
			pixelRatio++
			engineParameters.renderer.setPixelRatio(window.devicePixelRatio/pixelRatio)
		}
		showProgress((10-pixelRatio+1)*10+'%','#61cae0','Quality',true)
		hideOpTm=6
		s0='_pressed'
	}else s0=''
	$(e).attr('src','assets/images/optionPixelDOWN'+s0+'.png')
}
// Show menu
window.showMenu=function(){
	$('#walletICON').hide()
	$('#cameraOption').fadeOut('fast')
	$('#contactICON').fadeOut('fast')
	$('#menuOption').fadeIn('slow')
}
// Show left options
window.stickedgeLEFT=function(e,c0){
	if(c0){
		if($('#menuOption').css('display')=='none')showMenu()
		takeSnap(null,null,false,9)
		s0='_pressed'
	}else{
		startSounds()
		s0=''
	}
	$(e).attr('src','assets/images/stickedgeLEFT'+s0+'.png')
}
// Show camera options
window.sticktopLEFT=function(e,c0){
	if(c0){
		if(playerControlsParameters.stickState=='avatar'){
			$('#walletICON').fadeOut('fast')
			$('#contactICON').fadeOut('fast')
			$('#menuOption').fadeOut('slow')
			$('#screenTarget').fadeIn('fast')
			$('#takeSnap').fadeIn('slow')
			$('#cameraOption').fadeIn('slow')
			setTimeout(function(){
				$('#screenTarget').fadeOut('slow')
			},2400)
			takeSnap(null,null,false,6)
		}else if(playerControlsParameters.mySeat[playerParameters.index]==0){
			if(modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[playerParameters.index]].gear<7){
				modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[playerParameters.index]].gear++
				playSounds[14].currentTime=0
				playSounds[14].play()
				showGearLevel()
			}
		}
		s0='_pressed'
	}else{
		startSounds()
		s0=''
	}
	$(e).attr('src','assets/images/'+playerControlsParameters.stickState+'sticktopLEFT'+s0+'.png')
}
// Waving
window.sticksideLEFT=function(e,c0){
	let wAct,l0
	if(c0){
		if(playerControlsParameters.stickState=='avatar'){
			wAct='Waving'
			l0=false
			updateActivity('wave')
		}else if(playerControlsParameters.mySeat[playerParameters.index]==0){
			[0,1,2,3].forEach(wheelIndex=>{
				if(wheelIndex==0)modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[playerParameters.index]].brakeForce=interpolate(modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[playerParameters.index]].brakeForce,1000,.0005)
				modelsParameters.vehicle[modelsParameters.driveVehicleIndex[playerParameters.index]].setBrake(modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[playerParameters.index]].brakeForce,wheelIndex)
			})
			carBrakeSound(playerParameters.index,true)
		}
		s0='_pressed'
	}else{
		if(playerControlsParameters.stickState=='avatar'){
			startSounds()
			wAct=randomString(standIdle)
			l0=true
			updateActivity('halt')
		}else if(playerControlsParameters.mySeat[playerParameters.index]==0){
			[0,1,2,3].forEach(wheelIndex=>{
				modelsParameters.vehicleMotor[modelsParameters.driveVehicleIndex[playerParameters.index]].brakeForce=50
				modelsParameters.vehicle[modelsParameters.driveVehicleIndex[playerParameters.index]].setBrake(0,wheelIndex)
			})
			carBrakeSound(playerParameters.index,false)
		}
		s0=''
	}
	$(e).attr('src','assets/images/'+playerControlsParameters.stickState+'sticksideLEFT'+s0+'.png')
	if(playerControlsParameters.stickState=='avatar'){
		if(playerControlsParameters.onfloor[playerParameters.index])loadFBXAnim(wAct+'.fbx',engineParameters.scene.children[modelsParameters.meshIndex[playerParameters.index]],playerParameters.index,false,l0)
	}
}
// Switch camera
window.stickedgeRIGHT=function(e,c0){
	if(c0){
		engineParameters.cameraIndex++
		if(engineParameters.cameraIndex>=engineParameters.cameras.length){
			engineParameters.cameraIndex=0
			engineParameters.orbitControl.enabled=true
		}
		if(engineParameters.cameraIndex==2){
			if(modelsParameters.driveVehicleIndex[playerParameters.index]!=null){
				prevAct[playerParameters.index]='Driving'
			}else if(!playerControlsParameters.onfloor[playerParameters.index])prevAct[playerParameters.index]='JumpingUp'
			loadFBXAnim(prevAct[playerParameters.index]+'.fbx',engineParameters.scene.children[modelsParameters.meshIndex[playerParameters.index]],playerParameters.index,false,true)
		}
		hideMyMesh()
		lsSv('myCamera',engineParameters.cameraIndex)
		s0='_pressed'
	}else{
		startSounds()
		s0=''
	}
	$(e).attr('src','assets/images/stickedgeRIGHT'+s0+'.png')
}
// Jump
window.sticktopRIGHT=function(e,c0){
	if(c0){
		if(playerControlsParameters.stickState=='avatar'){
			jumpLD[playerParameters.index]=true
			setTimeout(function(){
				updateActivity('jump')
				setTimeout(function(){
					updateActivity('halt')
				},1200)
			},300)
		}else switchDriving(playerParameters.index,false)
		s0='_pressed'
	}else{
		startSounds()
		s0=''
	}
	$(e).attr('src','assets/images/'+playerControlsParameters.stickState+'sticktopRIGHT'+s0+'.png')
}
// Contact
window.sticksideRIGHT=function(e,c0){
	if(c0){
		if(playerControlsParameters.stickState=='avatar'){
			hideLeftOptions()
			$('#contactICON').fadeIn('slow')
		}else{
			if(playerControlsParameters.mySeat[playerParameters.index]==0){
				playSounds[17].play()
				updateActivity('horn')
			}
		}
		s0='_pressed'
	}else{
		if(playerControlsParameters.stickState!='avatar'){
			playSounds[17].pause()
			playSounds[17].currentTime=0
			updateActivity('hornstop')
		}
		startSounds()
		s0=''
	}
	$(e).attr('src','assets/images/'+playerControlsParameters.stickState+'sticksideRIGHT'+s0+'.png')
}
// Stick halt
window.stickHalt=function(e,lr){
	if(lr==null){
		s0='_pressed'
	}else{
		startSounds()
		if(lr){
			stickRD[playerParameters.index]='C'
		}else stickLD[playerParameters.index]='C'
		s0=''
	}
	$(e).attr('src','assets/images/stickcontrolball'+s0+'.png')
}
// ==== SOUNDS ====
// Start sound
window.startSounds=function(){
	if(!engineParameters.sound){
		engineParameters.sound=true
		playAnimSounds('ambience')
		playSoundEffects(true)
	}
}
// Play sound effects
window.playSoundEffects=function(c0){
	if(engineParameters.sound){
		$('#takeIT').fadeOut('fast')
		$('#payIT').fadeOut('fast')
		for(let sl0=0;sl0<engineParameters.archive.length;sl0++){
			if(engineParameters.archive[sl0].objectIndex!==undefined){
				let ds0=getObjectDistance(engineParameters.archive[sl0].objectIndex)
				if(engineParameters.objectSounds[sl0].loop!==undefined){
					let sl=engineParameters.objectSounds[sl0].loop
					if(sl!==undefined&&sl!=null&&sl!=''){
						if(engineParameters.archive[sl0].objectIndex!==undefined){
							sl.volume=1/ds0>1?1:1/ds0
							if(c0){
								sl.loop=true
								sl.play()
							}
						}else{
							sl.pause()
							sl.currentTime=0
						}
					}
				}
				if(engineParameters.objectReward[sl0]!=null&&ds0<parseFloat(engineParameters.objectReward[sl0].proximity)){
					engineParameters.objectSelect=sl0
					if(engineParameters.objectReward[sl0].amount>0){
						$('#objectReward').text(engineParameters.objectReward[sl0].amount)
						$('#takeIT').fadeIn('slow')
					}
				}
				if(engineParameters.objectPrice[sl0]!=null&&ds0<parseFloat(engineParameters.objectPrice[sl0].proximity)){
					engineParameters.objectSelect=sl0
					if(engineParameters.objectPrice[sl0].amount>0){
						$('#objectPrice').text(engineParameters.objectPrice[sl0].amount)
						$('#payIT').fadeIn('slow')
					}
				}
			}
		}
	}
}
// Assign object sound
window.objectSound=function(n){
	if(n!==undefined){
		for(let os0=0;os0<playerParameters.parameters[n].x.length;os0++){
			let sl=playerParameters.parameters[n].sl
			if(sl!==undefined&&sl!=null&&sl!='')sl=new Audio('assets/models/soundeffects/'+playerParameters.parameters[n].sl+'.mp3')
			let sh=playerParameters.parameters[n].sh
			if(sh!==undefined&&sh!=null&&sh!='')sh=new Audio('assets/models/objectsounds/'+playerParameters.parameters[n].sh+'.mp3')
			engineParameters.objectSounds.push({loop:sl,hit:sh})
			if(playerParameters.parameters[n].am!==undefined){
				let am=playerParameters.parameters[n].am.split('-')
				engineParameters.objectReward.push({amount:Math.floor(Math.random()*(parseFloat(am[1])-parseFloat(am[0])))+parseFloat(am[0]),proximity:playerParameters.parameters[n].px})
			}else engineParameters.objectReward.push(null)
			if(playerParameters.parameters[n].pc!==undefined){
				let am=playerParameters.parameters[n].pc.split('-')
				engineParameters.objectPrice.push({amount:Math.floor(Math.random()*(parseFloat(am[1])-parseFloat(am[0])))+parseFloat(am[0]),proximity:playerParameters.parameters[n].px})
			}else engineParameters.objectPrice.push(null)
		}
	}
}
// Load sounds
function loadSounds(){
	let soundString=[
		'shutter',
		'ambienceday',
		'ambiencenight',
		'notify',
		'abovewater',
		'underwater',
		'walking',
		'jogging',
		'running',
		'landing',
		'hitfloor',
		'hit',
		'splash',
		'flying',
		'click',
		'notification',
		'youhavewon',
		'carhornhonk',
		'carinterior',
		'cardoorclose',
		'carengine',
		'carbreakingskid',
		'errormessage',
	]
	for(let p0=0;p0<soundString.length;p0++)playSounds.push(oRyt(`new Audio("assets/models/sounds/`+soundString[p0]+`.mp3")`))
}
// Play sound
var si,prevSi
window.playAnimSounds=function(actName){
	if(engineParameters.sound){
		let vol=1.0,l0=true
		if(si===undefined)actName='ambience'
		if(actName.match(/(FallingIdle)/)){
			if(si!=12&&engineParameters.isWaterLoaded&&modelsParameters.meshesData[playerParameters.index].position.y<.1){
				si=12
				l0=false
			}else{
				si=13
				vol=.15
			}
		}else if(playerHit.includes(actName.replace('.glb',''))||actName.match(/(Flip|wardJump)/)){
			si=11
			l0=false
		}else if(actName.match(/(TreadingWater|Swimming)/)){
			if(engineParameters.camera.position.y>0){
				si=4
			}else si=5
		}else if(actName.match(/(FallingFlatImpact|Dying|DyingBackwards)/)){
			si=10
			l0=false
		}else if(si!=9&&actName.match(/(FallingToLanding)/)){
			si=9
			l0=false
		}else if(actName.match(/(Flying|Falling)/)){
			si=13
		}else if(actName.match(/(Jog|Running)/)&&!actName.match(/(RunningFast|RunningBackward)/)){
			si=7
		}else if(stickLD[playerParameters.index]=='C'&&stickRD[playerParameters.index]=='C'){
			if(prevSi!='none'&&prevSi!==undefined){
				playSounds[prevSi].pause()
				playSounds[prevSi].currentTime=0
			}
			prevSi=si='none'
		}else if(actName.match(/(Walking|WalkStrafe)/)){
			si=6
		}else if(actName.match(/(Running|Strafe)/)){
			si=8
		}
		if(actName=='ambience'){
			if(sunShadowParameters.elevation<180){
				prevSi=2
				si=1
			}else{
				prevSi=1
				si=2
			}
			if(modelsParameters.driveVehicleIndex[playerParameters.index]!=null){
				prevSi=si
				si=18
			}else prevSi=18
		}
		if(si!='none'&&prevSi!=si){
			if(prevSi!='none'&&prevSi!==undefined){
				playSounds[prevSi].pause()
				playSounds[prevSi].currentTime=0
			}
			playSounds[si].loop=l0
			playSounds[si].volume=vol
			playSounds[si].play()
			prevSi=si
		}
		if(actName=='ambience'||!l0)prevSi='none'
	}
	return actName
}
// ==== UPLOAD ASSETS ====
// Upload asset
window.uploadAssets=function(p,e,uFiles){
  if(isOnL()){
		let mh
    if(isMobile){
			imMxSz=720
			imgQa=.65
			mh='96px'
		}else{
			imMxSz=1024
			imgQa=.85
			mh='128px'
		}
		$('#'+p).fadeIn('slow')
		let reFl=upFle(upKey,uFiles,'uBar','upPBar','upErBn','upDisp(\''+p+'\',\''+e+'\',\''+mh+'\',true);',p)
		flReject(reFl)
  }
}
// File too large to upload
function flReject(reFl){
	let m0
  if(reFl!=''&&reFl!==undefined){
    if(reFl.split(', ').length>2){
			m0=`files are`
		}else m0=`file is`
		showDialog('files.png',`Unable to upload `+reFl+`because the `+m0+` larger than `+(isMobile?'2mb':'8mb'),'','Dismiss')
  }
}
// Upload file progress bar
window.upPBar=function(nm,b0,st0){
  return `<div id='uBrBn`+b0+`'>
      <p style='margin:0px;padding:0px'>`+nm+`</p>
      <progress value='0' max='100' id='uBar`+b0+`'>0%</progress>
    </div>`
}
// Upload file erase button
window.upErBn=function(fNm,b1,st0){
  return `<a onclick="upErFl('`+fNm+`','`+b1+`','delete','`+st0+`')
			erUpFl('`+fNm+`')" style="position:absolute;top:15px">x
    </a>`
}
// Upload erase file
function upErFl(fNm,b2,c0,st0){
  $('#calCulus').html(`<script>function opErFl(fNm){
			`+st0+`.child(fNm).`+c0+`()
			$('#uBrBn`+b2+`').hide()
		}</script>`)
	opErFl(fNm)
}
// Upload file display
window.upDisp=function(u0,g0,mh,c0){
	$('#'+u0).hide()
  $('#'+u0).html('')
	lsFle(upKey,g0,upFlFm(c0,g0,mh))
	try{
		myUploadGallery=$('#dialogMessage').html()
	}catch(err){}
}
// Remove uploaded images
window.erUpFl=function(nm){
  let d0=upFlNme.split('_!#im>')
	upFlNme=''
	let d1=upFlURL.split('_!#im>')
	upFlURL=''
  for(let i=0;i<d0.length;i++){
    if(nm.includes(d0[i])==false){
      upFlNme+=d0[i]+'_!#im>'
			upFlURL+=d1[i]+'_!#im>'
    }
  }
}
//Uploaded file display frame itemRef.name
function upFlFm(bn,g0,mh){
  let dn,bt
  if(bn){
		dn=`onclick="$(\\'#profileImage\\').attr(\\'src\\',\\''+url+'\\');myUserID.profile=\\''+url+'\\';lsSv(\\'myUserID\\',JSON.stringify(myUserID))"`
		bt=`<a onclick="$(\\'#'+bid+'\\').fadeOut(\\'slow\\');stg.child(\\''+itemRef.fullPath+'\\').delete();erUpFl(\\''+itemRef.name+'\\')" style="position:relative;top:20px;left:4px"><img src="assets/images/cancel.png"/></a>`
	}else bt=dn=``
  upFlNme=upFlURL=''
  let or=`if(upFlNme.includes('_!#im>')){
        c0=upFlNme.split('_!#im>')[0]
      }else{
        c0=itemRef.name
      }if(c0>=itemRef.name){
        upFlNme=itemRef.name+'_!#im>'+upFlNme;upFlURL=url+'_!#im>'+upFlURL
      }else{
        upFlNme+=itemRef.name+'_!#im>';upFlURL+=url+'_!#im>'
      }
    }`
  return `if(upFlNme.includes(itemRef.name)==false){
        `+or+`bid='delbtn'+genRan('abcdefghijklmnopqrstuvwxyz',7);
        s0='<span style="display:block;margin:auto;padding:0px" id="'+bid+'">'
        if(itemRef.name.toLowerCase().match(/\\.(jpg|jpeg|png|bmp|gif)$/)==null){
          if(itemRef.name.toLowerCase().match(/\\.(gltf|glb|fbx)$/)==null){
            im='assets/images/file.png'
						typ='file'
          }else if(itemRef.name.toLowerCase().match(/\\.(gltf|glb)$/)==null){
						im='assets/images/fbx.png'
						typ='fbx'
					}else{
            im='assets/images/gltf.png'
						typ='gltf'
          }
          s1='<div class="profileFrame"><img onclick="loadMyModelEditor(\\''+url+'\\',\\''+typ+'\\')" src="'+im+'" onerror="$(this).hide()" style="max-height:`+mh+`;object-fit:cover"/></div><p class="dialogMessage" style="font-size:9px">'+txLen(itemRef.name,60,30)+'</p>'
          fl=true
        }else{
          s1='<div class="profileFrame"><img `+dn+` src="'+url+'" onerror="$(this).hide()" style="max-height:`+mh+`;object-fit:cover"/></div>'
          fl=false
        }
        s2='`+bt+`'
        s3='</span>'
        if(fl==true){
          if(`+bn+`)hFleCnt+=s0+s2+s1+s3
        }else{
          hImgCnt+=s0+s2+s1+s3
        }$('#'+id).html(hImgCnt+hFleCnt)
				if($('#`+g0+`').css('display')=='none')$('#`+g0+`').css('display','flex')`
}
// Load my custom model
var myUploadGallery
window.loadMyModelEditor=function(url,typ){
	myUploadGallery=$('#dialogMessage').html()
	showDialog(null,`<div class="dialogbox" style="display:flex;align-content:stretch;flex-wrap:wrap;max-height:30vh">
		<div class="dialogbox">
			<span class="dialogbox" style="display:flex;width:72px">
				Avatar: <input class="linkInput" type="checkbox"
				onchange="$('#myObjectAnimated').prop('checked',false);$('#myObjectTerrain').prop('checked',false);$('#myObjectHeightmap').prop('checked',false);$('#myObjectTrimesh').prop('checked',false);$('#myObjectPolyhedron').prop('checked',false);$('#myObjectMesh').prop('checked',false)"
				style="margin-left:5px" id="myObjectAvatar"/>
			</span>
		</div>
		<div class="dialogbox">
			<span class="dialogbox" style="display:flex;width:126px">
				Weight: <input class="linkInput"
				value="10" style="margin-left:5px;margin-right:5px;text-align:right" id="myObjectWeight"/>kg
			</span>
			<span class="dialogbox" style="display:flex;width:90px">
				Scale: <input class="linkInput"
				onkeyup="$('#myObjectTerrain').prop('checked',false);$('#myObjectHeightmap').prop('checked',false)"
				value="1.0" style="margin-left:5px;text-align:right" id="myObjectScale"/>
			</span>
			<span class="dialogbox" style="display:flex;width:94px">
				Animated: <input class="linkInput" type="checkbox"
				onchange="$('#myObjectAvatar').prop('checked',false);$('#myObjectTerrain').prop('checked',false);$('#myObjectHeightmap').prop('checked',false);$('#myObjectTrimesh').prop('checked',false);$('#myObjectPolyhedron').prop('checked',false);$('#myObjectMesh').prop('checked',false)"
				style="margin-left:5px" id="myObjectAnimated"/>
			</span>
		</div>
		<div class="dialogbox">
			<span class="dialogbox" style="display:flex;width:66px">
				Mesh: <input class="linkInput" type="checkbox"
				onchange="$('#myObjectAvatar').prop('checked',false);$('#myObjectAnimated').prop('checked',false);$('#myObjectHeightmap').prop('checked',false);$('#myObjectTerrain').prop('checked',false);$('#myObjectHeightmap').prop('checked',false);$('#myObjectTrimesh').prop('checked',false);$('#myObjectPolyhedron').prop('checked',false)"
				style="margin-left:5px" id="myObjectMesh"/>
			</span>
			<span class="dialogbox" style="display:flex;width:83px">
				Trimesh: <input class="linkInput" type="checkbox"
				onchange="$('#myObjectAvatar').prop('checked',false);$('#myObjectAnimated').prop('checked',false);$('#myObjectHeightmap').prop('checked',false);$('#myObjectTerrain').prop('checked',false);$('#myObjectHeightmap').prop('checked',false);$('#myObjectPolyhedron').prop('checked',false);$('#myObjectMesh').prop('checked',false)"
				style="margin-left:5px" id="myObjectTrimesh"/>
			</span>
			<span class="dialogbox" style="display:flex;width:104px">
				Polyhedron: <input class="linkInput" type="checkbox"
				onchange="$('#myObjectAvatar').prop('checked',false);$('#myObjectAnimated').prop('checked',false);$('#myObjectTerrain').prop('checked',false);$('#myObjectTerrain').prop('checked',false);$('#myObjectHeightmap').prop('checked',false);$('#myObjectTrimesh').prop('checked',false);$('#myObjectMesh').prop('checked',false)"
				style="margin-left:5px" id="myObjectPolyhedron"/>
			</span>
		</div>
		<div class="dialogbox">
			<span class="dialogbox" style="display:flex;width:69px">
				Scene: <input class="linkInput" type="checkbox"
				onchange="$('#myObjectAvatar').prop('checked',false);$('#myObjectAnimated').prop('checked',false);$('#myObjectHeightmap').prop('checked',false);$('#myObjectTrimesh').prop('checked',false);$('#myObjectPolyhedron').prop('checked',false);$('#myObjectMesh').prop('checked',false)"
				style="margin-left:5px" id="myObjectTerrain"/>
			</span>
			<span class="dialogbox" style="display:flex;width:102px">
				Heightmap: <input class="linkInput" type="checkbox"
				onchange="$('#myObjectAvatar').prop('checked',false);$('#myObjectAnimated').prop('checked',false);$('#myObjectTerrain').prop('checked',false);$('#myObjectTrimesh').prop('checked',false);$('#myObjectPolyhedron').prop('checked',false);$('#myObjectMesh').prop('checked',false);$('#myObjectScale').val(1)"
				style="margin-left:5px" id="myObjectHeightmap"/>
			</span>
		</div>
	</div>`,`loadMyModel('`+url+`','`+typ+`')`,'Load')
	let le0=lsRd('loadMyModelEditor')
	if(le0!=null){
		le0=JSON.parse(le0)
		$('#myObjectAvatar').prop('checked',le0.av=='true'?true:false)
		$('#myObjectWeight').val(le0.kg)
		$('#myObjectScale').val(le0.sc)
		$('#myObjectAnimated').prop('checked',le0.oa=='true'?true:false)
		$('#myObjectTerrain').prop('checked',le0.tn=='true'?true:false)
		$('#myObjectHeightmap').prop('checked',le0.hm=='true'?true:false)
		$('#myObjectMesh').prop('checked',le0.mh=='true'?true:false)
		$('#myObjectTrimesh').prop('checked',le0.tm=='true'?true:false)
		$('#myObjectPolyhedron').prop('checked',le0.ph=='true'?true:false)
	}
	$('#myObjectWeight').select()
}
// Load my custom model
window.loadMyModel=function(url,ft){
	let av=$('#myObjectAvatar').prop('checked')
	let kg=parseFloat(parseFloat($('#myObjectWeight').val()))
	let sc=parseFloat(parseFloat($('#myObjectScale').val()))
	let oa=$('#myObjectAnimated').prop('checked')
	let tn=$('#myObjectTerrain').prop('checked')
	let hm=$('#myObjectHeightmap').prop('checked')
	let mh=$('#myObjectMesh').prop('checked')
	let tm=$('#myObjectTrimesh').prop('checked')
	let ph=$('#myObjectPolyhedron').prop('checked')
	if(!isNaN(kg)&&!isNaN(sc)&&parseFloat(sc)>0){
		lsSv('loadMyModelEditor','{"av":"'+av+'","kg":"'+kg+'","sc":"'+sc+'","oa":"'+oa+'","tn":"'+tn+'","hm":"'+hm+'","mh":"'+mh+'","tm":"'+tm+'","ph":"'+ph+'"}')
		if(av){
			playerModelLink=url.replace('https://','')
			loadMyAvatar('myavatar')
		}else{
			oa=tn?'terrain':oa?'animated':'object'
			oa=mh?'objectmesh':tm?'trimesh':ph?'polyhedron':oa
			if(hm){
				$('#loadingFill').css('width','2%')
				$('#loadingBar').fadeIn('fast')
				oa='heightmap'
			}
			loadObject(ft,'',url,0,0,0,(tn||hm?0:{x:0,y:0,z:0}),sc,false,oa,kg,null,true)
		}
	}else{
		loadMyModelEditor(url,ft)
		return
	}
	setTimeout(function(){
		showDialog(null,myUploadGallery,'','Close')
	},600)
}
// ==== DIALOG ====
// Show dialog message
function showDialog(im,m0,f0,b0){
	$('#loudICON').fadeOut('slow')
	$('#centerMessage').fadeOut('slow')
	$('#worldControls').fadeOut('slow')
	$('#loadingBar').fadeOut('fast')
	showTouchControls(false)
	if(im!=null){
		$('#dialogIcon').show()
		$('#dialogIcon').attr('src','assets/images/'+im)
	}else $('#dialogIcon').hide()
	$('#dialogMessage').html(m0)
	if(f0==null)f0=''
	if(b0!=null){
		$('#dialogButton').html(`<div class="dialogbox"
		ontouchend="closeDialog(null,false);`+f0+`"
		onmouseup="if(!isMobile){closeDialog(null,false);`+f0+`}"
		style="margin-right:0px">
			<div class="buttonContainer">`+b0+`</div>
		</div>`)
		$('#dialogButton').show()
	}else $('#dialogButton').hide()
	$('#dialogWindow').fadeIn('slow')
}
// ==== Android ====
// Leave level
window.exApp=function(c0){
	if($('#dialogWindow').css('display')!='none'){
		closeDialog(null,false)
	}else backOUT(null,false)
}
// ==== END OF ENGINE ====
