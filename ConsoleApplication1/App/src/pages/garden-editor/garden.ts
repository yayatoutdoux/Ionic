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
        public inAppBrowser: InAppBrowser
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

    /*goToSpeakerTwitter(speaker: any) {
        this.inAppBrowser.create(`https://twitter.com/${speaker.twitter}`, '_blank');
    }

    openSpeakerShare(speaker: any) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Share ' + speaker.name,
            buttons: [
                {
                    text: 'Copy Link',
                    handler: () => {
                        console.log('Copy link clicked on https://twitter.com/' + speaker.twitter);
                        if ((window as any)['cordova'] && (window as any)['cordova'].plugins.clipboard) {
                            (window as any)['cordova'].plugins.clipboard.copy('https://twitter.com/' + speaker.twitter);
                        }
                    }
                },
                {
                    text: 'Share via ...'
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });

        actionSheet.present();
    }

    openContact(speaker: any) {
        let mode = this.config.get('mode');

        let actionSheet = this.actionSheetCtrl.create({
            title: 'Contact ' + speaker.name,
            buttons: [
                {
                    text: `Email ( ${speaker.email} )`,
                    icon: mode !== 'ios' ? 'mail' : null,
                    handler: () => {
                        window.open('mailto:' + speaker.email);
                    }
                },
                {
                    text: `Call ( ${speaker.phone} )`,
                    icon: mode !== 'ios' ? 'call' : null,
                    handler: () => {
                        window.open('tel:' + speaker.phone);
                    }
                }
            ]
        });

        actionSheet.present();
    }*/
}
