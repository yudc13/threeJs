import * as THREE from 'three';
import {RGBELoader} from 'three/addons';
import GUI from 'lil-gui';
import {initAxesHelper, initCamera, initControls, initScene, onResize} from '../utils';

const width = window.innerWidth;
const height = window.innerHeight;
const gui = new GUI();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 场景
const scene = initScene();
// 相机
const camera = initCamera();

// textureLoader
const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load('./textures/door/color.jpg');
const alphaTexture = textureLoader.load('./textures/door/alpha.jpg');
const ambientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg');
const heightTexture = textureLoader.load('./textures/door/height.jpg');
const metalnessTexture = textureLoader.load('./textures/door/metalness.jpg');
const normalTexture = textureLoader.load('./textures/door/normal.jpg');
const roughnessTexture = textureLoader.load('./textures/door/roughness.jpg');
const matcapTexture = textureLoader.load('./textures/matcaps/8.png');
const gradientsTexture = textureLoader.load('./textures/gradients/3.jpg');

// RGBELoader
const rgbeLoader = new RGBELoader();
rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
	console.log(environmentMap);
	// 环境贴图 映射方式
	// 球面反射映射, 模拟环境贴图在物体表面的反射效果
	environmentMap.mapping = THREE.EquirectangularReflectionMapping;
	scene.background = environmentMap;
	scene.environment = environmentMap;
	scene.fog = new THREE.FogExp2(0xffffff, 0.1);
});


// 纹理色彩空间
colorTexture.colorSpace = THREE.SRGBColorSpace;
// 基础网格材质
// 不受光照影响
// const material = new THREE.MeshBasicMaterial({});
function initBasicMaterialGui() {
	const basicMaterialObj = {
		map: false, // 纹理贴图
		alphaMap: false, // 灰度纹理贴图
		wireframe: false, // 线框
		transparent: false, // 材质是否透明
		opacity: 1, // 透明度
		color: '#ffffff', // 颜色
	};
	gui.add(basicMaterialObj, 'map').name('map').onChange(event => {
		if (event) {
			material.map = colorTexture;
		} else {
			material.map = null;
		}
		material.needsUpdate = true;
	});
// alphaMap: 灰度纹理贴图, 控制表面的不透明度
// 黑色: 完全透明
// 白色: 完全不透明
	gui.add(basicMaterialObj, 'alphaMap').name('alphaMap').onChange(event => {
		if (event) {
			// 需要设置 material.transparent = true 才生效
			material.alphaMap = alphaTexture;
		} else {
			material.alphaMap = null;
		}
		material.needsUpdate = true;
	});
	gui.add(basicMaterialObj, 'transparent').onChange(event => {
		material.transparent = event;
	});
	gui.add(basicMaterialObj, 'opacity', 0, 1, 0.01).onChange(event => {
		material.opacity = event;
	});
	gui.add(basicMaterialObj, 'wireframe').onChange(event => {
		material.wireframe = event;
	});
	gui.addColor(basicMaterialObj, 'color').onChange(event => {
		material.color = new THREE.Color(event);
	});
	gui.add(material, 'side', {
		'THREE.FrontSide': THREE.FrontSide,
		'THREE.BackSide': THREE.BackSide,
		'THREE.DoubleSide': THREE.DoubleSide
	}).onChange(event => {
		material.side = event;
	});
}

// initBasicMaterialGui()
// 法线网格材质
// 将法线映射成RGB颜色
// const material = new THREE.MeshNormalMaterial({});
function initNormalMaterialGui() {
	const normalMaterialObj = {
		normalMap: false, // 法线贴图
		flatShading: false, // 是否使用平滑
	};
	gui.add(normalMaterialObj, 'flatShading').onChange(event => {
		material.flatShading = event;
	});
	gui.add(normalMaterialObj, 'normalMap').onChange(event => {
		if (event) {
			material.normalMap = normalTexture;
		} else {
			material.normalMap = null;
		}
		material.needsUpdate = true;
	});
}

// initNormalMaterialGui()

// 材质捕捉
// const material = new THREE.MeshMatcapMaterial({});
// function initMatCapMaterialGui() {
// 	const matCapMaterialObj = {
// 		matcap: false
// 	}
// 	gui.add(matCapMaterialObj, 'matcap').onChange(event => {
// 		if (event) {
// 			material.matcap = matcapTexture
// 		} else {
// 			material.matcap = null;
// 		}
// 		material.needsUpdate = true
// 	})
// }
// initMatCapMaterialGui()

// 深度网格材质
// const material = new THREE.MeshDepthMaterial({});

// 非光泽表面材质
// 没有镜面高光
// 这种材质需要光照才能显示
// const material = new THREE.MeshLambertMaterial({});

