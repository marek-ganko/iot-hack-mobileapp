Measurments = new Meteor.Collection("measurments");
var Geohash = Meteor.npmRequire('latlon-geohash');

if(Meteor.isServer) {
  Meteor.startup(function () {

    Api = new Restivus({
      version: 'v1',
      prettyJson: true
    });

    Api.addRoute('measurments', {

      get: {
        action: function () {
          var measurments = Measurments.find({}).fetch();
          if (measurments) {
            return {status: "success", data: measurments};
          }
          return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to add article"}
          };
        }
      },

      post: {
        action: function () {
          var body = this.request.body;
          var position = body.position;
          body.geohash = Geohash.encode(position.lat, position.lon);
          var article = Measurments.insert(body);

          if (article) {
            return {status: "success", data: article};
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