/**
* @name [js-vequery]{https://www.umbawa.web.app}
* @app Virtual World Engine
* @copyright Copyright vequery.js, 2020
* @license Software: Open Source Free
* @project: Virtual World Engine Project
* @written by: Eng'r Umbawa P. Sarosong
* @course: Bachelour of Science in Computer Engineer
* @major: Robotics and Automations [Weapon System Engineering]
* @specialization: Virtual Reality Artificial Intelligence Lifeform Project
* @university: AMA Computer College
*/
// ==== SYSTEM INITIALIZATION ====
// Vrrency license control string
var cStr='alq<wfi"rB"t##!5hnbd$.nqn!P"vbxgJ!wj$fi#X"!cNrpo#n!5!j#%1hop!l#Lvg$cIcnsesb]#h$#!9ct$rK$rs$"e-$jk%#Kfb"#"2%s'
var charString='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
// Rithmytic engine variables
var fBOn=opFlag=false,vAIn=null,inStr=''
// Upload variables
var cmprsF=false,upKey=null,imMxSz=null,imgQa=1,upFlNme,upFlURL,flMxSz=null
// Database variables
var onRe={received:0,total:0,key:null,target:null,data:null,exist:null,contact:null,contacts:[]}
let myUserID={uid:null,contact:null,account:null,name:'Noname',profile:null,update:null,notification:null}
// ==== RYTHMETIC ENGINE ====
// Derivative
function cDer(n){return cStr.charAt(n).charCodeAt(0)}
// EnFormat
function enFrmt(txtString){txtString=txtString.replace(/\\/g,"\\\\");return txtString.replace(/"/g,"\\\"")}
// DeFormat
function deFrmt(txtString){txtString=txtString.replace(/\\\\/g,"\\");return txtString.replace(/\\"/g,"\"")}
// ==== ARITMETIC CALCULATION ====
// Addition
function enAdStr(txtString){
  s0=oRyt('enadd')
  if(s0!='er44'){
    enadd=null
    if(s0!=null)$("#calCulus").html(deSuStr(s0));s0=true
    return opEnAddStr(txtString)
  }return 'er44'
}
// Subtraction
function deSuStr(txtString){
  s0=oRyt('desub')
  if(s0!='er44'){
    desub=null
    if(s0!=null)$("#calCulus").html(deFcStr(deFrmt(s0)));s0=true
    return opDeSubStr(txtString)
  }return 'er44'
}
// ==== INTEGRAL CALCULUS ====
// Multiplication | Division
function enDeMuDiStr(txtString){
  s0=oRyt('enmul')
  if(s0!='er44'){
    enmul=null
    if(s0!=null)$("#calCulus").html(deSuStr(s0));s0=true
    return opEnDeMulDivStr(txtString)
  }return 'er44'
}
// ==== DIFFERENTIAL EQUATION ====
// Fraction
function enFrStr(txtString){
  s0=oRyt('enfra')
  if(s0!='er44'){
    enfra=null
    if(s0!=null)$("#calCulus").html(deSuStr(s0));s0=true
    return opEnFraStr(txtString)
  }return 'er44'
}
// Faction
function deFcStr(txtString){
  s0=oRyt('pdefc')
  if(s0!='er44'){
    pdefc=null
    if(s0!=null)$("#calCulus").html(s0);s0=true
    return opDeFacStr(txtString)
  }return 'er44'
}
// ==== REALTIME DATABASE ====
// Save online database
function onSv(fKey,s0){enDB();firebase.database().ref(fKey).set(s0)}
// Realtime connection
function onCo(fKey,ret,sel){
  firebase.database().ref(fKey).on('value',data=>{
    data.forEach(root=>{
      if(sel=='player'){
        onRe.key=root.key
        onRe.target=root.val()
      }
      if(sel=='notification')onRe.contact=root.key
      $('#calCulus').html(`<script>function retReceived(){`+ret+`}</script>`)
      retReceived()
    })
  })
}
// Read online database
function onRd(fKey,tag,ret){
  enDB()
  onRe.total=tag.length
  onRe.received=0
  onRe.data=[]
  for(oi0=0;oi0<tag.length;oi0++){
    firebase.database().ref(fKey).child(tag[oi0]).get().then((snapshot)=>{
      if(snapshot.exists()){
        onRe.data.push(snapshot.val())
      }else onRe.data.push(null)
      onRe.received++
      if(onRe.received==onRe.total){
        $('#calCulus').html(`<script>function retReceived(){`+ret+`}</script>`)
        retReceived()
      }
    }).catch((err)=>{
      if(err.message=='Permission denied')onRd(fKey,tag,ret)
    })
  }
}
// Check if data exist in online database
function fExst(fKey,tg,ret){
  enDB()
  firebase.database().ref(fKey).once('value',function(snapshot){
    onRe.exist=snapshot.child(tg).exists()
    $('#calCulus').html(`<script>function retExisting(){`+ret+`}</script>`)
    retExisting()
  })
}
// Received specific realtime connection
function reFdb(data){
  notifyReceiver(data)
}
function erFdb(err){
  // Error here...
}
function opNOP(){
  // No operation...
}
// ==== USER ID ====
// User UID
function userUID(){
  if(lsRd('myUserID')!=null)myUserID=JSON.parse(lsRd('myUserID'))
  if(myUserID.uid==null){
    myUserID.uid=genRan(charString,1)
    d=cDtTm().slice(7,14)
    u0=genRan('123456789'+charString,21)
    for(u1=0;u1<d.length;u1++){
      for(u2=0;u2<3;u2++)myUserID.uid+=u0[u1+u2*d.length]
      if(d[u1]=='0'){
        myUserID.uid+=genRan(charString,1)
      }else myUserID.uid+=d[u1]
    }
    myUserID.account=uidSN(myUserID.uid,4,5)
    lsSv('myUserID',JSON.stringify(myUserID))
  }return myUserID.uid
}
// Generate serial
function genSN(ln0){sn='';for(gr0=0;gr0<ln0;gr0++){sn+=genRan('01234567890',4);if(gr0<ln0-1)sn+='-'}return sn}
// Convert UID to serial number
function uidSN(id,b,l){u=xtDgfmSt(sha256(id));id='';for(ui0=0;ui0<l;ui0++){id+='-'+u.slice(ui0*b,ui0*b+b)}return id.replace('-','')}
// Extract digit from string
function xtDgfmSt(s0){return s0.match(/\d+/g).toString().replace(/,/g,'')}
// Generate random char,length
function genRan(rs0,ln1){
	ra0=''
	for(gr1=0;gr1<ln1;gr1++){
		ra1=Math.floor(Math.random()*rs0.length)
		ra0+=rs0.substring(ra1,ra1+1)
	}return ra0
}
//========= DATE TIME =========
// Get current time
function getTime(){
  d=new Date();hrs=d.getHours();min=d.getMinutes();apm=hrs>=12?'PM':'AM'
  hrs=hrs%12;hrs=hrs?hrs:12;hrs=hrs<10?' '+hrs:hrs
  return hrs+':'+(min=min<10?'0'+min:min)+' '+apm
}
// Get current date only
function cDtNly(){
  m=new Date()
  return m.getUTCFullYear()+("0"+(m.getUTCMonth()+1)).slice(-2)+("0"+m.getUTCDate()).slice(-2)
}
// Get business date & time
function cNow(){m=new Date();return m.toDateString()+' at '+getTime()}
// Convert number to time
function noTm(t0){
  m=Math.floor(t0/60);if(m<10){m='0'+m}
  s=Math.floor(t0%60);if(s<10){s='0'+s}
  return m+':'+s
}
// Get seconds
function cSec(){d=new Date();return parseInt(d.getSeconds())}
// Get current date & time
function cDtTm(){
  m=new Date()
  return m.getUTCFullYear()
  +("0"+(m.getUTCMonth()+1)).slice(-2)
  +("0"+m.getUTCDate()).slice(-2)
  +("0"+m.getUTCHours()).slice(-2)
  +("0"+m.getUTCMinutes()).slice(-2)
  +("0"+m.getUTCSeconds()).slice(-2)
}
// ==== UTILITY ====
// Scroll to element
function eScrl(e,c0){document.getElementById(e).scrollIntoView({block:c0,behavior:'smooth'})}
// Strip off HTML tags
function stripHTML(s0){return s0.replace(/(<([^>]+)>)/gi,'')}
// Copy to clipboard
window.copyToClipboard=function(s0){
  if(isMobile){
    s1=document.createElement('textarea')
    document.body.appendChild(s1)
    s1.value=s0
    s1.select()
    document.execCommand('copy')
    document.body.removeChild(s1)
  }else navigator.clipboard.writeText(s0)
}
// Progress bar
function showProgress(p0,c0,m0,s0){
  $('#progressText').text(m0)
  $('#loadingFill').css('background-color',c0)
  $('#loadingFill').css('width',p0)
  if(s0)$('#loadingBar').fadeIn('fast')
}
// Insert commas
function iCommas(n){n=n.toString();var pattern=/(-?\d+)(\d{3})/;while(pattern.test(n))n=n.replace(pattern,"$1,$2");return n}
// Convert string emoji to string
function emoString(e0){
  return e0.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,function(e){return '&#x'+emoHex(e)})
}
// Covert emoji hexcode
function emoHex(e2){
  if(e2.length===1){e3=e2.charCodeAt(0)}
  e3=((e2.charCodeAt(0)-0xD800)*0x400+(e2.charCodeAt(1)-0xDC00)+0x10000);
  if(e3<0){e3=e2.charCodeAt(0)}return e3.toString('16')
}
// Text length
function txLen(s0,l0,l1){if(isMobile){l0=l1}if(s0.length>l0){return s0.slice(0,l0)+'...'}else{return s0}}
// Linear interpolation
function interpolate(start,end,amt){
  return (1-amt)*start+amt*end
}
