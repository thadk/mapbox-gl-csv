var util = require('mapbox-gl/js/util/util')
var GeoJSONSource = require('mapbox-gl/js/source/geojson_source')
var webworkify = require('webworkify')

module.exports = CSVSource

function CSVSource (id, options, dispatcher) {
  GeoJSONSource.call(this, id, options, dispatcher)
}

CSVSource.prototype = util.inherit(GeoJSONSource, {
  type: 'csv'
})

CSVSource.workerSourceURL = URL.createObjectURL(webworkify(require('./csv_worker.js'), {bare: true}))
