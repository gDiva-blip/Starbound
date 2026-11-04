
import * as THREE from 'three';

// =============================================
// STARBOUND — FIRST-PERSON NASA ENVIRONMENT
// =============================================

const container = document.getElementById('three-container');

if (!container) {
    throw new Error('STARBOUND: #three-container was not found.');
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8bbbd7);
scene.fog = new THREE.Fog(0x8bbbd7, 120, 650);

const camera = new THREE.PerspectiveCamera(
    75,
    1,
    0.1,
    1200
);

camera.position.set(0, 2, 35);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

container.innerHTML = '';
container.appendChild(renderer.domElement);

renderer.domElement.style.position = 'absolute';
renderer.domElement.style.inset = '0';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.display = 'block';

// =============================================
// LIGHTING
// =============================================

scene.add(new THREE.HemisphereLight(0xc9e7ff, 0x536044, 2));

const sunlight = new THREE.DirectionalLight(0xffe0b5, 3.2);
sunlight.position.set(-100, 150, 80);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(2048, 2048);
sunlight.shadow.camera.left = -180;
sunlight.shadow.camera.right = 180;
sunlight.shadow.camera.top = 180;
sunlight.shadow.camera.bottom = -180;
scene.add(sunlight);

// =============================================
// MATERIALS
// =============================================

const materials = {
    concrete: new THREE.MeshStandardMaterial({
        color: 0x777b7b,
        roughness: 0.95
    }),
    asphalt: new THREE.MeshStandardMaterial({
        color: 0x292f35,
        roughness: 0.9
    }),
    grass: new THREE.MeshStandardMaterial({
        color: 0x526b45,
        roughness: 1
    }),
    building: new THREE.MeshStandardMaterial({
        color: 0x9babb5,
        roughness: 0.85
    }),
    darkBuilding: new THREE.MeshStandardMaterial({
        color: 0x485763,
        roughness: 0.8
    }),
    white: new THREE.MeshStandardMaterial({
        color: 0xe5e9e9,
        roughness: 0.55
    }),
    red: new THREE.MeshStandardMaterial({
        color: 0xb83d32,
        roughness: 0.7
    }),
    metal: new THREE.MeshStandardMaterial({
        color: 0x687985,
        metalness: 0.65,
        roughness: 0.35
    }),
    glass: new THREE.MeshStandardMaterial({
        color: 0x253e52,
        metalness: 0.35,
        roughness: 0.2
    }),
    black: new THREE.MeshStandardMaterial({
        color: 0x151a20,
        roughness: 0.8
    }),
    gold: new THREE.MeshStandardMaterial({
        color: 0xe0ad4e,
        metalness: 0.6,
        roughness: 0.3
    })
};

// =============================================
// HELPER FUNCTIONS
// =============================================

function box(parent, x, y, z, w, h, d, material) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        material
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);

    return mesh;
}

function cylinder(parent, x, y, z, rTop, rBottom, height, material, sides = 16) {
    const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(rTop, rBottom, height, sides),
        material
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);

    return mesh;
}

function line(parent, start, end, material, radius = 0.12) {
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();

    const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, length, 8),
        material
    );

    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize()
    );

    parent.add(mesh);
    return mesh;
}

// =============================================
// GROUND AND ROADS
// =============================================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1200, 1200),
    materials.grass
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.15;
ground.receiveShadow = true;
scene.add(ground);

box(scene, 0, 0.02, 0, 18, 0.12, 600, materials.asphalt);

for (let z = -280; z < 300; z += 18) {
    box(scene, 0, 0.1, z, 0.25, 0.03, 8, materials.white);
}

box(scene, 0, 0.02, -75, 260, 0.12, 22, materials.asphalt);

// Roadside markings
for (let x = -120; x <= 120; x += 12) {
    box(scene, x, 0.12, -75, 5, 0.03, 0.25, materials.gold);
}

// =============================================
// VEHICLE ASSEMBLY BUILDING
// =============================================

function createVAB() {
    const vab = new THREE.Group();

    box(vab, 0, 68, -145, 105, 136, 65, materials.building);

    // Main vertical facade panels
    for (let x = -48; x <= 48; x += 12) {
        box(vab, x, 68, -111.9, 0.7, 132, 0.4, materials.white);
    }

    // Roof structure
    box(vab, 0, 137, -145, 112, 3, 72, materials.darkBuilding);

    // Large front doors
    box(vab, 0, 38, -111.4, 55, 75, 0.8, materials.darkBuilding);

    for (let x = -26; x <= 26; x += 13) {
        box(vab, x, 38, -110.8, 0.7, 72, 0.4, materials.metal);
    }

    // Upper windows
    for (let x = -43; x <= 43; x += 14) {
        box(vab, x, 112, -111.2, 9, 4, 0.5, materials.glass);
    }

    // Exterior supports
    for (let x = -50; x <= 50; x += 25) {
        box(vab, x, 68, -109, 1.5, 136, 1.5, materials.metal);
    }

    scene.add(vab);
}

