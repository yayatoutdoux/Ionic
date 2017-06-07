import { Component, ViewChild } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ActionSheet, ActionSheetController, Config, AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';


@Component({
  selector: 'page-new-garden',
  templateUrl: 'new-garden.html'
})
export class NewGardenPage {
    actionSheet: ActionSheet;
    gardens: any[] = [];

    constructor(

    ) { }

    
}
