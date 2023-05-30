import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

rgbeLoader.load('./evangelion-1-HDR.hdr', texture => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
});

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
    model.position.set(-.1, .1, -1);
    model.rotation.set(0.3, .5, 0);

    glass = model.getObjectByName('glass');
    scene.add(model);
  },

  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 0);
camera.rotation.set(.3, 0, 0)

const light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true; // enable shadow casting
scene.add(light);
light.position.set(1, 5, 8);

const pointlight = new THREE.PointLight( 0xffffff, 1, 500);
pointlight.position.set( 10, 10, 50 );
scene.add( pointlight ); 

// const ambientlight = new THREE.AmbientLight( 0x404040, 0 ); // soft white light
// scene.add( ambientlight );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const redbtn = document.querySelector('#redColorBtn');
const bluebtn = document.querySelector('#blueColorBtn');

redbtn?.addEventListener('click', () => {

  const newMaterial = new THREE.MeshPhysicalMaterial({})
newMaterial.reflectivity = 1
newMaterial.transmission = 1.5
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
  newMaterial.reflectivity = 1
  newMaterial.transmission = 1.0
  newMaterial.roughness = 0.2
  newMaterial.metalness = 0
  newMaterial.clearcoat = 0.8
  newMaterial.clearcoatRoughness = 0.25
  newMaterial.color = new THREE.Color(0x00ffff)
  newMaterial.ior = 1.55
  newMaterial.thickness = 5.0
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