createVAB();

// =============================================
// MOBILE LAUNCH PLATFORM
// =============================================

function createLaunchPlatform() {
    const platform = new THREE.Group();

    // Massive crawler-style base
    box(platform, 0, 3, -20, 32, 6, 25, materials.darkBuilding);

    // Track sections
    for (const x of [-12, 12]) {
        box(platform, x, 1.5, -20, 5, 3, 26, materials.black);

        for (let z = -31; z <= -9; z += 4) {
            cylinder(
                platform,
                x,
                1.5,
                z,
                1.2,
                1.2,
                1,
                materials.metal,
                12
            ).rotation.z = Math.PI / 2;
        }
    }

    // Deck
    box(platform, 0, 7, -20, 29, 2, 23, materials.metal);

    // Tower structure
    for (const x of [-7, 7]) {
        for (const z of [-29, -11]) {
            box(platform, x, 42, z, 1.5, 72, 1.5, materials.white);
        }
    }

    // Horizontal cross-bracing
    for (let y = 14; y <= 68; y += 9) {
        for (const z of [-29, -11]) {
            box(platform, 0, y, z, 15, 0.8, 0.8, materials.white);
        }

        for (const x of [-7, 7]) {
            box(platform, x, y, -20, 0.8, 0.8, 18, materials.white);
        }
    }

    // Diagonal support beams
    for (let y = 15; y <= 60; y += 18) {
        line(
            platform,
            new THREE.Vector3(-7, y, -29),
            new THREE.Vector3(7, y + 18, -29),
            materials.red,
            0.35
        );

        line(
            platform,
            new THREE.Vector3(7, y, -11),
            new THREE.Vector3(-7, y + 18, -11),
            materials.red,
            0.35
        );
    }

    // Top platform
    box(platform, 0, 79, -20, 19, 3, 23, materials.white);

    // Rocket
    cylinder(platform, 0, 38, -20, 2.7, 3.4, 59, materials.white, 24);

    cylinder(platform, 0, 70, -20, 2.7, 2.7, 7, materials.white, 24);

    cylinder(platform, 0, 74, -20, 0, 2.7, 5, materials.white, 24);

    // Rocket markings
    box(platform, 0, 49, -16.5, 2.2, 1.2, 0.2, materials.black);

    cylinder(platform, 0, 9, -20, 3.5, 2.8, 7, materials.red, 24);

    scene.add(platform);
}

createLaunchPlatform();

// =============================================
// CONTROL BUILDINGS
// =============================================

function createControlBuilding(x, z, width, height, depth) {
    const group = new THREE.Group();

    box(group, 0, height / 2, 0, width, height, depth, materials.building);

    box(
        group,
        0,
        height * 0.78,
        depth / 2 + 0.15,
        width * 0.75,
        height * 0.2,
        0.3,
        materials.glass
    );

    box(
        group,
        0,
        height + 0.5,
        0,
        width + 2,
        1,
        depth + 2,
        materials.darkBuilding
    );

    for (let px = -width / 2 + 4; px < width / 2; px += 7) {
        box(
            group,
            px,
            height * 0.42,
            depth / 2 + 0.2,
            3,
            5,
            0.3,
            materials.glass
        );
    }

    group.position.set(x, 0, z);
    scene.add(group);
}

createControlBuilding(-55, 12, 35, 14, 20);
createControlBuilding(58, -35, 42, 18, 25);
createControlBuilding(65, 45, 30, 12, 20);

// =============================================
// FLOODLIGHTS
// =============================================

function createFloodlight(x, z) {
    cylinder(scene, x, 15, z, 0.3, 0.5, 30, materials.metal);

    box(scene, x, 29, z, 5, 0.5, 1, materials.black);

    for (let i = -1; i <= 1; i++) {
        box(scene, x + i * 1.4, 28.5, z, 0.8, 0.7, 0.4, materials.gold);
    }
}

for (const x of [-45, 45, -90, 90]) {
    createFloodlight(x, -65);
}

// =============================================
// PALMS AND LANDSCAPE
// =============================================

function createPalm(x, z, height = 9) {
    const tree = new THREE.Group();

    cylinder(
        tree,
        0,
        height / 2,
        0,
        0.18,
        0.35,
        height,
        new THREE.MeshStandardMaterial({ color: 0x70513a })
    );

    const leaves = new THREE.MeshStandardMaterial({
        color: 0x345d36,
        roughness: 1
    });

    for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;

        const leaf = new THREE.Mesh(
            new THREE.ConeGeometry(0.55, 5, 5),
            leaves
        );

        leaf.position.set(
            Math.cos(angle) * 2,
            height,
            Math.sin(angle) * 2
        );

        leaf.rotation.z = -Math.PI / 2.7;
        leaf.rotation.y = -angle;
        tree.add(leaf);
    }

    tree.position.set(x, 0, z);
    scene.add(tree);
}

