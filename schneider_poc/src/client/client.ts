import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xB3B6B7)
// Instantiate a loader
const loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);

// Load a glTF resource
let globeModel: any;
loader.load("Earth.glb", function (gltf) {
  const model = gltf.scene;
  model.scale.set(0.3, 0.3, 0.3);
  model.position.set(0, 0, 0);

  globeModel = gltf.scene;
  globeModel.position.set(0, 0, 0);

  scene.add(model);

  // Animation loop
  function animateGlobe() {
    requestAnimationFrame(animateGlobe);

    // Rotate the model around its y-axis
    if (globeModel) globeModel.rotation.y += 0.002;

    renderer.render(scene, camera);
  }
  animateGlobe();
});

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Get the canvas element created by the renderer
var canvas = renderer.domElement;

// Set the left position of the canvas
// canvas.style.left = '300px';


const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});


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

//add an animation that moves 0 through 100 percent of scroll
animationScripts.push({
  start: 0,
  end: 100,
  func: () => {
    camera.position.set(0, 1, 2);
  },
});

//add an animation that moves the cube through first 40 percent of scroll
animationScripts.push({
  start: 0,
  end: 30,
  func: () => {
    globeModel.position.x = lerp(0, -5, scalePercent(0, 100));
    // globeModel.position.y = lerp(0, 10, scalePercent(0, 100));
    globeModel.position.z = lerp(0, 10, scalePercent(0, 100));
    // canvas.style.left = lerp(100, 1, scalePercent(0, 100)) +'';
    // canvas.style.left = '300px';
    camera.lookAt(globeModel.position);
    // camera.position.set(0, 1, 2);
  },
});

animationScripts.push({
  start: 30,
  end: 40,
  func: () => {
    globeModel.position.x = lerp(0, -20, scalePercent(0, 100));
    // globeModel.position.y = lerp(0, 10, scalePercent(0, 100));
    globeModel.position.z = lerp(0, 10, scalePercent(0, 100));
    // canvas.style.left = lerp(100, 1, scalePercent(0, 100)) +'';
    // canvas.style.left = '300px';
    camera.lookAt(globeModel.position);
    // camera.position.set(0, 1, 2);
  },
});

// animationScripts.push({
//   start: 30,
//   end: 40,
//   func: () => {
    
//     // globeModel.position.z = lerp(0, 10, scalePercent(0, 100));
//     globeModel.position.x = (3);
//     globeModel.position.z = (-1);
//     globeModel.position.y = (-3);
//     globeModel.scale.set(1, 1, 1)


//     // globeModel.position.y = lerp(0, 5, scalePercent(0, 200));
//     // globeModel.position.z = lerp(0, 15, scalePercent(25, 100));
//     // canvas.style.bottom = lerp(0, 0, 0) +'';
//     // camera.lookAt(new THREE.Vector3(5,0,7));
//     camera.lookAt(globeModel.scale);
//     // camera.position.set(5,0,7);
//   },
// });


//add an animation that moves the cube through first 40 percent of scroll
// animationScripts.push({
//   start: 60,
//   end: 80,
//   func: () => {
//     // globeModel.position.x = lerp(0, 1, scalePercent(0, 0));
//     // globeModel.position.y = lerp(0, 1, scalePercent(0, 0));
//     // canvas.style.top = lerp(0, 100, scalePercent(0, 100)) +'';
//     // globeModel.position.z = lerp(0, 1, scalePercent(0, 0));
//     camera.lookAt(globeModel.position);
//     // camera.position.set(0, 1, 2);
//   },
// });
// //add an animation that moves the cube through first 40 percent of scroll
// animationScripts.push({
//   start: 90,
//   end: 100,
//   func: () => {
//     globeModel.position.x = lerp(0, 1, scalePercent(0, 0));
//     globeModel.position.y = lerp(0, 1, scalePercent(0, 0));
//     // canvas.style.top = lerp(0, 100, scalePercent(0, 100)) +'';
//     // globeModel.position.z = lerp(0, 1, scalePercent(0, 0));
//     camera.lookAt(globeModel.position);
//     // camera.position.set(0, 1, 2);
//   },
// });

//add an animation that rotates the cube between 40-60 percent of scroll
// animationScripts.push({
//   start: 0,
//   end: 60,
//   func: () => {
//     // camera.lookAt(cube.position);
//     camera.lookAt(globeModel.position);
//     camera.position.set(0, 1, 2);
//     // cube.rotation.z = lerp(0, Math.PI, scalePercent(40, 60));
//     //console.log(cube.rotation.z)
//   },
// });

// // add an animation that moves the camera between 60-80 percent of scroll
// animationScripts.push({
//   start: 60,
//   end: 80,
//   func: () => {
//     camera.position.x = lerp(0, 5, scalePercent(60, 80));
//     camera.position.y = lerp(1, 5, scalePercent(60, 80));
//     camera.lookAt(globeModel.position);
//     // camera.lookAt(cube.position);
//     //console.log(camera.position.x + " " + camera.position.y)
//   },
// });

//add an animation that auto rotates the cube from 80 percent of scroll
// animationScripts.push({
//   start: 80,
//   end: 101,
//   func: () => {
//     //auto rotate
//     // cube.rotation.x += 0.01;
//     // cube.rotation.y += 0.01;
//   },
// });

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
  (document.getElementById("scrollProgress") as HTMLDivElement).innerText =
    "Scroll Progress : " + scrollPercent.toFixed(2);
};

const stats = new Stats();
// document.body.appendChild(stats.dom);

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
