import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";



const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe3e3e3);
// Instantiate a loader
const loader = new GLTFLoader();



// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);

let model_1: THREE.Object3D<THREE.Event>;
let model_2: THREE.Object3D<THREE.Event>;
let mixer: THREE.AnimationMixer;

// Load a glTF resource model_1
loader.load("OrangeHouseFinal.glb", function (gltf) {
  model_1 = gltf.scene;

  model_1.scale.set(0.065, 0.065, 0.065);
  model_1.position.set(0, 0, -1);
  model_1.rotation.set(0.05, -0.5, 0);
  model_1.traverse (n => {
    n.castShadow = true;
    n.receiveShadow = true;

    model_1.receiveShadow = true;
     scene.add(model_1);
    
  }
)



console.log(gltf.animations);

mixer = new THREE.AnimationMixer(model_1);
const animation = gltf.animations[0];
console.log(animation);



// choose the animation by its index
const action = mixer.clipAction(animation);
//action.play();
action.setDuration(1.5);
action.setLoop(THREE.LoopRepeat,Infinity).play();

scene.add(model_1);
const animate = function () { requestAnimationFrame(animate); mixer.update(0.01); // Update the animation mixer 
renderer.render(scene, camera); 
}; 
animate(); 

 },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
); 

// // Load a glTF resource model_2
// loader.load("green_houses.glb", function (gltf) {
//   model_2 = gltf.scene;

//   model_2.scale.set(0.065, 0.065, 0.065);
//   model_2.position.set(0, 0, -1);
//   model_2.rotation.set(0.05, -0.5, 0);
//   model_2.traverse (n => {
//     n.castShadow = true;
//     n.receiveShadow = true;


//     model_2.transparent =true;
//     model_2.receiveShadow = true;
//      scene.add(model_2);
    
//   }
// )



// console.log(gltf.animations);

// mixer = new THREE.AnimationMixer(model_1);
// const animation = gltf.animations[0];
// console.log(animation);



// // choose the animation by its index
// const action = mixer.clipAction(animation);
// //action.play();
// action.setDuration(2);
// action.setLoop(THREE.LoopRepeat,Infinity).play();

// scene.add(model_1);
// const animate = function () { requestAnimationFrame(animate); mixer.update(0.01); // Update the animation mixer 
// renderer.render(scene, camera); 
// }; 
// animate(); 

//  },
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//   },
//   // called when loading has errors
//   function (error) {
//     console.log("An error happened");
//   }
// ); 




























const gridHelper = new THREE.GridHelper(10, 10, 0xaec6cf, 0xaec6cf)
scene.add(gridHelper)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
  );


const hem_light = new THREE.HemisphereLight(0xffffff, 0x080820, .5);
scene.add(hem_light);

// const light = new THREE.DirectionalLight(0xffffff, 0.3);
// light.castShadow = true; // enable shadow casting

// light.shadow.mapSize.width = 2048; // default
// light.shadow.mapSize.height = 2048; // default
// light.shadow.camera.near = 0.5; // default
// light.shadow.camera.far = 500; // default
// light.position.set( 0.5, 1, 0 ); //default; light shining from top
// scene.add(light);

const ambientlight = new THREE.AmbientLight( 0xFFFFFF, .15 ); // soft white light
scene.add( ambientlight );



const spotLight = new THREE.SpotLight( 0xffffff,1 );
spotLight.position.set( 100, 1000, 100 );
spotLight.castShadow = true;
spotLight.shadow.bias=0.0001;
spotLight.shadow.mapSize.width= 1024*4;
spotLight.shadow.mapSize.height= 1024*4;
scene.add( spotLight );




const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

// const cube = new THREE.Mesh(geometry, material);
// cube.position.set(0, 0.5, -10);
// scene.add(cube);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

/* Liner Interpolation
 * lerp(min, max, ratio)
 * eg,
 * lerp(20, 60, .5)) = 40
 * lerp(-20, 60, .5)) = 20
 * lerp(20, 60, .75)) = 50
 * lerp(-20, -10, .1)) = -.19
 */
function lerp(x: number, y: number, a: number): number {
  return (1 - a) * x + a * y;
}

// Used to fit the lerps to start and end at specific scrolling percentages
function scalePercent(start: number, end: number) {
  return (scrollPercent - start) / (end - start);
}

const animationScripts: { start: number; end: number; func: () => void }[] = [];

//add an animation that flashes the cube through 100 percent of scroll
animationScripts.push({
  start: 0,
  end: 101,
  func: () => {
    let g = material.color.g;
    g -= 0.05;
    if (g <= 0) {
      g = 1.0;
    }
    material.color.g = g;
  },
});

//add an animation that moves the cube through first 20 percent of scroll
animationScripts.push({
  start: 0,
  end: 20,
  func: () => {
    camera.position.x = lerp(.25, 2, scalePercent(0, 80));
    camera.position.y = lerp(.5, 2, scalePercent(0, 80));
    
    
    // camera.lookAt(cube.position);
    camera.lookAt(model_1.position);
    // camera.position.set(0, 1, 2);
    // cube.position.z = lerp(-10, 0, scalePercent(0, 40));
    //console.log(cube.position.z)
 
 
  },
});



//add an animation that moves the cube through first 40 percent of scroll
// animationScripts.push({
//   start: 0,
//   end: 40,
//   func: () => {
//     // camera.lookAt(cube.position);
//     camera.lookAt(model.position);
//     camera.position.set(0, 1, 2);
//     // cube.position.z = lerp(-10, 0, scalePercent(0, 40));
//     //console.log(cube.position.z)
//   },
// });

//add an animation that rotates the cube between 40-60 percent of scroll
// animationScripts.push({
//   start: 40,
//   end: 60,
//   func: () => {
//     // camera.lookAt(cube.position);
//     camera.lookAt(model.position);
//     camera.position.set(0, 1, 2);
//     // cube.rotation.z = lerp(0, Math.PI, scalePercent(40, 60));
//     //console.log(cube.rotation.z)
//   },
// });

//add an animation that moves the camera between 60-80 percent of scroll
// animationScripts.push({
//   start: 60,
//   end: 80,
//   func: () => {
//     camera.position.x = lerp(0, 5, scalePercent(60, 80));
//     camera.position.y = lerp(1, 5, scalePercent(60, 80));
//     // camera.lookAt(cube.position);
//     camera.lookAt(model.position);
//     //console.log(camera.position.x + " " + camera.position.y)
//   },
// });

//add an animation that auto rotates the cube from 80 percent of scroll
animationScripts.push({
  start: 80,
  end: 101,
  func: () => {
    //auto rotate
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
  },
});

function playScrollAnimations() {
  animationScripts.forEach((a) => {
    if (scrollPercent >= a.start && scrollPercent < a.end) {
      a.func();
    }
  });
}

let scrollPercent = 0;

document.body.onscroll = () => {
  //calculate the current scroll progress as a percentage
  scrollPercent =
    ((document.documentElement.scrollTop || document.body.scrollTop) /
      ((document.documentElement.scrollHeight || document.body.scrollHeight) -
        document.documentElement.clientHeight)) *
    100;
  // (document.getElementById("scrollProgress") as HTMLDivElement).innerText =
  //   "Scroll Progress : " + scrollPercent.toFixed(2);
};

const stats = new Stats();
document.body.appendChild(stats.dom);
document.body.removeChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  playScrollAnimations();

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

window.scrollTo({ top: 0, behavior: "smooth" });
animate();
