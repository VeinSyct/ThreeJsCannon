class JoystickController{
	constructor(stickID,maxDistance,deadzone){
		this.id=stickID
		let stick=document.getElementById(stickID)
		this.dragStart = null
		this.touchId = null
		this.active = false
		this.value={x:0,y:0}
		let self=this
		function handleDown(event){
	    self.active=true
			stick.style.transition='0s'
			event.preventDefault()
	    if(event.changedTouches)
	    	self.dragStart={x:event.changedTouches[0].clientX,y:event.changedTouches[0].clientY}
	    else
	    	self.dragStart={x:event.clientX,y:event.clientY}
	    if(event.changedTouches)
	    	self.touchId=event.changedTouches[0].identifier
		}
		function handleMove(event){
	    if(!self.active)return
	    let touchmoveId=null
	    if(event.changedTouches){
	    	for(let i=0;i<event.changedTouches.length;i++){
	    		if (self.touchId==event.changedTouches[i].identifier){
	    			touchmoveId=i
	    			event.clientX=event.changedTouches[i].clientX
	    			event.clientY=event.changedTouches[i].clientY
	    		}
	    	}
	    	if(touchmoveId==null)return
	    }
	    const xDiff=event.clientX-self.dragStart.x
	    const yDiff=event.clientY-self.dragStart.y
	    const angle=Math.atan2(yDiff,xDiff)
			const distance=Math.min(maxDistance,Math.hypot(xDiff,yDiff))
			const xPosition=distance*Math.cos(angle)
			const yPosition=distance*Math.sin(angle)
	    stick.style.transform=`translate3d(${xPosition}px,${yPosition}px,0px)`
			const distance2=(distance<deadzone)?0:maxDistance/(maxDistance-deadzone)*(distance-deadzone)
	    const xPosition2=distance2*Math.cos(angle)
			const yPosition2=distance2*Math.sin(angle)
	    const xPercent=parseFloat((xPosition2/maxDistance).toFixed(4))
	    const yPercent=parseFloat((yPosition2/maxDistance).toFixed(4))
	    self.value={x:xPercent,y:yPercent}
	  }
		function handleUp(event){
	    if(!self.active)return
	    if(event.changedTouches&&self.touchId!=event.changedTouches[0].identifier)return
	    stick.style.transition='.2s'
	    stick.style.transform=`translate3d(0px,0px,0px)`
	    self.value={x:0,y:0}
	    self.touchId=null
	    self.active=false
		}
		stick.addEventListener('mousedown',handleDown)
		stick.addEventListener('touchstart',handleDown)
		document.addEventListener('mousemove',handleMove,{passive:false})
		document.addEventListener('touchmove',handleMove,{passive:false})
		document.addEventListener('mouseup',handleUp)
		document.addEventListener('touchend',handleUp)
	}
}
