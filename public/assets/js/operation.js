/**
* @name [js-operation]{https://www.umbawa.web.app}
* @app Virtual World Engine (Artificial World Project)
* @copyright Copyright operation.js, 2020
* @license Software: Open Source Free
* @project: Three & Cannon Virtual World Engine Project
* @written by: Eng'r Umbawa P. Sarosong
* @course: Bachelour of Science in Computer Engineer
* @major: Robotics and Automations [Weapon System Engineering]
* @specialization: Virtual Reality Artificial Intelligence Lifeform Project
* @university: AMA Computer College, Cagayan de Oro City
*/
// ==== VARIABLES ====
// Variables
var engineLevels,projectName='PairIsland',appLink=''//'https://xtysuq.web.app/'
// Load levels
function loadLevelsParameters(){
  return [
    {
      levelName:'virtualisland',
    },
  ]
}
// ==== OPERATIONS ====
// Load engine
var loadF,allLevels
function loadEngine(i){
  if(loadF==false){
    loadF=true
    if(i==0||lsRd('status'+allLevels[i-1].levelName)!=null){
      lsSv('status'+allLevels[i].levelName,'_opened')
      if(allLevels[i].parameters!==undefined){
        allLevels[i].parameters=[].concat(isOnL()?myAvatars[Math.floor(Math.random()*myAvatars.length)]:myAvatars[0],allLevels[i].parameters)
        location.href=appLink+'engine/engine.html#load='+JSON.stringify(allLevels[i])
      }else location.href=appLink+'engine/engine.html#world='+allLevels[i].levelName+'?'+myUserID.uid
    }else shwDiaMsg(projectName.toLowerCase()+`.png`,projectName,`Please visit the "`+allLevels[i-1].levelName+`" world first`,null,`$('#diaModal').fadeOut('fast')`,`<i class="fa fa-sign-out" style="margin-right:7px"></i>Dismiss`,null,null)
    setTimeout(function(){loadF=false},300)
  }
}
// Load levels
function loadLevels(s0){
  if(s0!=null){
    allLevels=[].concat(engineLevels,JSON.parse(s0)[0])
  }else allLevels=engineLevels
  s0=''
  ex0='_opened'
  loadF=false
  for(i=0;i<allLevels.length;i++){
    if(i>0){
      ex0=lsRd('status'+allLevels[i-1].levelName)
      if(ex0==null)ex0=''
    }
    if(allLevels[i]!=null){
      if(allLevels[i].thumb!==undefined){
        if(ex0==''){
          im=allLevels[i].thumb
        }else im=allLevels[i].opened
      }else im=`assets/images/`+allLevels[i].levelName+ex0+`.jpg`
      s0+=`<img class="engineItems"
        src="`+im+`"
        onerror="$(this).attr('src','assets/images/thumb`+ex0+`.jpg')"
        ontouchend="loadEngine(`+i+`)"
        onmouseup="if(!isMobile)loadEngine(`+i+`)">`
    }
  }
  $('#engineGallery').html(s0)
}
// Load new online levels
function loadNewOnlineLevels(fKey,tag){
  if(isOnL())onRd(fKey,[tag],`if(onRe.data!=null){
    s0=JSON.stringify(onRe.data)
    lsSv('newOnlineLevels',s0)
    loadLevels(s0)
  }`)
}
// New project
function newProject(){
  loadNewOnlineLevels('newlevels',projectName.toLowerCase())
  shwDiaMsg(`newproject.png`,projectName,`Project name<input style="font-size:24px;background-color:#755eb5;color:white" id="projectName"/>`,null,`$('#diaModal').fadeOut('fast');createProject(false)`,`Blank`,`$('#diaModal').fadeOut('fast');createProject(true)`,`Sea`)
  setTimeout(function(){$('#projectName').select()},100)
}
// Create project
function createProject(c0){
  i0=`newproject`
  if($('#projectName').val()!=''){
    if(isOnL()){
      uploadNewOnlineLevels('newlevels/'+projectName.toLowerCase()+'/',c0)
      m0=`You have created "`+$('#projectName').val()+`" virtual world`
    }else{
      i0=`nointernet`
      m0=`Unable to create "`+$('#projectName').val()+`", because you are not connected to the internet!`
    }
  }else m0=`No project is saved!`
  shwDiaMsg(i0+`.png`,projectName,m0,null,`newProject()`,`Back`,`$('#diaModal').fadeOut('fast')`,`Dismiss`)
}
// Upload new online levels
function uploadNewOnlineLevels(fKey,c0){
  s0=lsRd('newOnlineLevels')
  if(s0!=null){
    s0=JSON.parse(s0)
  }else s0=''
	onSv(fKey,[
    {
      levelName:$('#projectName').val().toLowerCase(),
      mission:'Project '+$('#projectName').val()+' by '+myUserID.name,
      prerequisite:null,
      required:'amount',
      proximity:1.5,
      amount:50,
      index:0,
      parameters:[
        c0?'':{type:'ground'}
      ],
      spawn:[
        {x:0,y:0,z:0,o:0,s:10},
      ],
      online:true,
      water:c0,
      debug:false,
    },
    s0==''?s0:s0[0][0]
  ])
  setTimeout(function(){
    loadNewOnlineLevels('newlevels',projectName.toLowerCase())
  },1200)
}
// Load online levels
function loadOnlineLevels(){
  s0=lsRd('newOnlineLevels')
  if(s0==null)shwDiaMsg(`welcome.png`,projectName,`Do you wish to download new levels`,null,`$('#diaModal').fadeOut('fast')`,`Dismiss`,`$('#diaModal').fadeOut('fast');loadNewOnlineLevels('newlevels','`+projectName.toLowerCase()+`')`,`Download`)
  loadLevels(s0)
}
// ==== SYSTEM ====
//Exit android app
function exApp(c0){
  shwDiaMsg(`exitapp.png`,projectName,`Do you want leave the "`+projectName+`"?`,null,`$('#diaModal').fadeOut('fast');setTimeout(function(){AppInterface.exitApp('leave')},300)`,`Exit`,null,null)
}
//Show dialog
function shwDiaMsg(im,t0,m0,i0,f0,b0,f1,b1){
  if(t0!=null){t0=`<div class="section-caption" style="margin-top:-24px"><p>`+t0+`</p></div>`}else{t0=``}
  pim=``;if(im!=null){if(!im.includes('/')){pim=`assets/images/`}}
  if(im!=null){im=`<img src="`+pim+im+`" width="56" height="56" alt="" style="object-fit:cover;margin-right:15px;margin-top:10px">`}else{im=``}
  if(i0!=null){i0=`<div style="display:flex;justify-content:center;align-items:center">`+i0+`</div>`}else{i0=``}
  if(b0!=null){b0=`<button class="btn-action active" ontouchend="`+f0+`" onmouseup="if(!isMobile){`+f0+`}" style="min-width:100px;cursor:pointer">`+b0+`</button>`}else{b0=``}
  if(b1!=null){b0+=`<button class="btn-action active" ontouchend="`+f1+`" onmouseup="if(!isMobile){`+f1+`}" style="margin-left:15px;min-width:100px">`+b1+`</button>`}
  $('#diaModal').fadeOut('fast');
  $('#diaMessage').html(`<section>`+t0+`
      <div style="display:flex">`+im+`<p class="section-title" style="margin:0px;color:#755eb5;font-size:18px;text-shadow:none" id="top-message">
          `+m0+`
        </p>
      </div>
      `+i0+`
      <div style="display:flex;justify-content:center;align-items:center">
        `+b0+`
      </div>
    </section>`);
  $('#diaModal').fadeIn('fast')
}
//Local storage
function lsSv(lKey,lObj){localStorage.setItem(lKey,lObj)}
function lsRd(lKey){return localStorage.getItem(lKey)}
function lsEr(lKey){localStorage.removeItem(lKey)}
//Initialize
$(document).ready(function(){
  if(myUserID.uid==null)userUID()
  engineLevels=loadLevelsParameters()
  loadLevels(null)
  loadEngine(0)
})
