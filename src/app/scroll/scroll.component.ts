import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as dat from 'lil-gui';

@Component({
  selector: 'app-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.scss'],
})
export class ScrollComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  ngAfterViewInit(): void {
    /**
     * Base
     */
    // Debug
    const gui = new dat.GUI();
    const parameters = {
      materialColor: '#ffeded',
    };
    gui.addColor(parameters, 'materialColor').onChange(() => {
      material.color.set(parameters.materialColor);
    });

    // Scene
    const scene = new THREE.Scene();

    /**
     * Objects
     */
    //Material
    const material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
    });

    //Meshes
    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      material
    );
    const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 3, 32), material);
    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material
    );
    scene.add(mesh1, mesh2, mesh3);

    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);

    /**
     * Sizes
     */

    window.addEventListener('resize', () => {
      // Update sizes
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = this.sizes.width / this.sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(this.sizes.width, this.sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    camera.position.z = 6;
    scene.add(camera);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement,
      alpha: true,
    });
    renderer.setSize(this.sizes.width, this.sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }
}
