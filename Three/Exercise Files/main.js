function number(num){
	

	// if (num!==0){
	// 	let temp=num
	// 	var count=1;
	// 	var dec = []
	// 	while (true){
	// 		factor=10**count
	// 		orig=(temp/factor)
	// 		rem=temp%factor
	// 		temp=Math.floor(orig)
	// 		dec[count-1]=rem
	// 		if (temp===0){
	// 			break;
	// 		}
	// 		console.log(dec)
	// 		count=count+1
	// 	}
	if (num!==0){	
		var assoc={}
		var str=num.toString()
		console.log(str)
		
		var letters=['a','b','c','d','e','f','g','h','i','j']
		
		str.split('').forEach((val)=>{
			assoc[val]=letters[val]
		})
		
		let val= ''
		
		Object.keys(assoc).forEach((key)=>{
			val+=assoc[key]

		})

		return val
	}
else{
	return 'default'
}
}
function events(){
	var docs=document.getElementById('header')
	var vals = docs.innerText
	setTimeout(()=>{
		vals="job"
		setTimeout(()=>{
			vals="is good"
		},2000)
	},2000)


	function timer(e){
		var time=3600*e.getHours()+60*e.getMinutes()+e.getSeconds()
		return time
	}

	var outtime=0
	var hovertime=0
	var intime=0

	const momo = docs.addEventListener('mousemove',()=>{
		let date=new Date()
		// new Date
		if (outtime===0){
		hovertime= timer(date)-intime
		}
		else{
			hovertime=(timer(date)-intime)+hovertime
		}
		
		//if (time<25500){
		//	docs.style.color=`rgba(255,255,255,${time/100})`
		//	}
		docs.innerText=`${number(hovertime)}`
	
		
	})
	const mov = docs.addEventListener('mouseover',()=>{
			let date=new Date()
			intime=timer(date)
			//console.log(intime,outtime,hovertime)
		})
	const mot = docs.addEventListener('mouseout',()=>{
		let date = new Date()
		outtime=timer(date)
		//console.log(intime,outtime,hovertime)
	

	})
	

}

function init() {

	events()	
	
	var scene = new THREE.Scene();
	var clock = new THREE.Clock()
	var gui = new dat.GUI()
	var sphere=getSphere(3)
	var enableFog= false;
    if (enableFog){
        scene.fog= new THREE.FogExp2(0xffffff,0.1)
    }


	var directionalLight=getDirectionalLight(2);
	// initialize objects
	var planeMaterial = getMaterial('phong', 'rgb(255, 0, 255)');
	var plane = getPlane(planeMaterial, 30, 60);
	plane.name = 'plane-1'
	// manipulate objects
	directionalLight.add(sphere)
	plane.rotation.x = Math.PI/2;
	plane.rotation.z = Math.PI/4;
	var dspos= new THREE.Group()
	dspos.name="directionalLightPosition"
	dspos.add(directionalLight)
	dspos.position.x=100
	gui.add(dspos.position,'x',-20,20)
	// add objects to the scene
	scene.add(dspos)
	scene.add(plane);

	// camera
	var camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);
	camera.position.z = 20;
	camera.position.x = 0;
	camera.position.y = 5;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	
	// renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	document.getElementById('webgl').appendChild(renderer.domElement);
	
	

	var controls = new THREE.OrbitControls( camera, renderer.domElement );

	update(renderer, scene, camera, controls,clock);

	return scene;
}

function getPlane(material, size, segments) {
	var geometry = new THREE.PlaneGeometry(size, size, segments, segments);
	material.side = THREE.DoubleSide;
	var obj = new THREE.Mesh(geometry, material);
	obj.receiveShadow = true;
	obj.castShadow = true;

	return obj;
}
function getDirectionalLight(intensity){
	var light = new THREE.DirectionalLight(0xffff00,intensity)
	light.castShadow=true
	light.shadow.camera.left = -40;
    light.shadow.camera.right= 40;
    light.shadow.camera.bottom= -40;
    light.shadow.camera.top = 40;
	return light
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

function getMaterial(type, color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
		//wireframe: true,
	};

	switch (type) {
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case 'standard':
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default: 
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}

function update(renderer, scene, camera, controls,clock) {
	var elapsedTime=clock.getElapsedTime()
	controls.update();
	var plane = scene.getObjectByName('plane-1')
	var planeGeo=plane.geometry;
	planeGeo.vertices.forEach(function(vertex,index){
		vertex.z=Math.sin(elapsedTime+index*0.1)*0.5;
	})
	planeGeo.verticesNeedUpdate=true
	renderer.render(scene, camera);
	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls,clock);
	});
}

var scene = init();
