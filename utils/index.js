import * as THREE from 'three';
import {OrbitControls} from 'three/addons';

export const initAxesHelper = (scene, size = 5) => {
	const axesHelper = new THREE.AxesHelper(size);
	scene.add(axesHelper);
};

export const initControls = (camera, dom) => {
	const controls = new OrbitControls(camera, dom);
	controls.enableDamping = true;
};

export const initScene = () => {
	const scene = new THREE.Scene()
	scene.background = new THREE.Color('#ccc')
	return scene
}


export const initCamera = () => {
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.set(0, 0, 10);
	return camera;
};

export const onResize = (renderer, camera) => {
	window.addEventListener('resize', () => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		renderer.setSize(width, height);
		renderer.setPixelRatio(window.devicePixelRatio);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	});
};