import * as THREE from 'three';

// Configuration de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Création des fleurs
const flowers = [];
const flowerGeometry = new THREE.Group();

// Fonction pour créer une fleur
function createFlower(color) {
    const flower = new THREE.Group();

    // Centre de la fleur
    const centerGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const centerMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    flower.add(center);

    // Pétales
    const petalGeometry = new THREE.ConeGeometry(0.2, 0.8, 32);
    const petalMaterial = new THREE.MeshPhongMaterial({ color: color });
    
    for (let i = 0; i < 8; i++) {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.position.y = 0.4;
        petal.rotation.x = Math.PI / 3;
        const petalGroup = new THREE.Group();
        petalGroup.add(petal);
        petalGroup.rotation.y = (i * Math.PI) / 4;
        flower.add(petalGroup);
    }

    // Tige
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = -1;
    flower.add(stem);

    return flower;
}

// Création des 5 fleurs avec des couleurs différentes
const flowerColors = [0xff69b4, 0xff0000, 0x9932cc, 0x4169e1, 0xffa500];
const flowerPositions = [
    [-4, 0, -3],
    [-2, 0, -2],
    [0, 0, -4],
    [2, 0, -2],
    [4, 0, -3]
];

flowerPositions.forEach((position, index) => {
    const flower = createFlower(flowerColors[index]);
    flower.position.set(position[0], position[1], position[2]);
    flower.userData.isFlower = true;
    flowers.push(flower);
    scene.add(flower);
});

// Ajout de lumière
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 10, 5);
scene.add(directionalLight);

// Position de la caméra
camera.position.z = 10;
camera.position.y = 2;
camera.lookAt(0, 0, -3);

// Variables pour la gestion des interactions
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedFlower = null;
let isDragging = false;

// Gestionnaires d'événements
function onMouseDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (const intersect of intersects) {
        let parent = intersect.object;
        while (parent && !parent.userData.isFlower) {
            parent = parent.parent;
        }
        if (parent && parent.userData.isFlower) {
            selectedFlower = parent;
            isDragging = true;
            break;
        }
    }
}

function onMouseMove(event) {
    if (isDragging && selectedFlower) {
        const movementX = event.movementX * 0.01;
        const movementY = event.movementY * 0.01;
        selectedFlower.rotation.y += movementX;
        selectedFlower.rotation.x += movementY;
    }
}

function onMouseUp() {
    isDragging = false;
    selectedFlower = null;
}

// Ajout des écouteurs d'événements
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation
function animate() {
    requestAnimationFrame(animate);
    
    // Animation douce des fleurs
    flowers.forEach(flower => {
        if (flower !== selectedFlower) {
            flower.rotation.y += 0.001;
        }
    });
    
    renderer.render(scene, camera);
}

animate(); 