import {Page} from 'ionic-angular';
import {Geolocation} from "ionic-native/dist/index";

@Page({
  templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 {
  private heatmapLayer:any;
  private watchPositionSubscription:any;

  constructor() {
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

  private loadMap():Promise<any> {
    return new Promise((resolve => {
      this.getCurrentPosition().then(position => {
        const mapOptions = {
          center: this.getLatLng(position),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.HYBRID
        };

        return resolve(new google.maps.Map(document.getElementById('map'), mapOptions));
      });
    }));
  }

  private getLatLng(position):any {
    return new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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
}
  