// 镜面高光材质
// const material = new THREE.MeshPhongMaterial({
// 	// specular: '#0000ff',
// 	// shininess: 30,
// });
function initPhongMaterialGui() {
	const phongMaterialObj = {
		specular: '#111111', // 高光颜色
		shininess: 30, // 高亮程度
	};
	gui.add(phongMaterialObj, 'shininess', 1, 100, 1).onChange(event => {
		material.shininess = event;
		material.needsUpdate = true;
	});
	gui.addColor(phongMaterialObj, 'specular').onChange(event => {
		material.specular = new THREE.Color(event);
	});
}

// initPhongMaterialGui()

// 卡通着色材质
// 必须设置以下两个属性
// gradientsTexture.minFilter = THREE.NearestFilter
// gradientsTexture.magFilter = THREE.NearestFilter
// const material = new THREE.MeshToonMaterial({
// 	gradientMap: gradientsTexture,
// })

// const material = new THREE.MeshStandardMaterial({
// 	// map: colorTexture,
// 	// aoMap: ambientOcclusionTexture,
// 	// aoMapIntensity: 1,
// 	// displacementMap: heightTexture,
// 	// displacementScale: 0.1,
// 	// metalnessTexture: metalnessTexture,
// 	// roughnessTexture: roughnessTexture,
// })

// MeshStandardMaterial 增强
const material = new THREE.MeshPhysicalMaterial({
	map: colorTexture,
	aoMap: ambientOcclusionTexture,
	aoMapIntensity: 1,
	displacementMap: heightTexture,
	displacementScale: 0.1,
	metalnessTexture: metalnessTexture,
	roughnessTexture: roughnessTexture,
	normalTexture: normalTexture,
});
material.normalScale.set(0.5, 0.5);
material.transparent = true;
material.alphaTexture = alphaTexture;
material.sheen = 1;
material.sheenRoughness = 0.25;
material.sheenColor.set(1, 1, 1);

function initStandardMaterialGui() {
	const standardMaterialObj = {
		roughness: 0.2, // 材质的粗糙程度
		metalness: 0.7, // 用于生锈金属的外观
		clearcoat: 1, // 在物体表面加一层薄薄的半透明材质
		clearcoatToughness: 0, // 半透明材质粗糙度
		sheen: 1, // 光泽层的强度
		sheenRoughness: 0.25, // 光泽层粗糙度
		sheenColor: '#ffffff', // 光泽层颜色
	};
	gui.add(standardMaterialObj, 'roughness', 0, 1, 0.01).onChange(event => {
		material.roughness = event;
	});
	gui.add(standardMaterialObj, 'metalness', 0, 1, 0.01).onChange(event => {
		material.metalness = event;
	});
	gui.add(standardMaterialObj, 'clearcoat', 0, 1, 0.0001).onChange(event => {
		material.clearcoat = event;
	});
	gui.add(standardMaterialObj, 'clearcoatToughness', 0, 1, 0.0001).onChange(event => {
		material.clearcoatToughness = event;
	});
	gui.add(standardMaterialObj, 'sheen', 0, 1, 0.0001).onChange(event => {
		material.sheen = event;
	});
	gui.add(standardMaterialObj, 'sheenRoughness', 0, 1, 0.0001).onChange(event => {
		material.sheenRoughness = event;
	});
	gui.addColor(standardMaterialObj, 'sheenColor').onChange(event => {
		material.sheenColor = new THREE.Color(event);
	});
}

initStandardMaterialGui();

// 添加环境光
// const ambientLight = new THREE.AmbientLight()
// scene.add(ambientLight)
// // 添加点射光
// const pointLight = new THREE.PointLight(0xffffff, 10);
// pointLight.position.set(0, 0, 5)
// scene.add(pointLight)

// 立方体
const cube = new THREE.Mesh(
	new THREE.BoxGeometry(2, 2, 2),
	material
);
cube.position.x = -4;

// 球
const sphere = new THREE.Mesh(
	new THREE.SphereGeometry(1, 32, 16),
	material
);

// 环
const torus = new THREE.Mesh(
	new THREE.TorusGeometry(1, 0.4, 12, 48),
	material
);
torus.position.x = 4;

// 平面
const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(2, 2),
	material
);
plane.position.x = 8;


scene.add(cube, sphere, torus, plane);

const clock = new THREE.Clock();

function tick() {
	const elapsedTime = clock.getElapsedTime();
	cube.rotation.x = elapsedTime * 0.15;
	sphere.rotation.x = elapsedTime * 0.15;
	torus.rotation.x = elapsedTime * 0.15;

	cube.rotation.y = elapsedTime * 0.1;
	sphere.rotation.y = elapsedTime * 0.1;
	torus.rotation.y = elapsedTime * 0.1;

	requestAnimationFrame(tick);
	renderer.render(scene, camera);
}

initAxesHelper(scene, 10);
initControls(camera, renderer.domElement);

onResize();
tick();