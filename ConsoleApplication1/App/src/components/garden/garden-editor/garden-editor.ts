import { Component, ViewChild, Input } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import * as d3 from 'd3';
import * as textures from 'textures';

import { Slides, ActionSheetController, Config, AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

import { GardenEditorService } from '../../../services/garden-editor';

@Component({
  selector: 'garden-editor',
  templateUrl: 'garden-editor.html'
})

export class GardenEditor {
    @Input() garden: any;

    constructor(public gardenEditorService: GardenEditorService
    ) {
    }

    ngAfterContentInit() {
        this.gardenEditorService.initSvg(this.garden);
    }
}
