import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );


camera.position.set(0, 0, 20); 
// camera.lookAt(0, 0, 0);
camera.lookAt(scene.position);


const renderer = new THREE.WebGLRenderer(({alpha: true,antialias: true}));
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild( renderer.domElement );

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();


function onMouseMove( event ) {

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    console.log([mouse.x,mouse.y])

    raycaster.setFromCamera(mouse,camera);
    const intersects = raycaster.intersectObjects( scene.children );

    intersects.forEach((hit) => {
        const touched = hit.object;
        
        // Ensure we are only coloring the meshes (not lights or helpers)
        if (touched.isMesh) {
            
            if (touched.material.color.getHex() == 0xffffff){
                const score = document.getElementById("score");
                score.textContent = parseInt(score.textContent) +1;
                touched.material.color.set(Math.random() * 0xffffff);

                
            }
        }
    });
}

window.addEventListener('mousemove', onMouseMove)

const geometry = new THREE.IcosahedronGeometry(.75,1);

// 2. Create the Material (Standard PBR)
const material = new THREE.MeshStandardMaterial({
    color: 0x0dcbd1, 
    flatShading: true,
});

const wireMat = new THREE.MeshBasicMaterial({
    color: 0x37393b, 
    wireframe: true,
    transparent: true,

})


const mouse_geometry = new THREE.IcosahedronGeometry(.5,5);


const mouse_material = new THREE.MeshStandardMaterial({
        color: 0xffffff,          // Base color (keep dark for better glow)
        emissive: 0xffffff,       // The glow color
        emissiveIntensity: 5,     // How "bright" it is
        flatShading: true
    })

const mouse_mesh = new THREE.Mesh(mouse_geometry, mouse_material.clone());
mouse_mesh.position.x = mouse.x;
mouse_mesh.position.y = mouse.y;
mouse_mesh.position.z = 0;

const mouse_light = new THREE.PointLight(0xffffff,20);
mouse_mesh.add(mouse_light)
scene.add(mouse_mesh);




const pivot = new THREE.Group();
scene.add(pivot);
// 3. Create the Mesh
const meshes = []

const amount = 5;

let i = 0;

for ( let x = 0; x < amount; x ++ ) {
    for ( let y = 0; y < amount; y ++ ) {
         for ( let z = 0; z < amount; z ++ ) {
            const m = new THREE.Mesh(geometry, material.clone());

            // m.position.x = (x - (amount - 1) / 2) * 2;
            // m.position.y = (y - (amount - 1) / 2) * 2;
            // m.position.z = (z - (amount - 1) / 2) * 2;
            m.material.color.setHex(0xffffff);

            m.position.x = THREE.MathUtils.randFloatSpread(20)
            m.position.y = THREE.MathUtils.randFloatSpread(20)
            m.position.z = THREE.MathUtils.randFloatSpread(20)
            m.orbitRadius = m.position.length(); 
            // Store a random starting angle so they don't start in a line
            m.angle = Math.random() * Math.PI * 2; 
            // Give them a random speed
            m.speed = 0.005 + Math.random() * 0.01;

            const wm = new THREE.Mesh(geometry, wireMat.clone());
            wm.scale.setScalar(1.01);
            m.add(wm)

            scene.add(m);
            i += 1;
            console.log([x,y]);
            meshes.push(m)
            pivot.add(m);
        }
    }

}

console.log(i);
console.log(meshes.length)


meshes.forEach(m => {
    m.basePosition = m.position.clone();
    scene.add(m);
});


// const hemiLight = new THREE.HemisphereLight(0x0c8ff2, 0xed761a, 40);
// scene.add(hemiLight);

const light = new THREE.DirectionalLight( 0xffffff, 3 );
light.position.set( 1, 1, 1 ).normalize();
scene.add( light );



const controls = new OrbitControls( camera, renderer.domElement );
// controls.enableDamping = true;
// controls.dampingFactor = .01;
// // camera.position.set(2, 1, 1);
controls.update();


// // Variable to track scroll position
// let scrollY = window.scrollY;

// window.addEventListener('scroll', () => {
//     scrollY = window.scrollY;
// });



function animate() {
	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
    raycaster.setFromCamera( mouse, camera );


    const moveAmount = scrollY * 0.01;

    // // Mesh 1 moves Left (negative X)
    // meshes[0].position.x = meshes[0].basePosition.x - moveAmount;

    // // Mesh 1 moves further Right from its starting 2
    // meshes[2].position.x = meshes[2].basePosition.x + moveAmount;

    // // Mesh 2 moves UP from its starting -3
    // meshes[1].position.y = meshes[1].basePosition.y + moveAmount;

   // Inside your animate function:
    raycaster.setFromCamera(mouse, camera);

    // Create a math Plane representing the surface you want the mesh to slide on
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Flat on the Z-axis
    const targetPoint = new THREE.Vector3();

    // Tell the raycaster to find where the mouse hits that plane
    raycaster.ray.intersectPlane(plane, targetPoint);

    // Move the mesh to that point
    mouse_mesh.position.copy(targetPoint);

    meshes.forEach(m => {
        m.rotation.y += .005;
        m.angle += m.speed; // Increment the angle
        
        m.position.x = Math.cos(m.angle) * m.orbitRadius;
        m.position.z = Math.sin(m.angle) * m.orbitRadius;
    });


    renderer.render(scene, camera);
}


