import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xECF0F1);
// Instantiate a loader
const loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);

let model_1: THREE.Object3D<THREE.Event>;
let model_2: THREE.Object3D<THREE.Event>;
let model_3: THREE.Object3D<THREE.Event>;
let model_4: THREE.Object3D<THREE.Event>;
let model_5: THREE.Object3D<THREE.Event>;
let globeModel: THREE.Object3D<THREE.Event>;;

let mixer_1: THREE.AnimationMixer;
let mixer_2: THREE.AnimationMixer;
let mixer_3: THREE.AnimationMixer;
let mixer_4: THREE.AnimationMixer;
let mixer_5: THREE.AnimationMixer;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Get the canvas element created by the renderer
const canvas = renderer.domElement;
canvas.style.position = 'fixed';
canvas.style.top = '0px';
canvas.style.left = '240px';

// Load a glTF resource


loader.load("Earth.glb", function (gltf) {
  globeModel = gltf.scene;
  globeModel.scale.set(0.3, 0.3, 0.3);
  globeModel.position.set(0, .5, -2);
  globeModel.visible = false;
  globeModel.traverse(n => {
    n.castShadow = true;
    n.receiveShadow = true;

    globeModel.receiveShadow = true;
    globeModel.visible = true;
    scene.add(globeModel);

  }
  )
  // Animation loop
  function animateGlobe() {
    requestAnimationFrame(animateGlobe);

    // Rotate the model around its y-axis
    if (globeModel) globeModel.rotation.y += 0.002;

    // renderer.render(scene, camera);
  }
  animateGlobe();
});

