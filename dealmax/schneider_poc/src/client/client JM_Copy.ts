import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const scene = new THREE.Scene();
const loader = new GLTFLoader();

let mixer: THREE.AnimationMixer;

loader.load("monkey.glb", function (gltf) {
  const model = gltf.scene;
  model.scale.set(0.1, 0.1, 0.1);
  model.position.set(0, 0, 0);

  mixer = new THREE.AnimationMixer(model);
  const animation = gltf.animations[0];
  const action = mixer.clipAction(animation);
  action.setDuration(5);
  action.setLoop(THREE.LoopRepeat, Infinity).play();

  scene.add(model);

  const animate = function () {
    requestAnimationFrame(animate);
    mixer.update(0.01);
    renderer.render(scene, camera);
  };
  animate();
});

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 2);
camera.lookAt(0, 0, 0);

const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const animate = function () {
  requestAnimationFrame(animate);
  mixer.update(0.01);
  renderer.render(scene, camera);
};
animate();