import * as THREE from 'three'

import { OrbitControls } from 'three/addons'
import Stats from 'three/addons/libs/stats.module';

// 1. 创建一个场景Scene
const scene = new THREE.Scene();

// 2. 创建一个透视相机, 本质是模拟人眼
const camera = new THREE.PerspectiveCamera(
	75, // 视角
	window.innerWidth / window.innerHeight, // 宽高比
	0.1, // 近平面
	10 // 远平面
)

// 3. 创建一个渲染器
const renderer = new THREE.WebGLRenderer()

// 4. 设置渲染器的宽高
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)

// 5. 将渲染器添加到画布中
document.body.appendChild(renderer.domElement)

const stats = new Stats()
document.body.appendChild(stats.domElement)

// 添加坐标辅助器
// x, y, z
// R, G, B
// 红 绿 蓝
const axesHelper = new THREE.AxesHelper(5);

scene.add(axesHelper)

// 创建一个立方体
const geometry = new THREE.BoxGeometry(
	1,
	1,
	1
)

// 创建一个材质
const material = new THREE.MeshLambertMaterial({
	color: 0x0fff00, // 材质颜色
	transparent: true, // 开启透明度
	opacity: 1, // 设置透明度
})

// const pointLight = new THREE.PointLight(
// 	0xffffff, // 颜色
// 	40000, // 强度
// )
//
// pointLight.position.set(5, 5, 0)
//
// // 光源 辅助观察
// const pointLightHelper = new THREE.PointLightHelper(
// 	pointLight, // 光源
// 	1 // 半径
// )
//
// scene.add(pointLightHelper)

// 环境光
// 没有特定方向
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(5, 1, 1)

// 平行光辅助器
const directionalLightHelper = new THREE.DirectionalLightHelper(
	directionalLight, // 光源
	0.5 // 半径
)

scene.add(directionalLight)
scene.add(directionalLightHelper)
// 创建一个网格模型
const cube = new THREE.Mesh(geometry, material)

// 设置网格坐标 默认 0 0 0
cube.position.set(0, 0, 0)

// 设置相机位置
camera.position.set(5, 5, 5)
// 设置相机观察目标
camera.lookAt(cube.position)

// 将网格模型加入场景scene中
scene.add(cube)


new OrbitControls(camera, renderer.domElement)


function animate() {
	stats.update()
	requestAnimationFrame(animate)
	// 旋转
	cube.rotation.x += 0.01
	cube.rotation.y += 0.01
	renderer.render(scene, camera)
}

animate()