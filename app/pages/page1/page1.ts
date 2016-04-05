import {Page} from 'ionic-angular';
import {ElementRef} from 'angular2/core';
import {Geolocation} from "ionic-native/dist/index";
import {Observable} from "rxjs/Observable";

@Page({
  templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 {
  private elementRef:ElementRef;
  private watchPositionSubscription:any;

  constructor(elementRef:ElementRef) {
    this.elementRef = elementRef;

    this.loadMap().then(map => {
      this.loadBicycleLayer(map);
      this.loadHeatmapLayer(map);

      this.watchPositionSubscription = Geolocation.watchPosition().subscribe(position => {
        map.setCenter(this.getLatLng(position));
      });

    });
  }

  NgOnDestroy() {
    this.watchPositionSubscription.unsubscribe();
  }

  private loadHeatmapLayer(map) {
    this.getPoints().then(points => {
      console.log('a')
      new google.maps.visualization.HeatmapLayer({
        data: points,
        map: map,
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
    return Geolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true}).then(position=>position, ()=> {
      console.error('getCurrentPosition error');
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

  private getLatLng(position):any {
    return new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  }

  private loadMap():Promise<any> {
    return new Promise((resolve => {
      this.getCurrentPosition().then(position => {
        console.log(position)
        const mapOptions = {
          center: this.getLatLng(position),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.HYBRID
        };

        return resolve(new google.maps.Map(document.getElementById('map'), mapOptions));
      });
    }));

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

}
