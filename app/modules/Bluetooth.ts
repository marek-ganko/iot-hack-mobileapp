import {BLE} from "ionic-native/dist/index";
import {Observable} from "rxjs/Observable";

export default class Bluetooth {
  constructor() {

  }

  public startScan():Observable<any> {
    return BLE.startScan([]).map(res => res.json());
  }
}