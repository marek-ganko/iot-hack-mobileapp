import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {

  Meteor.startup(() => {
    if (Measurements.find().count() === 0) {
      var measurements = [
        {
          timestamp: new Date(),
          temperature: 24.3,
          humidity: 50,
          position: {
            latitute: 10,
            longitude: 21
          }
        }, {
          timestamp: new Date(),
          temperature: 26.1,
          humidity: 55,
          position: {
            latitute: 10,
            longitude: 21
          }
        }, {
          timestamp: new Date(),
          temperature: 27.1,
          humidity: 50,
          position: {
            latitute: 10,
            longitude: 21
          }
        }
      ];

      measurements.forEach((measurement) => {
        Measurements.insert(measurement);
      });
    }

  });
}
