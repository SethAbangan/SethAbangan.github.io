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

// Load a glTF resource
let globeModel: THREE.Group;

let houseAnimMixer: THREE.AnimationMixer;
let houseAnims: THREE.AnimationClip[];
let housesModel: THREE.Object3D<THREE.Event>;
let houseAnimControl: boolean;

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

// Load a glTF resource
loader.load(
  // resource URL
  "OrangeHouses.glb",

  // called when the resource is loaded
  function (gltf: {
    scene: any;
    animations: any;
    scenes: any;
    cameras: any;
    asset: any;
  }) {
    housesModel = gltf.scene;

    houseAnims = gltf.animations;
    gltf.animations; // Array<THREE.AnimationClip>
    housesModel; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>s
    gltf.asset; // Object
    housesModel.scale.set(0.7, 0.7, 0.7);
    housesModel.position.set(10, 0, 10);
    housesModel.rotation.set(0, -2, 0);

    housesModel.receiveShadow = true;
    houseAnimMixer = new THREE.AnimationMixer(housesModel);

    for (let i = 0; i < 3; i++) {
      const animation = houseAnims[i];
      console.log(animation);

      // choose the animation by its index
      const action = houseAnimMixer.clipAction(animation);
      //action.play();
      action.setDuration(5);
      action.setLoop(THREE.LoopRepeat, Infinity).play();
    }

    scene.add(housesModel);
  },
  // called while loading is progressing
  function (xhr: { loaded: number; total: number }) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function () {
    console.log("An error happened");
  }
);

function animateHouse() {
  if (houseAnimControl) return;

  houseAnimControl = true;

  const animate = function () {
    requestAnimationFrame(animate);
    houseAnimMixer.update(0.01); // Update the animation mixer
    renderer.render(scene, camera);
  };
  animate();
}

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
    camera.position.set(0, 1, 2);
    // camera.position.set(0, 1.5, 2);
  },
});
animationScripts.push({
  start: 31,
  end: 50,
  func: () => {
    globeModel.scale.set(0, 0, 0);
  },
});
animationScripts.push({
  start: 51,
  end: 60,
  func: () => {
    camera.position.x = lerp(3, 0, scalePercent(51, 40))
    camera.position.y = lerp(5, 7, scalePercent(51, 60))
    // camera.lookAt(new THREE.Vector3(housesModel.position.x + 3, housesModel.position.y + 2, housesModel.position.z + 1));
    camera.lookAt(housesModel.position);
    // camera.position.set(5, 10, 22);
    animateHouse();
  },
});

animationScripts.push({
  start: 61,
  end: 75,
  func: () => {
    camera.position.x = lerp(3, 0, scalePercent(61, 75))
    camera.position.y = lerp(5, 7, scalePercent(61, 75))
    camera.lookAt(housesModel.position);
  },
});

animationScripts.push({
  start: 76,
  end: 80,
  func: () => {
    camera.position.x = lerp(3, 0, scalePercent(61, 75))
    camera.position.y = lerp(5, 7, scalePercent(61, 75))
    camera.lookAt(housesModel.position);
  },
});

animationScripts.push({
  start: 60,
  end: 100,
  func: () => {
    // find another solution, call func only once
    // camera.lookAt(housesModel.position);
    // camera.position.set(150, 50, -150);
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
  // calculate the current scroll progress as a percentage
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
