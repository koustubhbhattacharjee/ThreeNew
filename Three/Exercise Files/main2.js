function getBox(w,h,d){
    var gmtry = new THREE.BoxGeometry(w,h,d);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)'
    })
    
    var mesh= new THREE.Mesh(
        gmtry,
        material
    )
    mesh.castShadow = true
    return mesh
    }
function getSphere(radius){
        var gmtry = new THREE.SphereGeometry(radius,24,24);
        var material = new THREE.MeshBasicMaterial({
            color: 'rgb(255,255,255)'
        })
        
        var mesh= new THREE.Mesh(
            gmtry,
            material
        )
        
        return mesh
        }

function getSpotLight(intensity){
            var light = new THREE.SpotLight(0xffffff,intensity)
            light.castShadow = true
            light.shadow.bias=0.001;
            light.shadow.mapSize.width=2048
            light.shadow.mapSize.height=2048
            return light
        }
function getPointLight(intensity){
    var light = new THREE.PointLight(0xff0000,intensity)
    light.castShadow = true
    return light
}
function getDirectionalLight(intensity){
    var light = new THREE.DirectionalLight(0xffffff,intensity)
    light.castShadow = true
    light.shadow.camera.left = -40;
    light.shadow.camera.right= 40;
    light.shadow.camera.bottom= -40;
    light.shadow.camera.top = 40;
    return light
}
function getAmbientLight(intensity){
    var light = new THREE.AmbientLight('rgb(10,30,10)',intensity)
    return light
}

function getPlane(size){
    var gmtry= new THREE.PlaneGeometry(size,size);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)',
        side: THREE.DoubleSide
    })
    
    var mesh= new THREE.Mesh(
        gmtry,
        material
    )
    mesh.receiveShadow = true
    return mesh}

