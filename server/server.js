Measurments = new Meteor.Collection("measurments");
var Geohash = Meteor.npmRequire('latlon-geohash');

var pipeline = [{
  '$group': {
    '_id': {
      '$substr': ["$geohash", 0, 5]
    },
    "timestamp": {
      "$max": "$timestamp"
    },
    "temperature": {
      "$avg": "$temperature"
    },
    "humidity": {
      "$avg": "$humidity"
    },
    "pm1": {
      "$avg": "$pm1"
    },
    "pm2_5": {
      "$avg": "$pm2_5"
    },
    "pm10": {
      "$avg": "$pm10"
    }
  }
}];

if (Meteor.isServer) {
  Meteor.startup(function () {

    Api = new Restivus({
      version: 'v1',
      prettyJson: true
    });

    Api.addRoute('measurments', {

      get: {
        action: function () {
          var result = Measurments.aggregate(pipeline);

          if (result) {
            return {status: "success", data: result};
          }
          return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to add article"}
          };
        }
      },

      post: {
        action: function () {
          var body = _.extend({}, this.request.body);
          var position = body.position;
          body.geohash = Geohash.encode(position.lat, position.lon);

          var _id = Measurments.insert(body);
          var data = _.extend({_id: _id}, body);
          if (_id) {
            return {status: "success", data: data};
          }

          return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to add article"}
          };
        }
      }
    });
  });
}
