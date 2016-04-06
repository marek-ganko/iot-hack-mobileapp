import {Page} from 'ionic-angular';
import {Http} from "angular2/http";
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/mergemap';
import 'rxjs/add/observable/interval';


import * as _ from 'lodash';


@Page({
  templateUrl: 'build/pages/pageCharts/pageCharts.html',
})
export class PageCharts {
  private chartModelType:string = 'dust';

  constructor(private http:Http) {
    this.setChartDust();
    //this.onChartModelChanged({value:'dust'});
  }

  private getData():Observable<any> {
    return this.http.get('http://nokianeteng.pl:9000/api/measurments/charts')
      .map(res => res.json());
  }


  refreshData() {

  }

  onChartModelChanged(event) {
    this.getData().subscribe(
      data => {
        let timestamps = _.map(_.map(data, 'timestamp'), (time) => {
          return new Date(time).toISOString()
        });
        let temperature = _.map(data, 'temperature');
        let humidity = _.map(data, 'humidity');
        let pm2_5 = _.map(data, 'pm2_5');

        switch (event.value) {
          case 'dust':
            let columns = [
              ['x', ...timestamps],
              ['pm2_5', ...pm2_5],
            ];

            this.setChart(columns);
            break;
          case 'temperature':
            let columns = [
              ['x', ...timestamps],
              ['temperature', ...temperature],
            ];

            this.setChart(columns);
            break;
          case 'humidity':
            let columns = [
              ['x', ...timestamps],
              ['humidity', ...humidity],
            ];

            this.setChart(columns);
            break;
        }

      },
      err => {
        console.error(err)
      }
    );


  }

  setChart(columns) {
    setTimeout(() => {
      var chart = c3.generate({
        bindto: '#chart',
        data: {
          x: 'x',
          xFormat: '%Y-%m-%dT%H:%M:%S.%LZ', //data wpada jako: new Date(1459922712082).toISOString()
          columns: columns,
          type: 'bar'
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%Y-%m-%d'
            }
          }
        }
      });
    }, 0);
  }

  //
  //setChartTemperature() {
  //  setTimeout(() => {
  //    var chart = c3.generate({
  //      bindto: '#chart',
  //      data: {
  //        x: 'x',
  //        // xFormat: '%Y-%m-%dT%H:%M:%S.%LZ', data wpada jako: new Date(1459922712082).toISOString()
  //        columns: [
  //          ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
  //          ['temperature', 20, 21, 22, 23, 21, 17],
  //        ],
  //        type: 'bar'
  //      },
  //      axis: {
  //        x: {
  //          type: 'timeseries',
  //          tick: {
  //            format: '%Y-%m-%d'
  //          }
  //        }
  //      }
  //    });
  //  }, 0);
  //}


  setChartDust() {
    setTimeout(() => {
      var chart = c3.generate({
        bindto: '#chart',
        data: {
          x: 'x',
          // xFormat: '%Y-%m-%dT%H:%M:%S.%LZ', data wpada jako: new Date(1459922712082).toISOString()
          columns: [
            ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
            ['dust', 20, 21, 22, 23, 21, 17],
          ],
          type: 'bar'
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%Y-%m-%d'
            }
          }
        }
      });
    }, 0);
  }
}

