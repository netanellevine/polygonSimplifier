const geom = require('./simplifier_geometry.js');
const turf = require('./simplifier_turf.js');
const geoj = require('./simplifier_geojson.js');
const conv = require('./simplifier_convex.js');

const file = 'TMR_west.geojson';

// geom.simplifyShape(file, tolerance=0.1);
// turf.simplifyShape(file, tolerance=0.1);
// geoj.simplifyShape(file, tolerance=1);
conv.simplifyShape(file, concavity=Infinity);