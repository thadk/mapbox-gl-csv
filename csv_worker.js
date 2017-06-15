var util = require('mapbox-gl/js/util/util')
var csv2geojson = require('csv2geojson')
var GeoJSONWorkerSource = require('mapbox-gl/js/source/geojson_worker_source')

/*    latfield: 'LATFIELDNAME',
    lonfield: 'LONFIELDNAME',
    delimiter: ','
    */

var getCSV = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'text/plain');
    xhr.onerror = function(e) {
        callback(e);
    };
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
            var data;
            try {
                data = xhr.response;
            } catch (err) {
                return callback(err);
            }
            callback(null, data);
        } else {
            callback(new Error(xhr.statusText));
        }
    };
    xhr.send();
    return xhr;
};

function loadGeoJSON (params, callback) {
  //  cannot defer to the default implementation to grab / JSON.parse the data, which
  // is actually expected to be topojson in our case.
    console.log('data0', params)
    var getCSVCallback = function (err, csvdata) {

        if (err) { return callback(err) }
        csv2geojson.csv2geojson(csvdata, {latfield: 'Latitude', lonfield: 'Longitude', delimiter: ','}, callback);
        //console.log('data', data, params)
    }
    getCSV(params.url, getCSVCallback);

}

function CSVWorkerSource (actor, style) {
  GeoJSONWorkerSource.call(this, actor, style, loadGeoJSON)
}

CSVWorkerSource.prototype = util.inherit(GeoJSONWorkerSource)

module.exports = function (self) {
  self.registerWorkerSource('csv', CSVWorkerSource)
}
