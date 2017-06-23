import { Component, ViewChild, Input } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import * as d3 from 'd3';
import { ActionSheet, ActionSheetController, Config, AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';

import { SessionDetailPage } from '../session-detail/session-detail';
import { GardenEditorPage } from '../../../pages/garden/garden-editor/garden-editor';

@Component({
  selector: 'garden-presentation',
  templateUrl: 'garden-presentation.html'
})
export class GardenPresentation {
    @Input() garden : any;

    constructor(
        public navCtrl: NavController
    ) {
        
    }

    openEditor() {
        this.navCtrl.push(GardenEditorPage, {
            garden: this.garden
        });
    }

    ngAfterContentInit()
    {
    }
}
