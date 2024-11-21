import * as THREE from 'three'
import {OrbitControls} from 'three/addons'

// 渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio( window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 场景scene
const scene = new THREE.Scene()

// 坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const pixelRatio = renderer.getPixelRatio()

// 对象
const geometry = new THREE.BoxGeometry(pixelRatio * 0.5, pixelRatio * 0.5, 1)
// 材质
const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
// 网格模型
const mesh = new THREE.Mesh(geometry, material)

// 加入场景
scene.add(mesh)

// 创建相机
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1, 100
)
// 控制器
new OrbitControls(camera, renderer.domElement)

camera.position.set(0, 0, 3)

scene.add(camera)

const clock = new THREE.Clock()

console.log(camera.aspect);

function tick() {
	requestAnimationFrame(tick)
	// 运行时间总和
	const elapsedTime = clock.getElapsedTime()
	mesh.position.y = Math.sin(elapsedTime)
	mesh.position.x = Math.cos(elapsedTime)
	renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
	const width = window.innerWidth
	const height = window.innerHeight

	// 更新相机aspect
	camera.aspect = width / height
	camera.updateProjectionMatrix()

	renderer.setSize(width, height)
})

tick()