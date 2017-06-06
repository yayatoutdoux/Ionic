import { Component, ViewChild } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ActionSheet, ActionSheetController, Config, AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { SessionDetailPage } from '../session-detail/session-detail';
import { GardenDetailPage } from '../garden-detail/garden-detail';


@Component({
  selector: 'page-garden',
  templateUrl: 'garden.html'
})
export class GardenPage {
    actionSheet: ActionSheet;
    gardens: any[] = [];

    constructor(
        public actionSheetCtrl: ActionSheetController,
        public navCtrl: NavController,
        public confData: ConferenceData,
        public config: Config,
        public inAppBrowser: InAppBrowser,
        public alertCtrl: AlertController

    ) { }

    ionViewDidLoad() {
        this.confData.getGardens().subscribe((gardens: any[]) => {
            this.gardens = gardens;
        });
    }

    goToSessionDetail(session: any) {
        this.navCtrl.push(SessionDetailPage, {
            name: session.name,
            session: session
        });
    }

    goToGardenDetail(gardenName: any) {
        this.navCtrl.push(GardenDetailPage, {
            garden: gardenName,
            name: gardenName.name
        });
    }

    showConfirm(agreeCallback: any, disagreeCallback: any, title: any, message:any) {
        let confirm = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Disagree',
                    handler: disagreeCallback
                    
                },
                {
                    text: 'Agree',
                    handler: agreeCallback
                }
            ]
        });
        confirm.present();
    }

    openGardenAlert($event: any, gardenName: any) {
        let actionSheet = this.actionSheetCtrl.create({
            title: gardenName.name,
            buttons: [
                {
                    text: 'Edit garden',
                    handler: () => {
                        
                    }
                },
                {
                    text: 'General information'
                },
                {
                    text: 'Clone'
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this.showConfirm(() => {
                                this.confData.deleteGardenById(gardenName.id);

                                for (var i = 0; i < this.gardens.length; i++) {
                                    if (this.gardens[i].id == gardenName.id) {
                                        this.gardens.splice(i, 1);
                                        break;
                                    }
                                }
                            }, () => { },
                            "Delete '" + gardenName.name + "' ?",
                            "Are you sure you want to delete '" + gardenName.name + "' forever ?"
                        );
                    }
                },
                {
                    text: 'Close',
                    role: 'cancel'
                }
            ]
        });

        actionSheet.present();
        return false;
    }
}
