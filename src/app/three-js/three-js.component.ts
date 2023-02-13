import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-three-js',
  templateUrl: './three-js.component.html',
  styleUrls: ['./three-js.component.scss'],
})
export class ThreeJsComponent implements AfterViewInit {
  //Query selector
  @ViewChild('canv') canvas!: ElementRef<HTMLCanvasElement>;

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
      width: window.innerWidth,
      height: window.innerHeight,
    };
    window.addEventListener('resize', () => {
      //Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      //Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      //Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    window.addEventListener('dblclick', () => {
      if (!document.fullscreenElement) {
        this.canvas.nativeElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });

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
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    //Controls
    const controls = new OrbitControls(camera, this.canvas.nativeElement);
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
