import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xB3B6B7)
// Instantiate a loader
const loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);

// Load a glTF resource
let globeModel: THREE.Group;

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

    // renderer.render(scene, camera);
  }
  animateGlobe();
});

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const mainLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 2);
mainLight.castShadow = true;
mainLight.position.set(3, 5, -3);
scene.add(mainLight);

const fillLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
fillLight.castShadow = true;
fillLight.position.set(-4, 3, -4);
scene.add(fillLight);

const renderer = new THREE.WebGLRenderer({ alpha: true});
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Get the canvas element created by the renderer
const canvas = renderer.domElement;
canvas.style.position = 'fixed';
canvas.style.top = '0px';
canvas.style.left = '240px';

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
    camera.position.set(0, 1.5, 2);
  },
});

//add an animation that moves the cube through first 40 percent of scroll
animationScripts.push({
  start: 0,
  end: 30,
  func: () => {
    // globeModel.position.x = lerp(0, 5, scalePercent(0, 100));
    // globeModel.position.y = lerp(0, 7, scalePercent(0, 200));
    // globeModel.position.z = lerp(0, 10, scalePercent(0, 100));
    globeModel.scale.x = lerp(0.3, 1, scalePercent(0, 70));
    globeModel.scale.y = lerp(0.3, 1, scalePercent(0, 70));
    globeModel.scale.z = lerp(0.3, 1, scalePercent(0, 70));
    camera.lookAt(new THREE.Vector3(globeModel.position.x, scalePercent(0, 4), globeModel.position.z));
    // camera.position.set(0, 1, 2);
  },
});
animationScripts.push({
  start: 31,
  end: 40,
  func: () => {
    camera.lookAt(new THREE.Vector3(10, 15, 50));
  },
});
// animationScripts.push({
//   start: 60,
//   end: 80,
//   func: () => {
//     globeModel.scale.x = lerp(0, 0, scalePercent(0, 0));
//     globeModel.scale.y = lerp(0, 0, scalePercent(0, 0));
//     globeModel.scale.z = lerp(0, 0, scalePercent(0, 0));
//   },
// });

// animationScripts.push({
//   start: 30,
//   end: 40,
//   func: () => {
//     globeModel.position.x = lerp(0, -20, scalePercent(0, 100));
//     // globeModel.position.y = lerp(0, 10, scalePercent(0, 100));
//     globeModel.position.z = lerp(0, 10, scalePercent(0, 100));
//     // canvas.style.left = lerp(100, 1, scalePercent(0, 100)) +'';
//     // canvas.style.left = '300px';
//     camera.lookAt(globeModel.position);
//     // camera.position.set(0, 1, 2);
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
  // calculate the current scroll progress as a percentage
  scrollPercent =
    ((document.documentElement.scrollTop || document.body.scrollTop) /
      ((document.documentElement.scrollHeight || document.body.scrollHeight) -
        document.documentElement.clientHeight)) *
    100;
  (document.getElementById("scrollProgress") as HTMLDivElement).innerText =
    "Scroll Progress : " + scrollPercent.toFixed(2);
};

const stats = new Stats();
document.body.appendChild(stats.dom);

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
