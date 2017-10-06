const inside = require('point-in-polygon');
const moment = require('moment');

const query = 'https://gis2.arlingtontx.gov/agsext2/rest/services/OpenData/OD_Community/MapServer/3/query?where=1%3D1&outFields=OBJECTID,RouteDay,SHAPE&outSR=4326&f=json'

const baseurl = 'https://maps.googleapis.com/maps/api/geocode/json?';
const geocodeurl = 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=';
const apikey = 'AIzaSyAuEdJ504Geu7RLxBhkjWjlKQ0fQFD9Lrs';

var state = '';

// refresh page
var refreshPage = () => {
  window.location.reload();
}

var getAddr = () => {

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

        $.ajax({
          type: 'GET',
          url: 'https://gis2.arlingtontx.gov/agsext2/rest/services/OpenData/OD_Community/MapServer/3/query?where=1%3D1&outFields=OBJECTID,RouteDay,SHAPE&outSR=4326&f=json',
          success: function(resp) {

            var data = JSON.parse(resp);


            let north = data.features[0].geometry.rings[0];
            let mid = data.features[1].geometry.rings[0];
            let south = data.features[2].geometry.rings[0];

            function checkAreas() {

              if( inside([ lng, lat ], north) ) {
                state = 0;
              } else if (inside([ lng, lat ], mid)) {
                state = 1;
              } else if ( inside([ lng, lat ], south )) {
                state = 2;
              } else {
                state = 4;
              }

              var areaResult;
              var trashStatus;
              var statusColor;

              //alert(state);
              if ( state !== 4 ) {
                  areaResult = data.features[state].attributes.RouteDay;
                  var currentDay = moment().format('dddd');

                  if ( areaResult.includes( currentDay ) ) {
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

            }

            checkAreas();

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

  // events go here

  $('#Submit').click(getAddr);

  $('#refresh').click(refreshPage);

});
