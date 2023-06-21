import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { CAMERA } from "./controls";
// Create a scene

let floatingIsland1: THREE.Object3D<THREE.Event>, floatingIsland2: THREE.Object3D<THREE.Event>;
let camera: any, scene: THREE.Scene, renderer: any, controls: OrbitControls;

const btn1 = document.querySelector("#btn1");
const btn2 = document.querySelector("#btn2");

btn1?.addEventListener("click", () => {
  floatingIsland1.visible = true;
  floatingIsland2.visible = false;
});

btn2?.addEventListener("click", () => {
  floatingIsland1.visible = false;
  floatingIsland2.visible = true;
});


init();
render();

function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    20
  );
  // camera.position.set(-1.8, 0.6, 2.7);
  camera.position.set(0, 4.55, 0);
  camera.rotation.set(0.3, 0, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  new RGBELoader()
    .setPath("../assets/")
    .load("sunflowers_puresky_4k.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      // scene.background = texture;
      scene.environment = texture;

      render();

      // models

      const loaderIsland = new GLTFLoader().setPath("assets/");
      loaderIsland.load("FloatingIsland.glb", (gltf) => {
        floatingIsland1 = gltf.scene;
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
        floatingIsland1.receiveShadow = true;
        floatingIsland1.scale.set(0.03, 0.03, 0.03);
        floatingIsland1.position.set(0.6, -0.5, 0);

        scene.add(floatingIsland1);
        // floatingIsland1.visible = false;

        render();
      });

      loaderIsland.load("desert_diorama.glb", (gltf) => {
        floatingIsland2 = gltf.scene;
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
        floatingIsland2.receiveShadow = true;
        floatingIsland2.scale.set(0.7, 0.7, 0.7);
        floatingIsland2.position.set(0, 2.5, 0);

        scene.add(floatingIsland2);
        floatingIsland2.visible = false;

        render();
      });
    });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 7;
  controls.maxDistance = 10;
  controls.target.set(0, 4.5, -0.2);
  controls.minZoom = CAMERA.minZoom,
  controls.maxZoom = CAMERA.maxZoom;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.2;
  camera.lookAt(controls.target);
  controls.enabled = true;
  controls.update();


  window.addEventListener("resize", onWindowResize);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

//

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}
