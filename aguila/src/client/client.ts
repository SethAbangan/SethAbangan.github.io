import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as TWEEN from '@tweenjs/tween.js';
// Create a scene
const scene = new THREE.Scene();

let truck: THREE.Object3D<THREE.Event>, bus: THREE.Object3D<THREE.Event>;
let isSelected = 'truck';
let glass1: any, glass2: any

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



    // Instantiate a loader
    const loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
    loader.setDRACOLoader(dracoLoader);


    // Load a glTF resource
    loader.load(
      // resource URL
      "assets/TRUCK.glb",

      // called when the resource is loaded
      function (gltf) {
        truck = gltf.scene;
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
        truck.receiveShadow = true;
        truck.scale.set(0.3, 0.3, 0.3);
        truck.position.set(-0.07, 0.1, -1);
        truck.rotation.set(0.3, 0.5, 0);

        glass1 = truck.getObjectByName('glass');
        scene.add(truck);

        // Define initial rotation and set up clock
        var rotationSpeed = 0.1; // Adjust this value to control the rotation speed
        var clock = new THREE.Clock();

        // Animation loop
        function animate() {
          requestAnimationFrame(animate);

          // Calculate elapsed time since the last frame
          var delta = clock.getDelta();

          // Update rotation
          truck.rotation.y += rotationSpeed * delta;

          // Render the scene
          renderer.render(scene, camera);
        }

        // Start the animation loop
        animate();
      },

      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );
    loader.load(
      // resource URL
      "assets/BUS.glb",

      // called when the resource is loaded
      function (gltf) {
        bus = gltf.scene;
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
        bus.receiveShadow = true;
        bus.scale.set(0.1, 0.1, 0.1);
        bus.position.set(-.02, 0.15, -1);
        bus.rotation.set(0.3, 15, 0);

        glass2 = bus.getObjectByName('glass2');
        glass2.material.transparent = true;
        glass2.material.opacity = 0.7;
        glass2.material.reflectivity = 1;
        glass2.material.transmission = 1;
        glass2.material.roughness = 0.2;
        glass2.material.metalness = 0;
        glass2.material.clearcoat = 0;
        glass2.material.clearcoatRoughness = 0.25;
        glass2.material.ior = 1.3;
        glass2.material.thickness = 5;
        scene.add(bus);

        bus.visible = false;

        // Define initial rotation and set up clock
        var rotationSpeed = 0.1; // Adjust this value to control the rotation speed
        var clock = new THREE.Clock();

        // Animation loop
        function animate() {
          requestAnimationFrame(animate);

          // Calculate elapsed time since the last frame
          var delta = clock.getDelta();

          // Update rotation
          bus.rotation.y += rotationSpeed * delta;

          // Render the scene
          renderer.render(scene, camera);
        }

        // Start the animation loop
        animate();
      },

      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );

  // });

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

const pointlight = new THREE.PointLight(0xffffff, 1, 500);
pointlight.position.set(10, 10, 50);
scene.add(pointlight);

// const ambientlight = new THREE.AmbientLight( 0x404040, 0 ); // soft white light
// scene.add( ambientlight );

// const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const redbtn = document.querySelector('#redColorBtn');
const bluebtn = document.querySelector('#blueColorBtn');
const trckbtn = document.querySelector('#trckBtn');
const bsbtn = document.querySelector('#bsBtn');


redbtn?.addEventListener('click', () => {
  const newMaterial = new THREE.MeshPhysicalMaterial({
    transparent: true, // Enable transparency
    opacity: 0.5, // Set the opacity level (0.0 - 1.0)
    color: new THREE.Color(0xFF0000), // Set the tint color
    reflectivity: 1,
    transmission: 1,
    roughness: 0.2,
    metalness: 0,
    clearcoat: 0,
    clearcoatRoughness: 0.25,
    ior: 1.3,
    thickness: 5
  });
  if (isSelected === 'truck') {
    glass1.material = newMaterial;
  }
  if (isSelected === 'bus') {
    glass2.material = newMaterial;
  }
});

bluebtn?.addEventListener('click', () => {
  const newMaterial = new THREE.MeshPhysicalMaterial({
    transparent: true, // Enable transparency
    opacity: 0.5, // Set the opacity level (0.0 - 1.0)
    color: new THREE.Color(0x0000FF), // Set the tint color
    reflectivity: 1,
    transmission: 1,
    roughness: 0.2,
    metalness: 0,
    clearcoat: 0,
    clearcoatRoughness: 0.25,
    ior: 1.3,
    thickness: 5
  });
  if (isSelected === 'truck') {
    glass1.material = newMaterial;
  }
  if (isSelected === 'bus') {
    glass2.material = newMaterial;
  }


});

trckbtn?.addEventListener('click', () => {
  truck.visible = true;
  bus.visible = false;
  isSelected = 'truck';
});

bsbtn?.addEventListener('click', () => {
  truck.visible = false;
  bus.visible = true;
  isSelected = 'bus';
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
