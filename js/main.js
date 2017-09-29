const inside = require('point-in-polygon');

const section1 = [-97.096867, 32.759836];
const section2 = [-97.149010, 32.706739];
const section3 = [-97.125776, 32.655476];
const sectionX = [-92.125776, 22.655476];

const query = 'https://gis2.arlingtontx.gov/agsext2/rest/services/OpenData/OD_Community/MapServer/3/query?where=1%3D1&outFields=OBJECTID,RouteDay,SHAPE&outSR=4326&f=json'

const request = new XMLHttpRequest();

var state = '';

request.open('GET', query, true);

request.onload = function() {
  if (this.status >= 200 && this.status < 400) {
    // Success!
    let data = JSON.parse(this.response);
    //console.log(data);

    let north = data.features[0].geometry.rings[0];
    let mid = data.features[1].geometry.rings[0];
    let south = data.features[2].geometry.rings[0];

    function checkAreas() {

      if( inside([ section3[0], section3[1] ], north) ) {
        state = 0;
      } else if (inside([ section3[0], section3[1] ], mid)) {
        state = 1;
      } else if ( inside([ section3[0], section3[1] ], south )) {
        state = 2;
      } else {
        state = 4;
      }

      var areaResult;

      //alert(state);
      if ( state !== 4 ) {
          areaResult = data.features[state].attributes.RouteDay;
      } else {
          areaResult = 'Looks like you might not live in arlington?';
      }

      document.getElementById('answer').outerHTML=areaResult;

    }

    checkAreas();






  } else {
    // We reached our target server, but it returned an error
    console.log('nothing here');
  }
};

request.onerror = function() {
  // There was a connection error of some sort
  console.log('err');
};

request.send();
