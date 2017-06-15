import { Component, ViewChild, Input } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import * as d3 from 'd3';
import { ActionSheet, ActionSheetController, Config, AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';
import { Slides } from 'ionic-angular';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';

import { SessionDetailPage } from '../session-detail/session-detail';
import { GardenDetailPage } from '../garden-detail/garden-detail';


@Component({
  selector: 'garden-presentation',
  templateUrl: 'garden-presentation.html'
})
export class GardenPresentation {
    @Input() garden : any;
    @Input() slides: Slides;

    constructor(
    ) {
        
    }

    openEditor() {
        this.slides.lockSwipes(false);
        
        this.slides.slideTo(1);
        this.slides.lockSwipes(true);
    }

    ngAfterContentInit()
    {
    }
}
