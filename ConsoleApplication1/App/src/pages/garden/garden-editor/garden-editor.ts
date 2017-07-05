import { Component, ViewChild } from '@angular/core';

import { Slides, NavController, NavParams } from 'ionic-angular';

import { SessionDetailPage } from '../../session-detail/session-detail';
import { GardenListPage } from '../../garden/garden-list/garden-list';
import { GardenEditor } from '../../../components/garden/garden-editor/garden-editor';

@Component({
    selector: 'page-garden-editor',
    templateUrl: 'garden-editor.html'
})

export class GardenEditorPage {
    garden: any;
    step = 0;
    @ViewChild(Slides) slides: Slides;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.garden = this.navParams.data.garden;
        this.step = this.navParams.data.step;
    }

    goToSessionDetail(session: any) {
        this.navCtrl.push(SessionDetailPage, { 
            name: session.name,
            session: session
        });
    }

    goToGardenList() {
        this.navCtrl.popToRoot();
    }


    ngAfterContentInit() {
        this.slides.lockSwipes(true);
    }
}
