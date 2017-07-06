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
    soilTypes:string[] = ["green", "black", "blue"];
    selectedSoilType:string = "green";

    constructor(public gardenEditorService: GardenEditorService
    ) {
    }

    ngAfterContentInit() {
        //TODO problem with animation
        setTimeout(() => {
            this.gardenEditorService.initSvg(this.garden);
        }, 100);
    }

    private reset() {
        this.gardenEditorService.reset();
    }

    private save() {
        this.gardenEditorService.save(this.garden);
    }

    private addRect() {
        this.gardenEditorService.addRect();
    }

    private onSelectSoilType(soilType: any) {
        this.gardenEditorService.setSoilType(soilType);
    }
}
