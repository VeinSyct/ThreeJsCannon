// - - - - - - - - - - - - - - - - - - - -
// @app Realverse consumable subscription
// @usage Realverse embeeding application
// - - - - - - - - - - - - - - - - - - - -
class realverse{
    constructor(e){
		this.e=e
	}
    create(e){
        // STYLE
        let style=document.createElement('style')
        style.setAttribute('id','realverse')
        style.innerHTML=`
            html,body{
                margin:0;
                padding:0;
                overflow:hidden;
            }
            .iframe{
                margin:0;
                padding:0;
                overflow:hidden;
            }`
        document.head.appendChild(style)
        // CANVAS
        let canvas=document.createElement('div')
        canvas.id=e.id
        document.body.appendChild(canvas)
        if(navigator.onLine){
            canvas.innerHTML='<iframe class="iframe" type="text/html" src="'+e.url+'" style="width:100%;height:100vh" id="'+e.id+'-iframe"></iframe>'
            return true
        }
    }
    load(e){
        setTimeout(function(){
            window[e.id+'-iframe'].src=e.url+'#level='+location.pathname.split('/').slice(-1)[0].replace('.html','')
            window[e.id+'-iframe'].src=e.url+'#origin='+JSON.stringify(e.origin)
            if(e.cars)for(let i=0;i<e.cars.length;i++){
                let car=allVehicles(e.cars[i].model,e.cars[i].state,e.cars[i].activity,e.cars[i].colors,e.cars[i].weight)
                for(let j=0;j<3;j++)window[e.id+'-iframe'].src=e.url+'#assets='+JSON.stringify(car[j])
            }
            if(e.assets)for(let i=0;i<e.assets.length;i++)window[e.id+'-iframe'].src=e.url+'#assets='+JSON.stringify(Object.assign({},{
                si:0,sl:['beatloop'],sh:null,zone:i==0?'ZONEA1':'zonea1'
            },e.assets[i]))
        },e.delay)
    }
}
export{realverse}
