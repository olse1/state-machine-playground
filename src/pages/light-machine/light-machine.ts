import { LightMachineProvider } from './../../providers/light-machine/light-machine';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { State } from 'xstate';

/**
 * Generated class for the LightMachinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-light-machine',
  templateUrl: 'light-machine.html',
})
export class LightMachinePage {
  state: State;
  data: any = {};
  events: string[] = [];
  processedData: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private lightMachineProvider: LightMachineProvider) {
    this.state = this.lightMachineProvider.currentState;
    this.data = this.lightMachineProvider.getData();
    this.events = this.lightMachineProvider.listEvents(this.state);
  }

  ionViewDidLoad() {
    
  }

  transition(stateName: string) {
    this.processedData = this.lightMachineProvider.transition({ type: stateName, data: 'data' });
    this.state = this.lightMachineProvider.currentState;
    this.data = this.lightMachineProvider.getData();
    this.events = this.lightMachineProvider.listEvents(this.state);
  }
}
