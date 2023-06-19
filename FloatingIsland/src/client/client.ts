import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { CAMERA } from "./controls";
// Create a scene

let floatingIsland: THREE.Object3D<THREE.Event>, bus: THREE.Object3D<THREE.Event>;
let isSelected = "floating";
let glass1: any, glass2: any;
let camera: any, scene: THREE.Scene, renderer: any, controls: OrbitControls;


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
  camera.position.set(0, 0, 0);
  camera.rotation.set(0.3, 0, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  new RGBELoader()
    .setPath("./../assets/")
    .load("sunflowers_puresky_4k.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      // scene.background = texture;
      scene.environment = texture;

      render();

      // models

      const loaderTruck = new GLTFLoader().setPath("assets/");
      loaderTruck.load("FloatingIsland.glb", (gltf) => {
        floatingIsland = gltf.scene;
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
        floatingIsland.receiveShadow = true;
        floatingIsland.scale.set(0.005, 0.005, 0.005);
        floatingIsland.position.set(0, -.3, 0);
        // truck.rotation.set(0.3, 0.5, 0);

        scene.add(floatingIsland);

        // Define initial rotation and set up clock
        var rotationSpeed = 0.1; // Adjust this value to control the rotation speed
        var clock = new THREE.Clock();

        // Animation loop
        function animateTruck() {
          requestAnimationFrame(animateTruck);

          // Calculate elapsed time since the last frame
          var delta = clock.getDelta();

          // Update rotation
          floatingIsland.rotation.y += rotationSpeed * delta;

          // Render the scene
          renderer.render(scene, camera);
        }

        // Start the animation loop
        // animateTruck();

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
  controls.minDistance = .5;
  controls.maxDistance = 3;
  controls.target.set(0, 0, -0.2);
  controls.minZoom = CAMERA.minZoom,
  controls.maxZoom = CAMERA.maxZoom;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.2;
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
