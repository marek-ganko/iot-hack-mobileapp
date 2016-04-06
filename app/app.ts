import 'es6-shim';
import {App, Platform, MenuController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HTTP_PROVIDERS} from "angular2/http";
import {PageMap} from './pages/pageMap/pageMap';
import {PageList} from './pages/pageList/pageList';
import {PageCharts} from './pages/pageCharts/pageCharts';

@App({
  template: `
    <ion-menu [content]="content">
      <ion-toolbar>
        <ion-title>Menu</ion-title>
      </ion-toolbar>

      <ion-content>
        <ion-list>
          <button (click)="openPage(pageMap)" ion-item>Map</button>
          <button (click)="openPage(pageList)" ion-item>Points</button>
          <button (click)="openPage(pageCharts)" ion-item>Charts</button>
        </ion-list>
      </ion-content>
    </ion-menu>

    <ion-nav id="nav" #content [root]="rootPage"></ion-nav>`,
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/,
  providers:[HTTP_PROVIDERS]
})
export class MyApp {
  rootPage: any = PageMap;
  menu:any;

  constructor(platform: Platform, menu: MenuController) {
    this.menu = menu;
    this.pageMap = PageMap;
    this.pageList = PageList;
    this.pageCharts = PageCharts;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    this.rootPage = page;
    this.menu.close();
  }
}