function getBoxGrid(amount, separationMultiplier){
    var group = new THREE.Group();
    for (var i=0; i< amount;i++){
        var obj =getBox(1,1,1);
        obj.position.x=i*separationMultiplier
        obj.position.y=obj.geometry.parameters.height/2
        group.add(obj)
        for (var j=1; j<amount; j++){
            var obj = getBox(1,1,1);
            obj.position.x=i*separationMultiplier
            obj.position.y=obj.geometry.parameters.height/2
            obj.position.z = j* separationMultiplier
            group.add(obj) 
        }
    }
    group.position.x = -(separationMultiplier*(amount-1))/2
    group.position.z = -(separationMultiplier*(amount-1))/2
    return group;

    
}
function init() {
    var clock= new THREE.Clock();
    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    //var scene = new THREE.FogExp2(0xffffff,0.2)
    var enableFog= true;
    if (enableFog){
        scene.fog= new THREE.FogExp2(0xffffff,0.1)
    }
    //var box=getBox(1,1,1);
   
    var plane=getPlane(100);
    var directionallight= getDirectionalLight(2)
    var pointlight= getPointLight(2)
   
  //  var helper = THREE.CameraHelper(directionallight.shadow.camera)
    var sphere= getSphere(0.05)
    var sphere2= getSphere(0.05)
    var boxgrid=getBoxGrid(20,2.5)
    var helper = new THREE.CameraHelper(directionallight.shadow.camera)
    plane.name = "plane-1";
    boxgrid.name="boxGrid"

    //box.position.y = box.geometry.parameters.height/2
    plane.rotation.x = Math.PI/2;
    pointlight.position.y=2
    pointlight.intensity=2

    directionallight.position.x=10
    directionallight.position.y=10
    directionallight.position.z=15
    directionallight.intensity=0.1;
 


  //  gui.add(directionallight,'penumbra',0,1)
    
    //scene.add(box)
  
    //scene.add(plane)
    directionallight.add(sphere)
    pointlight.add(sphere2)
    scene.add(pointlight)
    scene.add(directionallight)
    scene.add(boxgrid)
    scene.add(plane)
    //scene.add(helper)

    var camera = new THREE.PerspectiveCamera(
         45,
         window.innerWidth/innerHeight,
         1,
         1000
     );
    var cameraZRotation=new THREE.Group()
    var cameraYPosition=new THREE.Group()
    var cameraZPosition= new THREE.Group()
    var cameraXRotation= new THREE.Group()
    var cameraYRotation=new THREE.Group()

    cameraZRotation.name="cameraZRot"
    cameraYPosition.name="cameraYPos"
    cameraZPosition.name="cameraZPos"
    cameraXRotation.name="cameraXRot"
    cameraYRotation.name="cameraYRot"
    
    cameraZRotation.add(camera)
    cameraYPosition.add(cameraZRotation)
    cameraZPosition.add(cameraYPosition)
    cameraXRotation.add(cameraZPosition)
    cameraYRotation.add(cameraXRotation)
    //scene.add(camerazposition)
    scene.add(cameraYRotation)

    cameraXRotation.rotation.x=-Math.PI/2
    cameraYPosition.position.y=1
    cameraZPosition.position.z=100

    new TWEEN.Tween({val:100})
    .to({val:-50},12000)
    .onUpdate(function(){
        cameraZPosition.position.z=this.val
    })
    .start();

    new TWEEN.Tween({val: -Math.PI/2})
    .to({val:0},6000)
    .delay(1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(function(){
        cameraXRotation.rotation.x=this.val
    })
    .start();

    new TWEEN.Tween({val: 0})
    .to({val:Math.PI/2},6000)
    .delay(1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(function(){
        cameraYRotation.rotation.y=this.val
    })
    .start();



    gui.add(cameraXRotation.rotation,'x',-Math.PI,Math.PI)
    //gui.add(cameraZRotation.rotation,'z',-Math.PI,Math.PI)
    gui.add(cameraYRotation.rotation,'y',-Math.PI,Math.PI)
    //gui.add(cameraZPosition.position,'z',0,100)
    //gui.add(cameraYPosition.position,'y',0,100)
    // var camera = new THREE.OrthographicCamera(
    //     -15,
    //     15,
    //     15,
    //     -15,
    //     1,
    //     1000
    // );
    // camera.position.z=10
    // camera.position.x=1
    // camera.position.y=5
    // camera.lookAt(new THREE.Vector3(0,0,0));
    
    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled=true
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('webgl').appendChild(renderer.domElement);
    var controls = new THREE.OrbitControls(camera,renderer.domElement);
    renderer.setClearColor('rgb(120,120,120)')
    //renderer.render(scene,camera)
    update(renderer,scene,camera,controls,clock);
    return scene
}



function update(renderer,scene,camera,controls,clock){
    renderer.render(
        scene,
        camera)
    
    controls.update();
    TWEEN.update()
    var timeElapsed = clock.getElapsedTime();
  
    var cameraZRotation=scene.getObjectByName("cameraZRot")
    cameraZRotation.rotation.z=noise.simplex2(1.5*timeElapsed,1.5*timeElapsed)*0.02
    //var cameraXRotation=scene.getObjectByName("cameraXRot")
    //var cameraYRotation=scene.getObjectByName("cameraYRot")
    //var cameraYPosition=scene.getObjectByName("cameraYPos")
    //cameraZPosition.position.z-=0.05;
    //cameraXRotation.rotation.x=-0.05;
    //cameraZRotation.rotation.z=noise.simplex2(1.5*timeElapsed,1.5*timeElapsed)

    var boxGrid= scene.getObjectByName('boxGrid');
    boxGrid.children.forEach(function(child,index){
        var val = 5*timeElapsed+index+1
        child.scale.y= (0.5*noise.simplex2(val,val)+1)/2+0.01;
        child.position.y = child.scale.y
    })

    requestAnimationFrame(function (){
        update(renderer,scene,camera,controls,clock)})
    
}



var scene= init()