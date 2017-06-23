import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { ConferenceApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { GardenListPage } from '../pages/garden/garden-list/garden-list';
import { GardenEditorPage } from '../pages/garden/garden-editor/garden-editor';
import { NewGardenPage } from '../pages/garden/new-garden/new-garden';
import { SessionDetailPage } from '../pages/session-detail/session-detail';
import { SignupPage } from '../pages/signup/signup';
import { GardenDetailPage } from '../pages/garden/garden-detail/garden-detail';
import { TabsPage } from '../pages/tabs/tabs';
import { SupportPage } from '../pages/support/support';

import { GardenEditor } from '../components/garden/garden-editor/garden-editor';
import { GardenPresentation } from '../components/garden/garden-presentation/garden-presentation';

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';


@NgModule({
  declarations: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    PopoverPage,
    GardenListPage,
    SignupPage,
    GardenDetailPage,
    TabsPage,
    SupportPage,
    NewGardenPage,
    SessionDetailPage,
    GardenEditor,
    GardenPresentation,
    GardenEditorPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(ConferenceApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs' },
        { component: GardenListPage, name: 'GardenList', segment: 'garden' },
        { component: SessionDetailPage, name: 'SessionDetail', segment: 'sessionDetail/:name' },
        { component: GardenDetailPage, name: 'GardenDetail', segment: 'gardenDetail/:id' },
        { component: GardenEditorPage, name: 'GardenEditor', segment: 'gardenEditor/:id' },
        { component: NewGardenPage, name: 'NewGarden', segment: 'new-garden' },
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: SupportPage, name: 'SupportPage', segment: 'support' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' }
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    PopoverPage,
    GardenListPage,
    SessionDetailPage,
    SignupPage,
    GardenDetailPage,
    GardenEditorPage,
    TabsPage,
    SupportPage,
    NewGardenPage,
    GardenEditor,
    GardenPresentation
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConferenceData,
    UserData,
    InAppBrowser,
    SplashScreen
  ]
})
export class AppModule { }
