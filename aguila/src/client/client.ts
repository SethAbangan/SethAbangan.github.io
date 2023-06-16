import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { CAMERA } from "./controls";
// import TextSprite from "@seregpie/three.text-sprite";

// Create a scene

let truck: THREE.Object3D<THREE.Event>, bus: THREE.Object3D<THREE.Event>;
let isSelected = "truck";
let glass1: any, glass2: any;
let camera: any, scene: THREE.Scene, renderer: any, controls: OrbitControls;
const params = {
  exposure: 2.0,
};

const redbtn = document.querySelector("#redColorBtn");
const bluebtn = document.querySelector("#blueColorBtn");
const greenbtn = document.querySelector("#greenColorBtn");
const trckbtn = document.querySelector("#trckBtn");
const bsbtn = document.querySelector("#bsBtn");

redbtn?.addEventListener("click", () => {
  const newMaterial = new THREE.MeshPhysicalMaterial({
    transparent: true, // Enable transparency
    opacity: 0.5, // Set the opacity level (0.0 - 1.0)
    color: new THREE.Color(0xff0000), // Set the tint color
    reflectivity: 2,
    transmission: 1,
    roughness: 0.2,
    metalness: 0,
    clearcoat: 0,
    clearcoatRoughness: 0.25,
    ior: 1.0,
    thickness: 5,
  });
  if (isSelected === "truck") {
    glass1.material = newMaterial;
  }
  if (isSelected === "bus") {
    glass2.material = newMaterial;
  }
});

bluebtn?.addEventListener("click", () => {
  const newMaterial = new THREE.MeshPhysicalMaterial({
    transparent: true, // Enable transparency
    opacity: 0.5, // Set the opacity level (0.0 - 1.0)
    color: new THREE.Color(0x0000ff), // Set the tint color
    reflectivity: 2,
    transmission: 1,
    roughness: 0.2,
    metalness: 0,
    clearcoat: 0,
    clearcoatRoughness: 0.25,
    ior: 1.0,
    thickness: 5,
  });
  if (isSelected === "truck") {
    glass1.material = newMaterial;
  }
  if (isSelected === "bus") {
    glass2.material = newMaterial;
  }
});

greenbtn?.addEventListener("click", () => {
  const newMaterial = new THREE.MeshPhysicalMaterial({
    transparent: true, // Enable transparency
    opacity: 0.5, // Set the opacity level (0.0 - 1.0)
    color: new THREE.Color(0x00ff00), // Set the tint color
    reflectivity: 2,
    transmission: 1,
    roughness: 0.2,
    metalness: 0,
    clearcoat: 0,
    clearcoatRoughness: 0.25,
    ior: 1.0,
    thickness: 5,
  });
  if (isSelected === "truck") {
    glass1.material = newMaterial;
  }
  if (isSelected === "bus") {
    glass2.material = newMaterial;
  }
});

trckbtn?.addEventListener("click", () => {
  truck.visible = true;
  bus.visible = false;
  isSelected = "truck";
});

bsbtn?.addEventListener("click", () => {
  truck.visible = false;
  bus.visible = true;
  isSelected = "bus";
});

init();
render();

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color("white");

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    20
  );
  // camera.position.set(-1.8, 0.6, 2.7);
  camera.position.set(0, 0, 0);
  camera.rotation.set(0.3, 0, 0);

  // let instance = new THREE.TextSprite({
  //   alignment: 'left',
  //   color: '#24ff00',
  //   fontFamily: '"Times New Roman", Times, serif',
  //   fontSize: 8,
  //   fontStyle: 'italic',
  //   text: [
  //     'Twinkle, twinkle, little star,',
  //     'How I wonder what you are!',
  //     'Up above the world so high,',
  //     'Like a diamond in the sky.',
  //   ].join('\n'),
  // });
  // scene.add(instance);

  new RGBELoader()
    .setPath("./assets/")
    .load("sunflowers_puresky_4k.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.environment = texture;
      // render();
      const loaderTruck = new GLTFLoader().setPath("assets/");
      loaderTruck.load(
        "TRUCK.glb",
        (gltf) => {
          truck = gltf.scene;
          gltf.animations; // Array<THREE.AnimationClip>
          gltf.scenes; // Array<THREE.Group>
          gltf.cameras; // Array<THREE.Camera>
          gltf.asset; // Object
          truck.receiveShadow = true;
          truck.scale.set(0.5, 0.5, 0.5);
          truck.position.set(0, -0.3, 0);

          glass1 = truck.getObjectByName("glass");
          scene.add(truck);

          render();
        },
        // called when loading has errors
        function (error) {
          console.log("An error happened", error);
        }
      );

      const loaderBus = new GLTFLoader().setPath("assets/");
      loaderBus.load(
        "BUS.glb",
        (gltf) => {
          // called when the resource is loaded
          bus = gltf.scene;
          gltf.animations; // Array<THREE.AnimationClip>
          gltf.scenes; // Array<THREE.Group>
          gltf.cameras; // Array<THREE.Camera>
          gltf.asset; // Object
          bus.receiveShadow = true;
          bus.scale.set(0.4, 0.4, 0.4);
          bus.position.set(0, -0.25, -0.2);
          // bus.rotation.set(0.3, 15, 0);

          glass2 = bus.getObjectByName("glass2");
          scene.add(bus);

          bus.visible = false;
        },

        // called when loading has errors
        function (error) {
          console.log("An error happened", error);
        }
      );
    });

  // models

  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 3;
  controls.target.set(0, 0, -0.2);
  (controls.minZoom = CAMERA.minZoom), (controls.maxZoom = CAMERA.maxZoom);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.2;
  controls.update();

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("wheel", (event) => {
    camera.position.z += event.deltaY / 500;
  });
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
  renderer.toneMappingExposure = params.exposure;
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}