// Load a glTF resource model_1
loader.load("01_orange_houses.glb", function (gltf) {
  model_1 = gltf.scene;

  model_1.scale.set(0.065, 0.065, 0.065);
  model_1.position.set(0, 0, 0);
  model_1.rotation.set(0.05, -0.5, 0);
  model_1.traverse(n => {
    n.castShadow = true;
    n.receiveShadow = true;

    model_1.receiveShadow = true;
    model_1.visible = false;
    scene.add(model_1);

  }
  )

  console.log(gltf.animations);

  mixer_1 = new THREE.AnimationMixer(model_1);
  const animation = gltf.animations[0];
  console.log(animation);

  // choose the animation by its index
  const action = mixer_1.clipAction(animation);
  //action.play();
  action.setDuration(1.5);
  action.setLoop(THREE.LoopRepeat, Infinity).play();

  scene.add(model_1);
  const animate = function () {
    requestAnimationFrame(animate); mixer_1.update(0.01); // Update the animation mixer 
    renderer.render(scene, camera);
  };
  animate();
},
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

// Load a glTF resource model_2
loader.load("02_supply_houses.glb", function (gltf) {
  model_2 = gltf.scene;

  model_2.scale.set(0.065, 0.065, 0.065);
  model_2.position.set(0, 0, 0);
  model_2.rotation.set(0.05, -0.5, 0);
  model_2.traverse(n => {
    n.castShadow = true;
    n.receiveShadow = true;

    model_2.receiveShadow = true;
    model_2.visible = false;

    scene.add(model_2);

  }
  )

  console.log(gltf.animations);

  mixer_2 = new THREE.AnimationMixer(model_2);
  const animation = gltf.animations[0];
  console.log(animation);

  // choose the animation by its index
  const action = mixer_2.clipAction(animation);
  //action.play();
  action.setDuration(2);
  action.setLoop(THREE.LoopRepeat, Infinity).play();

  scene.add(model_2);
  const animate = function () {
    requestAnimationFrame(animate); mixer_2.update(0.01); // Update the animation mixer 
    renderer.render(scene, camera);
  };
  animate();

},
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

// Load a glTF resource model_3
loader.load("03_bi_directional_house.glb", function (gltf) {
  model_3 = gltf.scene;

  model_3.scale.set(0.065, 0.065, 0.065);
  model_3.position.set(0, 0, 0);
  model_3.rotation.set(0.05, -0.5, 0);
  model_3.traverse(n => {
    n.castShadow = true;
    n.receiveShadow = true;

    model_3.receiveShadow = true;
    model_3.visible = false;

    scene.add(model_3);

  }
  )

  console.log(gltf.animations);

  mixer_3 = new THREE.AnimationMixer(model_3);
  const animation = gltf.animations[0];
  console.log(animation);

  // choose the animation by its index
  const action = mixer_3.clipAction(animation);
  //action.play();
  action.setDuration(1.5);
  action.setLoop(THREE.LoopRepeat, Infinity).play();

  scene.add(model_3);
  const animate = function () {
    requestAnimationFrame(animate); mixer_3.update(0.01); // Update the animation mixer 
    renderer.render(scene, camera);
  };
  animate();
},
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

// Load a glTF resource model_4
loader.load("04_electification_houses.glb", function (gltf) {
  model_4 = gltf.scene;

  model_4.scale.set(0.065, 0.065, 0.065);
  model_4.position.set(0, 0, 0);
  model_4.rotation.set(0.05, -0.5, 0);
  model_4.traverse(n => {
    n.castShadow = true;
    n.receiveShadow = true;

    model_4.receiveShadow = true;
    model_4.visible = false;

    scene.add(model_4);

  }
  )

  console.log(gltf.animations);

  mixer_4 = new THREE.AnimationMixer(model_4);
  const animation = gltf.animations[0];
  console.log(animation);

  // choose the animation by its index
  const action = mixer_4.clipAction(animation);
  //action.play();
  action.setDuration(1.5);
  action.setLoop(THREE.LoopRepeat, Infinity).play();

  scene.add(model_4);
  const animate = function () {
    requestAnimationFrame(animate); mixer_4.update(0.01); // Update the animation mixer 
    renderer.render(scene, camera);
  };
  animate();
},
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

// Load a glTF resource model_5
loader.load("05_digital_tech_houses.glb", function (gltf) {
  model_5 = gltf.scene;

  model_5.scale.set(0.065, 0.065, 0.065);
  model_5.position.set(0, 0, 0);
  model_5.rotation.set(0.05, -0.5, 0);
  model_5.traverse(n => {
    n.castShadow = true;
    n.receiveShadow = true;

    model_5.receiveShadow = true;
    model_5.visible = false;

    scene.add(model_5);

  }
  )

  console.log(gltf.animations);

  mixer_5 = new THREE.AnimationMixer(model_5);
  const animation = gltf.animations[0];
  console.log(animation);

  // choose the animation by its index
  const action = mixer_5.clipAction(animation);
  //action.play();
  action.setDuration(1.5);
  action.setLoop(THREE.LoopRepeat, Infinity).play();

  scene.add(model_5);
  const animate = function () {
    requestAnimationFrame(animate); mixer_5.update(0.01); // Update the animation mixer 
    renderer.render(scene, camera);
  };
  animate();
},
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

// const gridHelper = new THREE.GridHelper(10, 10, 0xaec6cf, 0xaec6cf)
// scene.add(gridHelper)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const hem_light = new THREE.HemisphereLight(0xffffff, 0x080820, .5);
scene.add(hem_light);

const ambientlight = new THREE.AmbientLight(0xFFFFFF, .15); // soft white light
scene.add(ambientlight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(100, 1000, 100);
spotLight.castShadow = true;
spotLight.shadow.bias = 0.0001;
spotLight.shadow.mapSize.width = 1024 * 4;
spotLight.shadow.mapSize.height = 1024 * 4;
scene.add(spotLight);


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

//add an animation that moves the cube through first 40 percent of scroll
// animationScripts.push({
//   start: 0,
//   end: 30,
//   func: () => {
//     globeModel.scale.x = lerp(0.3, 1, scalePercent(0, 70));
//     globeModel.scale.y = lerp(0.3, 1, scalePercent(0, 70));
//     globeModel.scale.z = lerp(0.3, 1, scalePercent(0, 70));
//     camera.lookAt(new THREE.Vector3(globeModel.position.x, scalePercent(0, 4), globeModel.position.z));
//     camera.position.set(0, 1, 2);
//   },
// });

// animationScripts.push({
//   start: 31,
//   end: 50,
//   func: () => {
//     globeModel.scale.set(0, 0, 0);
//   },
// });

animationScripts.push({
  start: 0.1,
  end: 30,
  func: () => {
    globeModel.visible = true;
    model_1.visible = false;
    model_2.visible = false;
    model_3.visible = false;
    model_4.visible = false;
    model_5.visible = false;
    globeModel.scale.x = lerp(0.3, 1, scalePercent(0, 70));
    globeModel.scale.y = lerp(0.3, 1, scalePercent(0, 70));
    globeModel.scale.z = lerp(0.3, 1, scalePercent(0, 70));
    camera.lookAt(new THREE.Vector3(globeModel.position.x, scalePercent(0, 4), globeModel.position.z));
    camera.position.set(0, 1, 2);
  },
});


animationScripts.push({
  start: 35,
  end: 78,
  func: () => {
    const t = scalePercent(0, 100); // Calculate the interpolation value

    // Interpolate the camera position
    camera.position.x = lerp(.25, 2, t);
    camera.position.y = lerp(.5, 2, t);
    globeModel.visible = false;

    if (model_1 && model_2 && model_3 && model_4 && model_5) {
      if (t <= .48) {
        // Transition from model_1 to model_2
        model_1.visible = true;
        model_2.visible = false;
        model_3.visible = false;
        model_4.visible = false;
        model_5.visible = false;
        camera.lookAt(model_1.position);
      } else if (t <= .5) {
        // Transition from model_2 to model_3
        model_1.visible = false;
        model_2.visible = true;
        model_3.visible = false;
        model_4.visible = false;
        model_5.visible = false;
        camera.lookAt(model_2.position);
      } else if (t <= .6) {
        // Transition from model_3 to model_4
        model_1.visible = false;
        model_2.visible = false;
        model_3.visible = true;
        model_4.visible = false;
        model_5.visible = false;
        camera.lookAt(model_3.position);
      } else if (t <= 20) {
        // Transition from model_4 to model_5
        model_1.visible = false;
        model_2.visible = false;
        model_3.visible = false;
        model_4.visible = true;
        model_5.visible = false;
        camera.lookAt(model_4.position);
      } else {
        // Transition from model_5 to model_1
        model_1.visible = false;
        model_2.visible = false;
        model_3.visible = false;
        model_4.visible = false;
        model_5.visible = true;
        camera.lookAt(model_5.position);
      }
    }
  },
});

animationScripts.push({
  start: 78,
  end: 100,
  func: () => {
    globeModel.visible = false;
    model_1.visible = false;
    model_2.visible = false;
    model_3.visible = false;
    model_4.visible = false;
    model_5.visible = false;

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
