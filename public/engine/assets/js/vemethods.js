/**
* @name [js-vemethods]{https://www.umbawa.web.app}
* @app Virtual World Engine
* @copyright Copyright virtual engine methods.js, 2020
* @license Software: Open Source Free
* @project: Virtual World Engine Project
* @written by: Eng'r Umbawa P. Sarosong
* @course: Bachelour of Science in Computer Engineer
* @major: Robotics and Automations [Weapon System Engineering]
* @specialization: Virtual Reality Artificial Intelligence Lifeform Project
* @university: AMA Computer College
*/
// Physics variables
var cannonDebugRenderer
let engineName='Taru',levelName,worldModelLink,playerModelLink
// Behaviour constant
const standIdle=['BreathingIdle','OffensiveIdle','ArmStretching','NeckStretching','LookAround','WeightShift','LookingBehind']
const playerHit=['Reacting','Agreeing','LookOverShoulder','DrunkIdleVariation','ThoughtfulHeadShake','ShoveReaction','GettingHit','ShakeFist','PointingGesture','Talking']
// Multiplayer variables
var onlineMultiplayer={uid:[],target:[],ready:true,myContacts:null}
var onlinePosition={x:0,y:0,z:0,o:0,update:0}
// Utility variables
var orientation,isMobile=false
// Android
var meAndF=false
// System variables
var fbLdF
const uiAssets=[
  'codes/fquery.js',
  'assets/js/sha256.min.js',
  'assets/js/vequery.js',
  'assets/js/emojis.js',
  'assets/js/circular-json.js',
  'assets/js/terrain.js',
  'assets/js/levels.js',
]
// Engine variables
var engineParameters={
  url:null,
  world:null,
  camera:null,
  vr:false,
  cameras:null,
  cameraIndex:0,
  scene:null,
  water:null,
  sun:null,
  sky:null,
  pmremGenerator:null,
  sunShadow:null,
  csm:null,
  ambientLight:null,
  renderer:null,
  fxaaPass:null,
  orbitControl:null,
  lookElevation:0,
  isWaterLoaded:null,
  effect:0,
  size:1000,
  sound:false,
  maxAnisotropy:null,
  objectModel:[],
  objectMass:[],
  objectPhysics:[],
  objectOffset:[],
  objectSounds:[],
  objectReward:[],
  objectPrice:[],
  objectAnimation:[],
  objectSelect:0,
  addedModels:[],
  models:[],
  broken:[],
  archive:[],
}
var playerParameters
var playerControlsParameters={
  animation:'amareekon.glb,eadiedavies.glb,mariamoore.glb,marlonkabilin.glb,umbawa.glb',
  player:null,
  stickState:'avatar',
  direction:[],
  velocity:[],
  speed:0,
  onfloor:[],
  alive:[],
  stunned:[],
  hitted:null,
  physics:[],
  height:[],
  mass:[],
  model:[],
  offset:[],
  invertQuaternion:[],
  mySeat:[],
}
var modelsParameters={
  loaded:0,
  complete:false,
  playerMixers:[],
  objectMixers:[],
  meshesData:[],
  objectMeshes:[],
  vehicleMeshes:[],
  vehicle:[],
  chassisMeshes:[],
  driveVehicleIndex:[],
  vehicleMotor:[],
  driveAnchor:[],
  driveSeat:[],
  driveDoor:[],
  isOccupied:[],
  carEngine:[],
  soundCarEngine:[],
}
var myAvatars=[
  {name:'amareekon',type:'player',loader:true,x:0,y:0,z:0,o:0,s:1,si:0,ht:1.55,kg:47,of:0},
  {name:'eadiedavies',type:'player',loader:true,x:0,y:0,z:0,o:0,s:1,si:0,ht:1.5,kg:42,of:0},
  {name:'mariamoore',type:'player',loader:true,x:0,y:0,z:0,o:0,s:1,si:0,ht:1.5,kg:44,of:-.02},
  {name:'marlonkabilin',type:'player',loader:true,x:0,y:0,z:0,o:0,s:1,si:0,ht:1.7,kg:82,of:.08},
  {name:'umbawa',type:'player',loader:true,x:0,y:0,z:0,o:0,s:1,si:0,ht:1.8,kg:97,of:.12},
]
var pixelRatio=1
// Loader variables
var fn,fp
// Sound variables
var playSounds=[]
// ==== JAVASCRIPT & STYLE ====
// Uload script
function uloadScript(nm){
  te=document.getElementsByTagName('script')
  for(y=te.length;y>=0;y--){
    if(te[y]&&te[y].getAttribute('src')!=null&&te[y].getAttribute('src').indexOf(nm)!=-1)te[y].parentNode.removeChild(te[y])
  }
}
// Uload style
function uloadStyle(nm){
  te=document.getElementsByTagName('link:none')
  for(y=te.length;y>=0;y--){
    if(te[y]&&te[y].getAttribute('href:none')!=null&&te[y].getAttribute('href:none').indexOf(nm)!=-1)te[y].parentNode.removeChild(te[y])
  }
}
// Load script
function loadScript(jn,tg,typ){
  js=document.createElement('script')
  if(typ===undefined)typ='text/javascript'
  js.setAttribute('type',typ)
  js.setAttribute('src',jn)
  if(typeof js!="undefined")document.getElementsByTagName(tg)[0].appendChild(js)
}
// Load style
function loadStyle(cn,tg){
  var cs=document.createElement('link')
  cs.setAttribute('rel','stylesheet')
  cs.setAttribute('type','text/css')
  cs.setAttribute('href',cn)
  if(typeof cs!='undefined')document.getElementsByTagName(tg)[0].appendChild(cs)
}
// ==== GET URL ====
function isURL(){
  url=urlCodChr(location.href.split('#').slice(-1).toString())
  if(url.includes('world=')){
    if(url.includes('?')){
      myUserID.uid=url.split('?').slice(-1).toString()
      myUserID.account=uidSN(myUserID.uid,4,5)
      lsSv('myUserID',JSON.stringify(myUserID))
      url=url.split('?')[0]
    }
    allLevels=allLevels()
    for(i=0;i<allLevels.length;i++){
      if(allLevels[i].levelName==url.replace('world=','')){
        allLevels[i].parameters=[].concat(isOnL()?myAvatars[Math.floor(Math.random()*myAvatars.length)]:myAvatars[0],allLevels[i].parameters)
        engineParameters.url=allLevels[i]
        continue
      }
    }
  }else engineParameters.url=JSON.parse(url.replace('load=',''))
  return !JSON.stringify(engineParameters.url).match(/(engine\/engine)/)
}
//Convert URL %Codes to char
function urlCodChr(url){
  return url.toString().replace(/%2C/g,',').replace(/%CF%85/g,'υ').replace(/%CF%82/g,'ς').replace(/%20/g,' ').replace(/%26/g,'&').replace(/%27/g,"\'").replace(/%22/g,'\"').replace(/%3C/g,'\<').replace(/%3E/g,'\>').replace(/%28/g,'(').replace(/%29/g,')').replace(/%5B/g,'[').replace(/%5D/g,']').replace(/%7B/g,'{').replace(/%7D/g,'}')
}
// ==== LOCAL STORAGE ====
// Save to local storage
function lsSv(lKey,lObj){localStorage.setItem(lKey,lObj)}
function lsRd(lKey){return localStorage.getItem(lKey)}
function lsEr(lKey){localStorage.removeItem(lKey)}
// ==== DETECT DEVICE ====
// Get orientation
function getOrientation(){
  isMobile=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  orientation=window.innerWidth>window.innerHeight
}
// Detect if connected
function isOnL(){
  if(fbLdF){
    if(meAndF){
      return AppInterface.isAppOnline()
    }else if(navigator.onLine){
      return true
    }else return false
  }
}