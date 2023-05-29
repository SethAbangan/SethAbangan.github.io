import * as THREE from "three";
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

let model: THREE.Object3D<THREE.Event>;
// Load a glTF resource
loader.load(
  // resource URL
  "assets/bmw_convertable.glb",

  // called when the resource is loaded
  function (gltf) {
    model = gltf.scene;

    gltf.animations; // Array<THREE.AnimationClip>
    model; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
    model.receiveShadow = true;
    model.scale.set(0.1, 0.1, 0.1);
    model.position.set(0, 0, -1);
    model.rotation.set(0.3, -0.5, 0);

    scene.add(model);
  },

  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const light = new THREE.DirectionalLight(0xffffff, 0.3);
light.castShadow = true; // enable shadow casting
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  renderer.render(scene, camera);
}
animate();
