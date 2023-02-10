import { Component, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-three-js',
  templateUrl: './three-js.component.html',
  styleUrls: ['./three-js.component.scss'],
})
export class ThreeJsComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    //Scene
    const scene = new THREE.Scene();

    //Red cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    //Cursor
    const cursor = {
      x: 0,
      y: 0,
    };
    window.addEventListener('mousemove', (e) => {
      cursor.x = e.clientX / sizes.width - 0.5;
      cursor.y = -(e.clientY / sizes.height - 0.5);
    });

    //Sizes
    const sizes = {
      width: 800,
      height: 600,
    };

    //Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.z = 2;
    camera.lookAt(mesh.position);
    scene.add(camera);

    //Renderer
    const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(sizes.width, sizes.height);

    //Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    //Clock
    const clock = new THREE.Clock();

    //Animations
    const tick = () => {
      //Clock
      const elapsedTime = clock.getElapsedTime();

      //Update objects
      // mesh.rotation.y = elapsedTime;

      //Update controls
      controls.update();

      //Renderer
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();
  }
}
