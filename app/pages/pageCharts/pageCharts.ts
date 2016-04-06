import {Page} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/pageCharts/pageCharts.html',
})
export class PageCharts {
  private chartModelType:string = 'temperature';

  constructor() {
    this.setChartDust();
  }

  onChartModelChanged(event) {
    console.log(event.value);
  }


  setChartDust(){
    setTimeout(() => {
      var chart = c3.generate({
        bindto: '#chart',
        data: {
          x: 'x',
          // xFormat: '%Y-%m-%dT%H:%M:%S.%LZ', data wpada jako: new Date(1459922712082).toISOString()
          columns: [
            ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
            ['temperature', 20, 21, 22, 23, 21, 17],
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