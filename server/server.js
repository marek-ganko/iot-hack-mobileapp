Measurments = new Meteor.Collection("measurments");

if(Meteor.isServer) {
  Meteor.startup(function () {

    Api = new Restivus({
      version: 'v1',
      prettyJson: true
    });

    Api.addCollection(Measurments, 'measurments');
  
  });
}
