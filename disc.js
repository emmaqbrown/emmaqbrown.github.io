import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10 );
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer(({antialias: true}));
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );



const points = [];
// --- TOP ---
points.push(new THREE.Vector2(0, 0.1));      // Center top
points.push(new THREE.Vector2(0.8, 0.12));   // Top slope

// --- OUTER EDGE ---
points.push(new THREE.Vector2(1.0, 0.05));   // Top of rim
// points.push(new THREE.Vector2(1.5, 0.05));   // Top of rim

points.push(new THREE.Vector2(1.0, -0.05));  // Bottom of rim

// --- THE LIP (Depth) ---
points.push(new THREE.Vector2(0.95, -0.1));  // Lowest part of the rim

// --- THE RECESS (Going up more) ---
points.push(new THREE.Vector2(0.9, 0.02));   // Transition point inside the rim
points.push(new THREE.Vector2(0, 0.07));     // Center bottom (Up close to the top!)


const disc_geo = new THREE.LatheGeometry(points, 64);
disc_geo.computeVertexNormals();

// 3. Create a shiny plastic-looking material
const disc_mat = new THREE.MeshStandardMaterial({
    color: 0xffffff, 
    wireframe: true,
    side: THREE.DoubleSide // Important so the underside is visible
});

const disc = new THREE.Mesh(disc_geo, disc_mat);
scene.add(disc);

const hemiLight = new THREE.HemisphereLight(0x0c8ff2, 0xed761a, 10);
scene.add(hemiLight);
// 1. Soft base light (so the bottom isn't pitch black)
// const ambient = new THREE.AmbientLight(0xffffff, 0.3);
// scene.add(ambient);

// // 2. The "Key" light (creates the shape)
// const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
// topLight.position.set(5, 10, 5);
// scene.add(topLight);

// // 3. The "Detail" light (positioned low to catch the inner rim)
// const rimLight = new THREE.PointLight(0xffffff, 5);
// rimLight.position.set(0, -2, 0); // Positioned BELOW the frisbee
// scene.add(rimLight);


const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = .01;
// controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 2, 1, 1);

controls.update();


function animate() {
	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

    disc.rotation.y += 0.001;
  

    // controls.update();
    renderer.render(scene, camera);
}

