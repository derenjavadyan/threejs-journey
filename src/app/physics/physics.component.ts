import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import CANNON, { Vec3 } from 'cannon';

@Component({
  selector: 'app-physics',
  templateUrl: './physics.component.html',
  styleUrls: ['./physics.component.scss'],
})
export class PhysicsComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  ngAfterViewInit(): void {
    /**
     * Debug
     */
    const gui = new dat.GUI();

    /**
     * Base
     */

    // Scene
    const scene = new THREE.Scene();

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const environmentMapTexture = cubeTextureLoader.load([
      '../../assets/physics/0/px.png',
      '../../assets/physics/0/nx.png',
      '../../assets/physics/0/py.png',
      '../../assets/physics/0/ny.png',
      '../../assets/physics/0/pz.png',
      '../../assets/physics/0/nz.png',
    ]);

    /**
     * Physics
     */
    //World
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    //Matrial
    const defaultMaterial = new CANNON.Material('default');

    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      }
    );
    world.addContactMaterial(defaultContactMaterial);
    world.defaultContactMaterial = defaultContactMaterial;

    //Floor
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({
      mass: 0,
    });
    floorBody.addShape(floorShape);
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    world.addBody(floorBody);

    /**
     * Floor
     */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
      })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;
    scene.add(floor);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.set(-3, 3, 3);
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, this.canvas.nativeElement);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement,
    });

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sizes.width, sizes.height);

    /**
     * Utils
     */
    const createSphere = (radius: number, position: any) => {
      //Three.js mesh
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 20, 20),
        new THREE.MeshStandardMaterial({
          metalness: 0.3,
          roughness: 0.4,
          envMap: environmentMapTexture,
        })
      );
      mesh.castShadow = true;
      mesh.position.copy(position);
      scene.add(mesh);

      //Cannon.js body
      const shape = new CANNON.Sphere(radius);
      const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        //shape: shape is the same as just shape
        shape,
        material: defaultMaterial,
      });
      body.position.copy(position);
      world.addBody(body);
    };

    createSphere(0.5, { x: 0, y: 3, z: 0 });

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let oldElapsedTime = 0;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - oldElapsedTime;
      oldElapsedTime = elapsedTime;

      //Update physics world

      world.step(1 / 60, deltaTime, 3);

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }
}
