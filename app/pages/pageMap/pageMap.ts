import {Platform, Page, ActionSheet, NavController,MenuController} from 'ionic-angular';
import {Geolocation} from "ionic-native/dist/index";
import {Http} from "angular2/http";
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/mergemap';
import 'rxjs/add/observable/interval';

@Page({
  templateUrl: 'build/pages/pageMap/pageMap.html',
})
export class PageMap {
  private heatmapLayer:any;
  private watchPositionSubscription:any;
  private actionSheet:any;
  private dataType:string = 'dust';

  constructor(private http: Http, public nav: NavController, menu: MenuController) {
    this.menu = menu;

    this.initializePolling().subscribe(
      data => {
        data = data.data ? this.formatDataCoords(data.data) : null;
        console.log(data);
        this.heatmapLayer.setData(data ? data : null);
        this.heatmapLayer.set('gradient', this.heatmapLayer.get('gradient') ? null :  PageMap.HUMIDITY_GRADIENT);
      },
      err => console.error(err)
    );

    this.loadMap().then(map => {
      this.loadBicycleLayer(map);
      this.loadHeatmapLayer(map);
      this.setListeners(map);
      this.watchPositionSubscription = Geolocation.watchPosition().subscribe(position => {
        console.log('user position changed', position.coords.latitude, position.coords.longitude);
        map.setCenter(this.getLatLng(position));
      });
    });

  }

  onSegmentChanged(event) {
    console.log('changed', event.value);
  }

  private initializePolling():Observable<any> {
    return Observable
      .interval(5000)
      .flatMap(() => this.getMeasurments().retry(3));
  }

  private getMeasurments():Observable<any> {
    return this.http.get('http://nokianeteng.pl:3000/api/v1/measurments')
      .map(res => res.json());
  }

  openSecondMenu() {
    this.actionSheet = ActionSheet.create({
      //title: 'Actions',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('Delete clicked');
          }
        },
        {
          text: 'Share',
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Play',
          handler: () => {
            console.log('Play clicked');
          }
        },
        {
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    this.nav.present(this.actionSheet);
  }

  private setListeners(map) {
    map.addListener('zoom_changed', () => {
      if (!this.heatmapLayer) {
        return;
      }

      this.heatmapLayer.set('radius', map.getZoom());
    });

    map.addListener('bounds_changed', () => {
      console.log('bounds_changed', map.getBounds());
    });
  }

  private loadHeatmapLayer(map) {
    this.getPoints().then(points => {
      this.heatmapLayer = new google.maps.visualization.HeatmapLayer({
        data: points,
        map,
        options: {
          radius: 20
        }
      });
    });
  };

  private loadBicycleLayer(map) {
    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);
  }

  private getCurrentPosition():Promise<any> {
    return Geolocation.getCurrentPosition({timeout: 1000, enableHighAccuracy: true}).then(position=>position, ()=> {
      return {
        timestamp: new Date().getTime(),
        coords: {
          latitude: 51.126603100000004,
          longitude: 16.9779427,
          altitude: 0,
          accuracy: 63,
          altitudeAccuracy: 0,
          heading: NaN,
          speed: NaN
        }
      };
    });
  }

  private loadMap():Promise<any> {
    return new Promise((resolve => {
      this.getCurrentPosition().then(position => {
        const mapOptions = {
          center: this.getLatLng(position),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.HYBRID,
          disableDefaultUI: true
        };

        return resolve(new google.maps.Map(document.getElementById('map'), mapOptions));
      });
    }));
  }

  private getLatLng(position):any {
    return new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  }

  private formatDataCoords(data: any[]) {
    return data.map(point => {
      if (point.position && point.position.lat && point.position.lng) {
        console.log(point.position.lat, point.position.lng);
      }
      return point.position && point.position.lat && point.position.lng ? new google.maps.LatLng(point.position.lat, point.position.lng) : null;
    }).filter(point=>point);
  }

  private getPoints() {
    return this.getCurrentPosition().then(position => {

      return [
        new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        new google.maps.LatLng(position.coords.latitude + 0.01, position.coords.longitude + 0.01),
        new google.maps.LatLng(position.coords.latitude + 0.011, position.coords.longitude + 0.01),
        new google.maps.LatLng(position.coords.latitude + 0.012, position.coords.longitude + 0.01),
        new google.maps.LatLng(position.coords.latitude + 0.013, position.coords.longitude + 0.01),
        new google.maps.LatLng(position.coords.latitude + 0.02, position.coords.longitude + 0.02),
        new google.maps.LatLng(position.coords.latitude + 0.03, position.coords.longitude + 0.03),
        new google.maps.LatLng(position.coords.latitude + 0.04, position.coords.longitude + 0.04),
      ];
    });
  }

  ngOnDestroy() {
    this.watchPositionSubscription.unsubscribe();
  }

  private static get HUMIDITY_GRADIENT() {
    return [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ];
  }
}
  


