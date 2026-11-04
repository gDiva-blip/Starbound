import * as THREE from 'three';

// SCREEN NAVIGATION
window.showScreen = function(screenId) {
document.querySelectorAll(".screen").forEach(screen => {
screen.classList.remove("active");
});

document.getElementById(screenId)?.classList.add("active");

if (screenId === "level-one") {
    setTimeout(startNASA, 100);
}

};

// NASA SCENE
let scene, camera, renderer, astronaut;
let animationStarted = false;

function startNASA() {


if (animationStarted) return;
animationStarted = true;

const area = document.getElementById("game-area");

scene = new THREE.Scene();
scene.background = new THREE.Color(0x10182d);

camera = new THREE.PerspectiveCamera(
    75,
    area.clientWidth / area.clientHeight,
    0.1,
    1000
);

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(area.clientWidth, area.clientHeight);

area.appendChild(renderer.domElement);

// LIGHTS
scene.add(new THREE.HemisphereLight(0xffffff, 0x444466, 2));

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 10, 5);
scene.add(light);

// FLOOR
const floor = new THREE.Mesh(
    new THREE.BoxGeometry(30, 1, 30),
    new THREE.MeshStandardMaterial({ color: 0x444455 })
);

floor.position.y = -0.5;
scene.add(floor);

// WALLS
const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x26334d
});

function wall(x, y, z, width, height, depth) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        wallMaterial
    );

    mesh.position.set(x, y, z);
    scene.add(mesh);
}

wall(0, 3, -15, 30, 6, 1);
wall(-15, 3, 0, 1, 6, 30);
wall(15, 3, 0, 1, 6, 30);

// ASTRONAUT
astronaut = new THREE.Group();

const suit = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.4, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
);

suit.position.y = 1.3;
astronaut.add(suit);

const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 24, 24),
    new THREE.MeshStandardMaterial({
        color: 0x55ddff,
        metalness: 0.5,
        roughness: 0.2
    })
);

helmet.position.y = 2.3;
astronaut.add(helmet);

astronaut.position.set(0, 0, 5);
scene.add(astronaut);

camera.position.set(0, 4, 10);

// MOVEMENT
window.addEventListener("keydown", moveAstronaut);

animate();


}

function moveAstronaut(event) {


if (!astronaut) return;

if (event.key === "ArrowUp" || event.key === "w") {
    astronaut.position.z -= 0.5;
}

if (event.key === "ArrowDown" || event.key === "s") {
    astronaut.position.z += 0.5;
}

if (event.key === "ArrowLeft" || event.key === "a") {
    astronaut.position.x -= 0.5;
}

if (event.key === "ArrowRight" || event.key === "d") {
    astronaut.position.x += 0.5;
}


}

function animate() {


requestAnimationFrame(animate);

if (astronaut && camera) {
    camera.position.x = astronaut.position.x;
    camera.position.z = astronaut.position.z + 8;

    camera.lookAt(
        astronaut.position.x,
        astronaut.position.y + 1,
        astronaut.position.z
    );
}

renderer.render(scene, camera);


}
