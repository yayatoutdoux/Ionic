import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { SessionDetailPage } from '../session-detail/session-detail';

@Component({
    selector: 'page-garden-detail',
    templateUrl: 'garden-detail.html'
})
export class GardenDetailPage {
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
