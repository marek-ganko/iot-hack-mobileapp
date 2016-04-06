import {Page} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/pageList/pageList.html',
})
export class PageList {
  public points:any;

  constructor() {
    this.points = [{
      name: 'Point 1',
      address: 'Address: Lotnicza 12'
    }, {
      name: 'Point 2',
      address: 'Address: Ostatni Grosz 23'
    }, {
      name: 'Point 3',
      address: 'Address: Grunwaldzka 5'
    }];
  }
}
  


