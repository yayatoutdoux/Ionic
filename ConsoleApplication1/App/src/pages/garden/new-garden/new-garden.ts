import { Component, ViewChild } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ConferenceData } from '../../../providers/conference-data';

import { GardenEditorPage } from '../garden-editor/garden-editor';

import {
    ActionSheet, ActionSheetController, Config, AlertController, App, FabContainer, ItemSliding,
    List, ModalController, NavController, ToastController, LoadingController, Refresher
} from 'ionic-angular';


@Component({
  selector: 'page-new-garden',
  templateUrl: 'new-garden.html'
})
export class NewGardenPage {
    name: string = "";
    description: string = "";
    height: number = 0; 
    width: number = 0;

    constructor(
        public actionSheetCtrl: ActionSheetController,
        public navCtrl: NavController,
        public confData: ConferenceData,
        public config: Config,
        public inAppBrowser: InAppBrowser,
        public alertCtrl: AlertController
    ) { }

    nextStep() {
        //Validation
        let garden = this.confData.createGarden({
            name: this.name,
            description: this.description,
            height: this.height,
            width: this.width
        });
        this.navCtrl.push(GardenEditorPage, {garden:garden, step:1});
    }
    
}
