import GUI from 'lil-gui';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons';

const gui = new GUI();

const options = {
	myBoolean: true,
	myString: 'hello',
	widthSegments: 1,
	heightSegments: 1,
	depthSegments: 1,
};

const colorFormats = {
	color: '#ffffff',
	int: 0xffffff,
	object: {r: 1, g: 1, b: 1},
	array: [1, 1, 1]
};


gui.add(options, 'widthSegments', 1, 10, 1);
gui.add(options, 'heightSegments', 1, 10, 1);
gui.add(options, 'depthSegments', 1, 10, 1);
gui.addColor(colorFormats, 'color');
const cameraPositionFolder = gui.addFolder('camera.position');
const cameraFolder = gui.addFolder('camera');


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#fff');

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
	color: '#f3d9d7',
	wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
scene.add(camera);
camera.position.set(3, 3, 3);
camera.lookAt(mesh.position);


cameraFolder.add(camera, 'fov', 50, 150, 5);
cameraFolder.add(camera, 'near', 0.1, 1, 0.1);
cameraFolder.add(camera, 'far', 10, 200, 5);

cameraPositionFolder.add(camera.position, 'x', 1, 10, 1);
cameraPositionFolder.add(camera.position, 'y', 1, 10, 1);
cameraPositionFolder.add(camera.position, 'z', 1, 1, 1);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


function updateGeometry(params) {
	const {widthSegments, heightSegments, depthSegments} = Object.assign({}, mesh.geometry.parameters, params);
	geometry.dispose();
	mesh.geometry = new THREE.BoxGeometry(1, 1, 1, widthSegments, heightSegments, depthSegments);
}

gui.onChange(event => {
	const {property, value} = event;
	console.log(event);
	switch (property) {
		case 'color':
			material.color.set(value);
			break;
		case 'widthSegments':
		case 'heightSegments':
		case 'depthSegments':
			updateGeometry({[property]: value});
			break;
		case 'fov':
		case 'near':
		case 'far':
			camera.updateProjectionMatrix();
			break;
	}
});

function tick() {
	requestAnimationFrame(tick);
	renderer.render(scene, camera);
}

tick();

