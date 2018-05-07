import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LightMachinePage } from './light-machine';

@NgModule({
  declarations: [
    LightMachinePage,
  ],
  imports: [
    IonicPageModule.forChild(LightMachinePage),
  ],
})
export class LightMachinePageModule {}
