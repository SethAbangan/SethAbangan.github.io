import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const scene = new THREE.Scene();
// Instantiate a loader
const loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);

// Load a glTF resource
loader.load(
  // resource URL
  "houses.glb",

  // called when the resource is loaded
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    gltf.animations; // Array<THREE.AnimationClip>
    model; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
    model.scale.set(0.1, 0.1, 0.1);
    model.position.set(0, 0, -1);
    model.rotation.set(0.3, -0.5, 0);
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
); // Load a glTF resource
let mixer: THREE.AnimationMixer;
loader.load("monkey.glb", function (gltf) {
  const model = gltf.scene;
  model.scale.set(0.2, 0.2, 0.2);
  model.position.set(0, 0.5, -10);
  model.rotation.set(0.3, -0.5, 0);
  console.log(gltf.animations);

  mixer = new THREE.AnimationMixer(model);
  const animation = gltf.animations[0];
  console.log(animation);

  // choose the animation by its index
  const action = mixer.clipAction(animation);
  //action.play();
  action.setDuration(5);
  action.setLoop(THREE.LoopRepeat,Infinity).play();

  scene.add(model);
  const animate = function () { requestAnimationFrame(animate); mixer.update(0.01); // Update the animation mixer 
  renderer.render(scene, camera); 
}; 
animate();
});
const gridHelper = new THREE.GridHelper(10, 10, 0xaec6cf, 0xaec6cf)
scene.add(gridHelper)

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

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0.5, -10);
scene.add(cube);

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

//add an animation that moves the cube through first 40 percent of scroll
animationScripts.push({
  start: 0,
  end: 40,
  func: () => {
    camera.lookAt(cube.position);
    camera.position.set(0, 1, 2);
    cube.position.z = lerp(-10, 0, scalePercent(0, 40));
    //console.log(cube.position.z)
  },
});

//add an animation that rotates the cube between 40-60 percent of scroll
animationScripts.push({
  start: 40,
  end: 60,
  func: () => {
    camera.lookAt(cube.position);
    camera.position.set(0, 1, 2);
    cube.rotation.z = lerp(0, Math.PI, scalePercent(40, 60));
    //console.log(cube.rotation.z)
  },
});

//add an animation that moves the camera between 60-80 percent of scroll
animationScripts.push({
  start: 60,
  end: 80,
  func: () => {
    camera.position.x = lerp(0, 5, scalePercent(60, 80));
    camera.position.y = lerp(1, 5, scalePercent(60, 80));
    camera.lookAt(cube.position);
    //console.log(camera.position.x + " " + camera.position.y)
  },
});

//add an animation that auto rotates the cube from 80 percent of scroll
animationScripts.push({
  start: 80,
  end: 101,
  func: () => {
    //auto rotate
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
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
