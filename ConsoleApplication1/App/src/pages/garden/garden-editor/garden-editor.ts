import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { SessionDetailPage } from '../../session-detail/session-detail';
import { GardenEditor } from '../../../components/garden/garden-editor/garden-editor';

@Component({
    selector: 'page-garden-editor',
    templateUrl: 'garden-editor.html'
})

export class GardenEditorPage {
    garden: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.garden = this.navParams.data.garden;
  }

  goToSessionDetail(session: any) {
    this.navCtrl.push(SessionDetailPage, { 
      name: session.name,
      session: session
    });
  }

}
