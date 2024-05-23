// Empty sketch
let onWindowResize;
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector'



export function sketch() {

    // CAMERA
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // WINDOW RESIZE
    onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);


    // SCENE

    const debugObject = {
        waveDepthColor: "#1e4d40",
        waveSurfaceColor: "#4d9aaa",
        fogNear: 3,
        fogFar: 10,
        fogColor: "#8e99a2"
    };

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(
        debugObject.fogColor,
        debugObject.fogNear,
        debugObject.fogFar
    );


    // LUCI
    const light1 = new THREE.PointLight(0xffffff, 5);
    light1.castShadow = true;
    scene.add(light1);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1); // Soft white light con intensità 1
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFFFFF, 0.5); // Luce direzionale con intensità 2
    pointLight.position.set(2.5, 2.5, 2.5); // Posiziona la luce sopra la scena
    pointLight.castShadow = true; // Abilita la creazione di ombre
    scene.add(pointLight);


    const planeGeometry = new THREE.PlaneGeometry(20, 15);
    const planeTexture = new THREE.TextureLoader().load('./assets/Metal002_4K-JPG_Color.jpg');
    const planeNormalMap = new THREE.TextureLoader().load('./assets/Metal002_4K-JPG_NormalDX.jpg');
    const planeDisplacementMap = new THREE.TextureLoader().load('./assets/Metal002_4K-JPG_Displacement.jpg');


    // GROUNDMATE
    planeTexture.repeat.set(4, 3);
    planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.wrapT = THREE.RepeatWrapping;

    planeNormalMap.repeat.set(4, 3);
    planeNormalMap.wrapS = THREE.RepeatWrapping;
    planeNormalMap.wrapT = THREE.RepeatWrapping;

    planeDisplacementMap.repeat.set(4, 3);
    planeDisplacementMap.wrapS = THREE.RepeatWrapping;
    planeDisplacementMap.wrapT = THREE.RepeatWrapping;


    const planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTexture,
        normalMap: planeNormalMap,
        displacementMap: planeDisplacementMap,
        metalness: 1,
        roughness: 0.5,
        displacementScale: 0.2,
    });
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true
    orbitControls.target.set(0, 1, 0)

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotateX(-Math.PI / 2);
    plane.receiveShadow = true;
    scene.add(plane);

    light1.shadow.mapSize.width = 1024;
    light1.shadow.mapSize.height = 1024;
    light1.shadow.camera.near = 0.1;
    light1.shadow.camera.far = 100;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 100;

    const mirrorBack1 = new Reflector(new THREE.PlaneGeometry(30, 20), {
        color: new THREE.Color(0x7f7f7f),
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
    });

    mirrorBack1.position.y = 1;
    mirrorBack1.position.z = -7;
    scene.add(mirrorBack1);

    const mirrorFront2 = new Reflector(new THREE.PlaneGeometry(30, 20), {
        color: new THREE.Color(0x7f7f7f),
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
    });
    mirrorFront2.position.y = 1;
    mirrorFront2.position.z = 7;
    mirrorFront2.rotateY(Math.PI);
    scene.add(mirrorFront2);



    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // Colore bianco

    const wallSide1 = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), wallMaterial);
    wallSide1.position.x = -10;
    wallSide1.rotation.y = Math.PI / 2;
    scene.add(wallSide1);

    const wallSide2 = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), wallMaterial);
    wallSide2.position.x = 10;
    wallSide2.rotation.y = -Math.PI / 2;
    scene.add(wallSide2);


    const cylinderGeometry = new THREE.CylinderGeometry(0.01, 0.1, 10, 15);

    const cylinderMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,      // Bianco
        emissive: 0x202020,   // Leggermente luminoso
        roughness: 0.5,       // Lisci
        metalness: 0.1,       // riflettività
    });

    const cylinderSpacingX = 1; // Spazio tra i cilindri in orizzontale
    const cylinderSpacingZ = 3; // Spazio tra le file di cilindri in profondità

    const reflectorSizeZ = 20;

    // Calcola la posizione Z minima e massima all'interno dei riflettori
    const minZ = -reflectorSizeZ / 2 + 0.9; // Offset di 0.9 per evitare che i cilindri si sovrappongano ai bordi del riflettore
    const maxZ = reflectorSizeZ / 2 - 0.9;

    let arraycilindri = []; // array bidimensionale

    for (let j = 0; j < 4; j++) { // Quattro file di cilindri
        arraycilindri[j] = []; // Inizializza la riga j nell'array bidimensionale
        for (let i = 0; i < 14; i++) { // Quattordici cilindri per fila
            const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
            cylinder.position.set(i * cylinderSpacingX - 6.5 * cylinderSpacingX, 5, j * cylinderSpacingZ - 1.5 * cylinderSpacingZ);
            if (cylinder.position.z >= minZ && cylinder.position.z <= maxZ) {
                cylinder.castShadow = true;
                scene.add(cylinder);
                arraycilindri[j][i] = cylinder; // Aggiungi il cilindro alla posizione (j, i) dell'array bidimensionale
            }
        }
    }


    // CANNON.js SETUP
    const world = new CANNON.World();
    world.gravity.set(-10, -9.81, 10);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    const fixedBody = new CANNON.Body({
        mass: 0, // Imposta a 0 per creare un corpo fisso
        position: new CANNON.Vec3(0, 2, 0),
    });
    world.addBody(fixedBody);

    const cylinderBodies = [];
    const cylinderShape = new CANNON.Cylinder(0.01, 0.1, 10, 15);
    const mass = 1;

    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 14; i++) {
            const cylinderBody = new CANNON.Body({
                mass: mass,
                position: new CANNON.Vec3(i * cylinderSpacingX - 6.5 * cylinderSpacingX, 5, j * cylinderSpacingZ - 1.5 * cylinderSpacingZ),
            });
            cylinderBody.addShape(cylinderShape);
            world.addBody(cylinderBody);
            cylinderBodies.push(cylinderBody);

            // Aggiungi il vincolo tra il cilindro e il corpo fisso
            const constraint = new CANNON.PointToPointConstraint(cylinderBody, new CANNON.Vec3(0, 0, 0), fixedBody, new CANNON.Vec3(i * cylinderSpacingX - 6.5 * cylinderSpacingX, 0, j * cylinderSpacingZ - 1.5 * cylinderSpacingZ));
            world.addConstraint(constraint);
        }
    }

     // NOISE SETUP
 
     const clock = new THREE.Clock();
 
     function applyRandomMovement() {
        const range = 0.2; // Intervallo entro cui muovere i cilindri
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < 14; i++) {
                const cylinder = arraycilindri[j][i];
                if (cylinder) {
                    // Genera posizioni casuali all'interno dell'intervallo specificato
                    const randomX = (Math.random() - 0.5) * range;
                    const randomY = (Math.random() - 0.5) * range;
                    const randomZ = (Math.random() - 0.5) * range;
                    
                    // Applica la posizione casuale al cilindro
                    cylinder.position.x += randomX;
                    cylinder.position.y += randomY;
                    cylinder.position.z += randomZ;
                }
            }
        }
    }
 

    // ANIMATION
    function animate() {
        requestAnimationFrame(animate);

        applyRandomMovement();

        renderer.render(scene, camera);
    }

    animate();
}

export function dispose() {
    cancelAnimationFrame(animation);
    window.removeEventListener('resize', onWindowResize);
}
