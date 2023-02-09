import { Component, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import gsap from 'gsap';

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

    //Sizes
    const sizes = {
      width: 800,
      height: 600,
    };

    //Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    scene.add(camera);

    //Renderer
    const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(sizes.width, sizes.height);

    //Clock
    const clock = new THREE.Clock();
    gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
    gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

    //Animations
    const tick = () => {
      //Clock
      const elapsedTime = clock.getElapsedTime();

      //Update objects
      // mesh.position.y = Math.sin(elapsedTime);
      // mesh.position.x = Math.cos(elapsedTime);

      //Renderer
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();
  }
}
