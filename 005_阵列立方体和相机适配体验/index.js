import * as THREE from 'three';

import {OrbitControls} from 'three/addons';

// 1. 创建一个场景Scene
const scene = new THREE.Scene();

// 2. 创建一个透视相机, 本质是模拟人眼
const camera = new THREE.PerspectiveCamera(
	100, // 视角
	window.innerWidth / window.innerHeight, // 宽高比
	0.1, // 近平面
	9000 // 远平面
);

// 3. 创建一个渲染器
const renderer = new THREE.WebGLRenderer();

// 4. 设置渲染器的宽高
renderer.setSize(window.innerWidth, window.innerHeight);

// 5. 将渲染器添加到画布中
document.body.appendChild(renderer.domElement);


// 添加坐标辅助器
// x, y, z
// R, G, B
// 红 绿 蓝
const axesHelper = new THREE.AxesHelper(30);

scene.add(axesHelper);

// 创建一个立方体
const geometry = new THREE.BoxGeometry(
	1,
	1,
	1
);

// 创建一个材质
const material = new THREE.MeshBasicMaterial({
	color: 0x0fff00, // 材质颜色
	transparent: true, // 开启透明度
	opacity: 0.5, // 设置透明度
});

for (let i = 0; i < 10; i++) {
	for (let j = 0; j < 10; j++) {
		const cube = new THREE.Mesh(geometry, material);
		cube.position.set(i * 2, 0, j * 2);
		scene.add(cube);
	}
}

camera.position.set(30, 30, 30);
camera.lookAt(0, 0, 0);


new OrbitControls(camera, renderer.domElement);


function animate() {
	requestAnimationFrame(animate);
	// 旋转
	// cube.rotation.x += 0.01
	// cube.rotation.y += 0.01
	renderer.render(scene, camera);
}

animate();