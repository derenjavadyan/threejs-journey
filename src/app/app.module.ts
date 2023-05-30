import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThreeJsComponent } from './three-js/three-js.component';
import { HauntedHouseComponent } from './haunted-house/haunted-house.component';

@NgModule({
  declarations: [AppComponent, ThreeJsComponent, HauntedHouseComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
