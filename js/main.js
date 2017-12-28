const moment = require('moment');
require('scss/main.scss');

const baseurl = 'https://maps.googleapis.com/maps/api/geocode/json?';
const geocodeurl = 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=';
const apikey = 'AIzaSyAuEdJ504Geu7RLxBhkjWjlKQ0fQFD9Lrs';

// refresh page
var refreshPage = () => {
  window.location.reload();
}

var getAddr = () => {

  $('.loading-holder').removeClass('loading-hidden');

  //set some vars
  let address =   $('#Address'),
      city    =   $('#City'),
      state1   =   $('#State'),
      error   =   $('#error-text');

  let addr    =   address.val().split(' ').join('+'),
      cty    =   city.val().split(' ').join('+'),
      ste   =   state1.val().split(' ').join('+');

  let geoquery = baseurl + 'address=' + addr + ',+' + cty + ',+' + ste + '&key=' + apikey;
      //console.log(geoquery);

  // make sure input field has text
  if ( address.val().length > 0 ) {

    // remove error text if valid submission
    if ( !error.hasClass('hide') ) {

      error.addClass('hide'); // add class back to hide error

    }

    let lat = '';
    let lng = '';

    // make api call go google to turn address into geocodes
    $.ajax({
      type: 'GET',
      url: geoquery,
      success: function(resp) {

        lat = resp.results[0].geometry.location.lat; //32'ish number
        lng = resp.results[0].geometry.location.lng; // -97'ish number
        return lat, lng;


      },
      error: function() {
        console.log('error bro');
      },
      complete: function(){
        // ask the service itself which trash boundary contains the address that was just searched
        const spatialQuery = 'https://gis2.arlingtontx.gov/agsext2/rest/services/OpenData/OD_Community/MapServer/3/query?where=1%3D1&outFields=OBJECTID,RouteDay&returnGeometry=false&outSR=4326&geometryType=esriGeometryPoint&inSR=4326&geometry=' + lng + ',' + lat + '&f=json';

        $.ajax({
          type: 'GET',
          url: spatialQuery,
          success: function(resp) {

            $('.loading-holder').addClass('loading-hidden');

            var data = JSON.parse(resp);

            var areaResult;
            var trashStatus;

            if (data.features.length) {
              areaResult = data.features[0].attributes.RouteDay;
              var currentDay = moment().format('dddd');

              if ( areaResult.indexOf( currentDay ) >= 0 ) {
                trashStatus = 'yes' ;
              } else {
                trashStatus = 'no';
              }
            } else {
              trashStatus = 'Looks like you might not live in arlington?';
            }

            $('#answer').html(`
              <h2 class="trash-status status-${trashStatus}">${trashStatus}</h2>
              <p class="trash-info">Your trash days are ${areaResult}
              `);
          },
          error: function() {
            console.log('error');
          }
        });

      }
    });



    $('#refresh').removeClass('hide');
    $('#addrForm').addClass('hide');

  }

}





// dom ready
$(document).ready(function(){
  $(document.body).show();
  // events go here

  $('#Submit').click(getAddr);

  $('#refresh').click(refreshPage);

});
