import {Platform, Page, ActionSheet, NavController,MenuController} from 'ionic-angular';
import {Geolocation} from "ionic-native/dist/index";
import {Http, Headers} from "angular2/http";
import {Observable} from 'rxjs/Rx';
import Bluetooth from "../../modules/Bluetooth";

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
  public bluetoothMsg:string = '';
  private bikeLayer:any;
  private map:any;

  constructor(private http: Http, public nav: NavController, menu: MenuController) {
    this.menu = menu;
/*
    const bluetooth = new Bluetooth();
    bluetooth.startScan().subscribe(
      data => {
        console.log(data);
        this.bluetoothMsg = JSON.stringify(data);
      },
      err => {
        this.bluetoothMsg = JSON.stringify(err);
        console.error(err);
      }
    );*/
  /*  const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    http.post('http://192.168.43.221:1880/location', JSON.stringify({lat: 51.126603100000004, lng: 16.9779427}), {headers}).subscribe(a=>{
      console.log(a);
    },
    e => {
      console.log(e);
    });*/

    this.initializePolling().subscribe(
      data => {
        data = data ? this.formatData(data) : null;
        console.log(data);
        if (data) {
          this.heatmapLayer.setData(!!data ? data : null);
          this.selectHeatMapGradient(this.heatmapLayer, this.dataType);
        }
      },
      err => {
        console.error(err)
      }
    );

    this.loadMap().then(map => {
      this.map = map;
      this.loadBicycleLayer(map);
      this.loadHeatmapLayer(map);
      this.setListeners(map);
      this.watchPositionSubscription = Geolocation.watchPosition().subscribe(position => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        http.post('http://192.168.43.221:1880/location', JSON.stringify({lat: position.coords.latitude, lng: position.coords.longitude}), {headers}).subscribe(a=>{
            console.log(a);
          },
          e => {
            console.log(e);
          });
        console.log('user position changed', position.coords.latitude, position.coords.longitude);
        map.setCenter(this.getLatLng(position));
      });
    });

  }

  onSegmentChanged(event) {
    console.log('changed', event.value);
    this.selectHeatMapGradient(this.heatmapLayer, event.value);    
  }

  private initializePolling():Observable<any> {
    return Observable
      .interval(5000)
      .flatMap(() => this.getMeasurments().retry(3));
  }

  private getMeasurments():Observable<any> {
    return this.http.get('http://nokianeteng.pl:9000/api/measurments')
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
  }

  private loadHeatmapLayer(map) {
    this.getPoints().then(points => {
      this.heatmapLayer = new google.maps.visualization.HeatmapLayer({
        data: points,
        map,
        gradient: PageMap.HUMIDITY_GRADIENT,
        options: {
          radius: 20
        }
      });
    });
  };

  private loadBicycleLayer(map) {
    this.bikeLayer = new google.maps.BicyclingLayer();
    this.bikeLayer.setMap(map);
  }

  private toggleBicycleLayer() {
    const bikeMap = this.bikeLayer.getMap();
    this.bikeLayer.setMap(bikeMap ? null : this.map);
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

  private formatData(data: any[]) {
    return data.map(point => {
      if (point.position && point.position.lat && point.position.lng) {
        console.log(point.position.lat, point.position.lng);
      }
      return point.position && point.position.lat && point.position.lng ?
      { location: new google.maps.LatLng(point.position.coords.latitude, point.position.coords.longitude), weight: data[this.dataType] || 1 } : null;
    }).filter(point=>point);
  }

  private getPoints() {
    return this.getCurrentPosition().then(position => {

      return [
        { location: new google.maps.LatLng(position.coords.latitude, position.coords.longitude), weight: 1},
        { location: new google.maps.LatLng(position.coords.latitude, position.coords.longitude), weight: 1},
        { location: new google.maps.LatLng(position.coords.latitude + 0.01, position.coords.longitude + 0.01), weight: 0.5},
        { location: new google.maps.LatLng(position.coords.latitude + 0.011, position.coords.longitude + 0.01), weight: 0.5},
        { location: new google.maps.LatLng(position.coords.latitude + 0.012, position.coords.longitude + 0.01), weight: 1},
        { location: new google.maps.LatLng(position.coords.latitude + 0.013, position.coords.longitude + 0.01), weight: 1},
        { location: new google.maps.LatLng(position.coords.latitude + 0.02, position.coords.longitude + 0.02), weight: 2},
        { location: new google.maps.LatLng(position.coords.latitude + 0.03, position.coords.longitude + 0.03), weight: 10},
        { location: new google.maps.LatLng(position.coords.latitude + 0.04, position.coords.longitude + 0.04), weight: 1},
      ];
    });
  }

  ngOnDestroy() {
    this.watchPositionSubscription.unsubscribe();
  }
  
  
  private selectHeatMapGradient(heatMap: any, dataType: string) {
    switch (dataType) {
      case "dust":
        heatMap.set('gradient', PageMap.DUST_GRADIENT);
        break;
      case "humidity":
        heatMap.set('gradient', PageMap.HUMIDITY_GRADIENT);
        break;
      case "temperature":
        heatMap.set('gradient', PageMap.TEMPERATURE_GRADIENT);
        break;
      case "bicycle":
        this.toggleBicycleLayer();
        break;
    }
  }
  
  private static get TEMPERATURE_GRADIENT() {
    return null;
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
  
  private static get DUST_GRADIENT() {
    return [
      'rgba(0, 0, 0, 1)',
      'rgba(0, 0, 0, 0.8)',
      'rgba(0, 0, 0, 0.6)',
      'rgba(0, 0, 0, 0.4)',
      'rgba(255, 255, 255, 0.4)',
      'rgba(255, 255, 255, 0.6)',
      'rgba(255, 255, 255, 0.8)',
      'rgba(255, 255, 255, 1)'
    ];
  }
}
  


