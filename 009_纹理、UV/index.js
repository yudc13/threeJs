import * as THREE from 'three';
import {OrbitControls} from 'three/addons';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(40);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);


const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./demo.png',
	() => {
		console.log('loaded');
	}, undefined,
	(err) => {
		console.log(err);
	});

console.log(texture);


const geometry = new THREE.BoxGeometry(20, 20, 20,1, 1);
const material = new THREE.MeshBasicMaterial({map: texture, wireframe: false});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

console.log(geometry);

new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 50);
camera.lookAt(mesh.position);

scene.add(camera);
scene.add(axesHelper);

function tick() {
	requestAnimationFrame(tick);
	renderer.render(scene, camera);
}

tick();