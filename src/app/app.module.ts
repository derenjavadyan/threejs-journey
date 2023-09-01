import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThreeJsComponent } from './three-js/three-js.component';
import { HauntedHouseComponent } from './haunted-house/haunted-house.component';
import { ParticlesComponent } from './particles/particles.component';
import { GalaxyGeneratorComponent } from './galaxy-generator/galaxy-generator.component';
import { ScrollComponent } from './scroll/scroll.component';
import { PhysicsComponent } from './physics/physics.component';
import { ImportedModelsComponent } from './imported-models/imported-models.component';
import { BlenderComponent } from './blender/blender.component';

@NgModule({
  declarations: [AppComponent, ThreeJsComponent, HauntedHouseComponent, ParticlesComponent, GalaxyGeneratorComponent, ScrollComponent, PhysicsComponent, ImportedModelsComponent, BlenderComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
