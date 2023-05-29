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
let glass: any
// Load a glTF resource
loader.load(
  // resource URL
  "assets/AGUILA.glb",

  // called when the resource is loaded
  function (gltf) {
    model = gltf.scene;

    gltf.animations; // Array<THREE.AnimationClip>
    model; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
    model.receiveShadow = true;
    model.scale.set(0.3, 0.3, 0.3);
    model.position.set(0, 0, -1);
    model.rotation.set(0.3, -0.5, 0);

    glass = model.getObjectByName('glass');
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

const light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true; // enable shadow casting
scene.add(light);
light.position

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const redbtn = document.querySelector('#redColorBtn');
const bluebtn = document.querySelector('#blueColorBtn');

redbtn?.addEventListener('click', () => {

  const newMaterial = new THREE.MeshPhysicalMaterial({})
newMaterial.reflectivity = .5
newMaterial.transmission = 1.0
newMaterial.roughness = 0.2
newMaterial.metalness = 0
newMaterial.clearcoat = 0.3
newMaterial.clearcoatRoughness = 0.25
newMaterial.color = new THREE.Color(0xff0000)
newMaterial.ior = 1.2
newMaterial.thickness = 10.0
;
  glass.material = newMaterial;
});

bluebtn?.addEventListener('click', () => {

  const newMaterial = new THREE.MeshPhysicalMaterial({})
  newMaterial.reflectivity = .5
  newMaterial.transmission = 1.0
  newMaterial.roughness = 0.2
  newMaterial.metalness = 0
  newMaterial.clearcoat = 0.3
  newMaterial.clearcoatRoughness = 0.25
  newMaterial.color = new THREE.Color(0x0000ff)
  newMaterial.ior = 1.2
  newMaterial.thickness = 10.0
  ;;
  glass.material = newMaterial;
});

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
