function allLevels(){
  return [
    {
      uid:myUserID.uid,
      levelName:'virtualisland',
      mission:'Explore virtual island and learn where luck or efforts will take you',
      prerequisite:null,
      required:'amount',
      proximity:15,
      amount:1000000,
      index:0,
      parameters:[
        /* CARS */

        {name:'mercedesclassw212body',type:'vehiclebody',loader:'glb',x:[180.5],y:[0],z:[28],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[1200],of:{xF:1.6,xR:1.3,yL:-.3,yR:-.3,zL:.8,zR:.8,ac:.6,ao:.1,seat:[{dx:-.1,dy:-.95,dz:.37,do:1.5,ao:.1},{dx:-.1,dy:-.95,dz:-.37,do:-1.5},{dx:.9,dy:-.95,dz:.37,do:1.5},{dx:.9,dy:-.95,dz:0,do:-1.5},{dx:.9,dy:-.95,dz:-.37,do:-1.5}],cy:6},sl:'engine',sh:'hardmetalimpact',pc:'64000-64000',px:2.5,ds:100},
        {name:'mercedesclassw212wheel',type:'wheel',loader:'glb',x:[180.5],y:[4.05],z:[28],o:[{x:0,y:0,z:0}],s:[1.05],si:0,kg:[0],ds:100},
        {name:'mercedesclassw212chassis',type:'chassis',loader:'glb',x:[180.5],y:[4.05],z:[28],o:[{x:0,y:90,z:0}],s:[1],si:0,kg:[0],ds:100},

        {name:'rollsroysghostbody',type:'vehiclebody',loader:'glb',x:[430],y:[4.05],z:[53],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[1200],of:{xF:1.95,xR:1.55,yL:-.35,yR:-.35,zL:.8,zR:.8,ac:.6,ao:.1,seat:[{dx:-.14,dy:-.35,dz:.43,do:1.5,ao:.1},{dx:-.14,dy:0,dz:-.43,do:-1.5},{dx:.9,dy:0,dz:.43,do:1.5},{dx:.9,dy:0,dz:0,do:-1.5},{dx:.9,dy:0,dz:-.43,do:-1.5}],cy:6},sl:'engine',sh:'hardmetalimpact',pc:'5000-5000',px:2.5,ds:100},
        {name:'rollsroysghostwheel',type:'wheel',loader:'glb',x:[430],y:[4.05],z:[53],o:[{x:0,y:0,z:0}],s:[1.05],si:0,kg:[0],ds:100},
        {name:'rollsroysghostchassis',type:'chassis',loader:'glb',x:[430],y:[4.05],z:[53],o:[{x:0,y:216,z:0}],s:[1],si:0,kg:[0],ds:100},

        {name:'chevroletimpalabody',type:'vehiclebody',loader:'glb',x:[-282],y:[4.05],z:[200],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[1200],of:{xF:1.865,xR:1.35,yL:-.55,yR:-.55,zL:.95,zR:.95,ac:.6,ao:-.05,seat:[{dx:-.17,dy:-1,dz:.43,do:1.5},{dx:-.17,dy:-1,dz:-.43,do:-1.5},{dx:.6,dy:-1,dz:.43,do:1.5},{dx:.6,dy:-1,dz:-0,do:-1.5},{dx:.6,dy:-1,dz:-.43,do:-1.5}],cy:6},sl:'engine',sh:'hardmetalimpact',pc:'0-0',px:2.5,ds:100},
        {name:'chevroletimpalawheel',type:'wheel',loader:'glb',x:[-282],y:[4.05],z:[200],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:100},
        {name:'chevroletimpalachassis',type:'chassis',loader:'glb',x:[-282],y:[4.05],z:[200],o:[{x:0,y:120,z:0}],s:[1],si:0,kg:[0],ds:100},

        /* ROADS HORIZONTAL ELEMENTS */
        {name:'pierbroadsbody',type:'trimesh',loader:'glb',x:[290],y:[3.01],z:[0],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:250},
        {name:'pierbroads',type:'objectmesh',loader:'glb',x:[290],y:[3.01],z:[0],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:400},

        {name:'pierbrdigebody',type:'trimesh',loader:'glb',x:[0],y:[16],z:[0],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:150},
        {name:'pierbrdige',type:'objectmesh',loader:'glb',x:[0],y:[3.01],z:[0],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:650},

        {name:'flyoverrightbody',type:'trimesh',loader:'glb',x:[-210.991],y:[3.01],z:[40.818],o:[{x:0,y:30,z:0}],s:[1],si:0,kg:[0],ds:50},
        {name:'flyoverleftbody',type:'trimesh',loader:'glb',x:[-184.991],y:[3.01],z:[85.852],o:[{x:0,y:30,z:0}],s:[1],si:0,kg:[0],ds:50},

        {name:'pieraroadsbody',type:'trimesh',loader:'glb',x:[-335],y:[3.01],z:[95],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:300},
        {name:'pieraroads',type:'objectmesh',loader:'glb',x:[-335],y:[3.01],z:[95],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:450},

        /* ROADS VERTICAL BODIES */
        {name:'streetlightbody',type:'polyhedron',loader:'glb',
        x:[
          -215.221,-223.439,-210.049,-193.663,
          442.32,426.856,384.605,-530.859,-479.114,-500.985,
          247.45,247.45,238,213,188,178.55,178.55,
          -237.21,-227.21,-226.869,-248.52,-270.17,-286.879,-296.879,
          73.676,24.563,-24.563,-73.676,
          368.491,341.752,307.95,269.95,232,194,156,118.05,
          -448.514,-411.832,-374.274,-341.365,-308.499,-275.59,-242.725,-209.816,-176.907,-143.998,-113.753
        ],
        y:[
          6.318,10.799,10.799,6.318,
          3,3,3,3,3,3,
          3,3,3,3,3,3,3,
          3,3,3,3,3,3,3,
          5.181,15.838,15.838,5.181,
          3,3,3,3,3,3,3,3,
          3,3,3,3,3,3,3,3,3,3,3
        ],
        z:[
          48.38,62.566,85.758,85.72,
          42.762,-14.952,58.226,154.384,124.509,206.129,
          35,55,72.05,72.05,72.05,55,35,
          143.713,161.033,180.524,193.024,205.524,195.483,178.163,
          -14.117,-6.248,6.248,14.116,
          .137,-13.058,-15,-15,-15,-15,-15,-15,
          176.449,181.785,165.112,146.112,127.137,108.137,89.162,70.162,51.162,32.162,16.942
        ],o:[
          {x:0,y:30,z:0},{x:0,y:120,z:0},{x:0,y:120,z:0},{x:0,y:30,z:0},
          {x:0,y:60,z:0},{x:0,y:150,z:0},{x:0,y:330,z:0},{x:0,y:255,z:0},{x:0,y:165,z:0},{x:0,y:345,z:0},
          {x:0,y:90,z:0},{x:0,y:90,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:270,z:0},{x:0,y:270,z:0},
          {x:0,y:120,z:0},{x:0,y:120,z:0},{x:0,y:30,z:0},{x:0,y:30,z:0},{x:0,y:30,z:0},{x:0,y:300,z:0},{x:0,y:300,z:0},
          {x:0,y:4.2,z:0},{x:0,y:13.2,z:0},{x:0,y:13.2,z:0},{x:0,y:4.2,z:0},
          {x:0,y:150,z:0},{x:0,y:165,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},
          {x:0,y:165,z:0},{x:0,y:7.5,z:0},{x:0,y:210,z:0},{x:0,y:210,z:0},{x:0,y:210,z:0},{x:0,y:210,z:0},{x:0,y:210,z:0},{x:0,y:210,z:0},{x:0,y:210,z:0},{x:0,y:210,z:0},{x:0,y:195,z:0}
        ],s:[
          1,1,1,1,
          1,1,1,1,1,1,
          1,1,1,1,1,1,1,
          1,1,1,1,1,1,1,
          1,1,1,1,
          1,1,1,1,1,1,1,1,
          1,1,1,1,1,1,1,1,1,1,1
        ],si:0,
        kg:[
          0,0,0,0,
          0,0,0,0,0,0,
          0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,
          0,0,0,0,
          0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0
        ],sl:null,sh:'metalpole',ds:40},

        {name:'parkingkioskbody',type:'polyhedron',loader:'glb',x:[247.631,178.369,-232.553,-292.536],y:[3.01,3.01,3.01,3.01],z:[44,44,151.416,186.048],o:[{x:0,y:0,z:0},{x:0,y:180,z:0},{x:0,y:30,z:0},{x:0,y:210,z:0}],s:[1,1,1,1],si:0,kg:[0,0,0,0],sl:null,sh:'metalimpact',pc:'.5-1',px:1.2,ds:40},

        {name:'chargingstationbody',type:'polyhedron',loader:'glb',x:[231.9,231.9,213,213,194.1,194.1],y:[3.01,3.01,3.01,3.01,3.01,3.01],z:[46,36,46,36,46,36],o:[{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0}],s:[1,1,1,1,1,1],si:0,kg:[0,0,0,0,0,0],sl:null,sh:'hitdrum',pc:'.25-3',px:1.2,ds:40},

        {name:'flyovercolumnbody',type:'polyhedron',loader:'glb',x:[-220.6,-228.291,-204.591],y:[9.988,9.613,9.613],z:[76.382,53.457,94.508],o:[{x:0,y:75,z:0},{x:0,y:23,z:0},{x:0,y:37,z:0}],s:[1,1,1],si:0,kg:[0,0,0],sl:null,sh:'heavyimpact',ds:40},

        {name:'bridgecolumnbody',type:'polyhedron',loader:'glb',x:[0,28,-28],y:[13.65,12.6,12.6],z:[0,-7,7],o:[{x:0,y:195,z:0},{x:0,y:105,z:0},{x:0,y:105,z:0}],s:[1,1,1],si:0,kg:[0,0,0],ds:60},

        {name:'roadsignbody',type:'polyhedron',loader:'glb',x:[-316.143,-267.947,-202.129,173.05,252.95],y:[3.01,3.01,3.01,3.01,3.01],z:[155.798,79.475,41.475,6,-36],o:[{x:0,y:-150,z:0},{x:0,y:30,z:0},{x:0,y:30,z:0},{x:0,y:180,z:0},{x:0,y:0,z:0}],s:[1,1,1,1,1],si:0,kg:[0,0,0,0,0],sl:null,sh:'fryingpan',ds:40},

        {name:'billboardbody',type:'polyhedron',loader:'glb',x:[346.117,213,-276.545,-429.685],y:[3.01,3.01,3.01,3.01],z:[10.89,16,144.483,160.27],o:[{x:0,y:150,z:0},{x:0,y:180,z:0},{x:0,y:-150,z:0},{x:0,y:-15,z:0}],s:[1,.85,.85,1],si:0,kg:[0,0,0,0],sl:null,sh:'panhit',ds:40},

        /* DYNAMIC ITEMS */
        {name:'trashbin',type:'object',loader:'glb',
        x:[
          430.197,448.108,381.262,
          -477.383,-537.315,-502.713,
          249.1,213.0,176.9,
          -229.681,-247.745,-292.208,
          288.95,288.95,213.0,
          -210.27,-242.27,-341.819,-373.819
        ],
        y:[
          3.7,3.7,3.7,
          3.7,3.7,3.7,
          3.7,3.7,3.7,
          3.7,3.7,3.7,
          3.7,3.7,3.7,
          3.7,3.7,3.7,3.7
        ],
        z:[
          -20.742,46.104,64.015,
          118.052,152.654,212.586,
          47.2,73.6,47.2,
          153.453,194.366,189.553,
          17.0,-47,-47,
          107.374,51.949,183.324,127.899
        ],
        o:[
          {x:0,y:150,z:0},{x:0,y:60,z:0},{x:0,y:330,z:0},
          {x:0,y:165,z:0},{x:0,y:255,z:0},{x:0,y:345,z:0},
          {x:0,y:90,z:0},{x:0,y:0,z:0},{x:0,y:270,z:0},
          {x:0,y:120,z:0},{x:0,y:30,z:0},{x:0,y:300,z:0},
          {x:0,y:0,z:0},{x:0,y:180,z:0},{x:0,y:180,z:0},
          {x:0,y:30,z:0},{x:0,y:210,z:0},{x:0,y:30,z:0},{x:0,y:210,z:0}
        ],
        s:[
          1,1,1,
          1,1,1,
          1,1,1,
          1,1,1,
          1,1,1,
          1,1,1,1
        ],si:0,
        kg:[
          5,5,5,
          5,5,5,
          5,5,5,
          5,5,5,
          5,5,5,
          5,5,5,5
        ],sl:null,sh:'hittincan',ds:100},

        {name:'totemstation',type:'object',loader:'glb',x:[250.2],y:[7],z:[19.8],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[100],sl:null,sh:'hitrim',ds:350},

        /* ROADS VERTICAL MESH */
        {name:'pierchargingstationvertical',type:'objectmesh',loader:'glb',x:[213.0],y:[3.01],z:[41],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:350},
        {name:'pierbroadsvertical',type:'objectmesh',loader:'glb',x:[290],y:[3.01],z:[0],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:350},
        {name:'pierbridgevertical',type:'objectmesh',loader:'glb',x:[0],y:[3.01],z:[0],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:350},
        {name:'pieraroadsvertical',type:'objectmesh',loader:'glb',x:[-335],y:[3.01],z:[95],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:350},

        /* PLATFORM */
        {type:'box',x:290,y:1.95,z:0,o:0,l:200,h:1,w:75,kg:0},
        {name:'pierbbody',type:'polyhedron',loader:'glb',x:[290],y:[-.45],z:[0],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:250},
        {name:'pierb',type:'objectmesh',loader:'glb',x:[290],y:[-.45],z:[0],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:400},

        {type:'box',x:-320,y:1.95,z:85,o:30,l:250,h:1,w:75,kg:0},
        {name:'pierabody',type:'polyhedron',loader:'glb',x:[-335],y:[-.45],z:[95],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:300},
        {name:'piera',type:'objectmesh',loader:'glb',x:[-335],y:[-.45],z:[95],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0],ds:450},

        {name:'seabed',type:'objectmesh',loader:'glb',x:[0],y:[-4],z:[0],o:[{x:0,y:0,z:0}],s:[1],si:0,kg:[0]},
        {type:'ground',x:0,y:-4,z:0},
      ],
      spawn:[
        {x:-279,y:3.1,z:212.5,o:180,s:1},
      ],
      online:true,
      water:true,
      debug:false,
    },
  ]
}
