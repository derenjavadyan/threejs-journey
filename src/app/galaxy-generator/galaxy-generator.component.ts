import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';

@Component({
  selector: 'app-galaxy-generator',
  templateUrl: './galaxy-generator.component.html',
  styleUrls: ['./galaxy-generator.component.scss'],
})
export class GalaxyGeneratorComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  private geometry!: THREE.BufferGeometry;
  private material!: THREE.PointsMaterial;
  private points!: THREE.Points;

  ngAfterViewInit(): void {
    /**
     * Base
     */
    // Debug
    const gui = new dat.GUI();

    // Scene
    const scene = new THREE.Scene();

    /**
     * Galaxy
     */

    const parameters = {
      count: 100000,
      size: 0.01,
    };

    /**
     * Geometry
     */

    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);

    const generateGalaxy = () => {
      // if (this.points !== null) {
      //   this.geometry.dispose();
      //   this.material.dispose();
      //   scene.remove(this.points);
      // }

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 3;
        positions[i3 + 1] = (Math.random() - 0.5) * 3;
        positions[i3 + 2] = (Math.random() - 0.5) * 3;
      }
      this.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
    };

    generateGalaxy();

    gui
      .add(parameters, 'count')
      .min(100)
      .max(1000000)
      .step(100)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, 'size')
      .min(0.01)
      .max(0.1)
      .step(0.001)
      .onFinishChange(generateGalaxy);

    /**
     * Material
     */

    this.material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    /**
     * Points
     */
    this.points = new THREE.Points(this.geometry, this.material);
    scene.add(this.points);

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
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    camera.position.z = 3;
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
    renderer.setSize(this.sizes.width, this.sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Animate
     */
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

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
