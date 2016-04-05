import {Page} from 'ionic-angular';
import {Geolocation} from "ionic-native/dist/index";



@Page({
  templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 {

  private map: any;
  private heatmap: any;

  constructor() {
    this.loadMap().then(map => {
      this.map = map;
      this.getPoints().then(points => {
        this.heatmap = new google.maps.visualization.HeatmapLayer({
          data: points,
          map: map,
          options: {
            radius: 20
          }
        });
      });
    });
  }

  private getCurrentPosition():Promise<any> {
    return Geolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true});
  }

  private loadMap():Promise<any> {
    return new Promise((resolve => {
      this.getCurrentPosition().then(position => {
        const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        const mapOptions = {
          center: latLng,
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
        new google.maps.LatLng(position.coords.latitude+0.01, position.coords.longitude+0.01),
        new google.maps.LatLng(position.coords.latitude+0.02, position.coords.longitude+0.02),
        new google.maps.LatLng(position.coords.latitude+0.03, position.coords.longitude+0.03),
        new google.maps.LatLng(position.coords.latitude+0.04, position.coords.longitude+0.04),
      ];
    });
  }

}