for (let i = 0; i < 25; i++) {
    createPalm(
        -130 + Math.random() * 260,
        -250 + Math.random() * 400,
        7 + Math.random() * 5
    );
}

// =============================================
// FIRST-PERSON ASTRONAUT ARMS AND GLOVES
// =============================================

const astronaut = new THREE.Group();

const suitMaterial = new THREE.MeshStandardMaterial({
    color: 0xe3e8e9,
    roughness: 0.85
});

const gloveMaterial = new THREE.MeshStandardMaterial({
    color: 0x242b32,
    roughness: 0.8
});

const cuffMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b969c,
    metalness: 0.3,
    roughness: 0.6
});

function createArm(side) {
    const arm = new THREE.Group();

    const sleeve = new THREE.Mesh(
        new THREE.CylinderGeometry(0.17, 0.23, 0.8, 16),
        suitMaterial
    );

    sleeve.rotation.z = -0.25 * side;
    sleeve.position.y = -0.35;
    arm.add(sleeve);

    const cuff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.19, 0.19, 0.13, 16),
        cuffMaterial
    );

    cuff.position.y = -0.76;
    arm.add(cuff);

    const glove = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 12),
        gloveMaterial
    );

    glove.scale.set(1, 0.8, 1.15);
    glove.position.y = -0.94;
    arm.add(glove);

    for (let i = 0; i < 4; i++) {
        const finger = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.045, 0.16, 4, 8),
            gloveMaterial
        );

        finger.position.set(
            (i - 1.5) * 0.075,
            -1.05,
            -0.08
        );

        arm.add(finger);
    }

    arm.position.set(side * 0.47, -0.45, -0.8);
    arm.rotation.z = side * -0.18;

    astronaut.add(arm);
}

createArm(-1);
createArm(1);

camera.add(astronaut);
scene.add(camera);

// =============================================
// PLAYER MOVEMENT
// =============================================

const keys = {};

let explorationActive = false;
let yaw = 0;
let pitch = 0;

const player = {
    speed: 18,
    height: 2
};

window.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
});

window.addEventListener('blur', () => {
    Object.keys(keys).forEach(key => {
        keys[key] = false;
    });
});

document.addEventListener('mousemove', (event) => {
    if (!explorationActive) return;

    if (document.pointerLockElement !== renderer.domElement) return;

    yaw -= event.movementX * 0.002;
    pitch -= event.movementY * 0.002;

    pitch = THREE.MathUtils.clamp(
        pitch,
        -Math.PI / 2.2,
        Math.PI / 2.2
    );

    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
});

renderer.domElement.addEventListener('click', () => {
    if (explorationActive && document.pointerLockElement !== renderer.domElement) {
        renderer.domElement.requestPointerLock();
    }
});

// =============================================
// START AND STOP EXPLORATION
// =============================================

window.startNasaExploration = function () {
    explorationActive = true;

    camera.position.set(0, player.height, 35);

    yaw = 0;
    pitch = 0;

    camera.rotation.set(0, 0, 0);
    camera.rotation.order = 'YXZ';

    resizeScene();
};

window.stopNasaExploration = function () {
    explorationActive = false;

    if (document.pointerLockElement) {
        document.exitPointerLock();
    }

    Object.keys(keys).forEach(key => {
        keys[key] = false;
    });
};

window.resizeThreeScene = function () {
    resizeScene();
};

// =============================================
// MOVEMENT AND ANIMATION
// =============================================

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    if (explorationActive) {
        const forward = new THREE.Vector3(
            -Math.sin(yaw),
            0,
            -Math.cos(yaw)
        );

        const right = new THREE.Vector3(
            Math.cos(yaw),
            0,
            -Math.sin(yaw)
        );

        if (keys.w || keys.arrowup) {
            camera.position.addScaledVector(forward, player.speed * delta);
        }

        if (keys.s || keys.arrowdown) {
            camera.position.addScaledVector(forward, -player.speed * delta);
        }

        if (keys.a || keys.arrowleft) {
            camera.position.addScaledVector(right, -player.speed * delta);
        }

        if (keys.d || keys.arrowright) {
            camera.position.addScaledVector(right, player.speed * delta);
        }

        camera.position.y = player.height;

        // Subtle astronaut walking movement
        const moving =
            keys.w || keys.a || keys.s || keys.d ||
            keys.arrowup || keys.arrowdown ||
            keys.arrowleft || keys.arrowright;

        astronaut.position.y = moving
            ? Math.sin(clock.elapsedTime * 9) * 0.025
            : 0;
    }

    renderer.render(scene, camera);
}

// =============================================
// RESPONSIVE RENDERING
// =============================================

function resizeScene() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
}

const observer = new ResizeObserver(resizeScene);
observer.observe(container);

window.addEventListener('resize', resizeScene);

resizeScene();
animate();
