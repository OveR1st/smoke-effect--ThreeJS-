import './style.scss'

import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';

import Stats from "three/examples/jsm/libs/stats.module";

/**
 * DAT GUI
 */
const gui = new dat.GUI();

/**
 * Stats FPS
 */

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

/**
 * Size
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Camera
 */
const filedOfView = 60;
const aspectRatio = sizes.width / sizes.height;
const nearArt = 1;
const farArt = 10000;

const camera = new THREE.PerspectiveCamera(
  filedOfView,
  aspectRatio,
  nearArt,
  farArt
);

camera.position.set(0, 0, 400);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true;

const container = document.getElementById('world');
container.appendChild(renderer.domElement)

const axes = new THREE.AxesHelper(100)
scene.add(axes)

/**
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement)
// controls.autoRotate = true;
// controls.autoRotateSpeed = 7;

/**
 * Lights
 */
const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
const ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
const shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

scene.add(hemisphereLight)
scene.add(ambientLight)
scene.add(shadowLight)

/**
 * Smoke
 */
const smokeTexture = new THREE.TextureLoader()
  .load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/204808/smoke.png')
const smokeMat = new THREE.MeshLambertMaterial({
  color: 0x0196ff,
  map: smokeTexture,
  transparent: true
})

const smokeGeom = new THREE.PlaneGeometry(300, 300);

const smokeParticles = [];

for (let i = 0; i < 150; i++) {
  const piece = new THREE.Mesh(smokeGeom, smokeMat);
  piece.position.set(
    Math.random() * 500 - 250,
    Math.random() * 500 - 250,
    Math.random() * 1000 - 100,
  );
  piece.rotation.z = Math.random() * 360;
  scene.add(piece)

  smokeParticles.push(piece);
}

const animateSmoke = () => {
  for (let el of smokeParticles) {
    el.rotation.z += .003;
  }
}
/**
 * Loop (tick)
 */
function loop() {
  stats.begin();
  // update smoke
  animateSmoke();
  controls.update();
  renderer.render(scene, camera);
  stats.end();
  requestAnimationFrame(loop)
}

loop();