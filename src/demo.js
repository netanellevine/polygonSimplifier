const turf = require ('@turf/turf');
const fs = require("fs");


const PATH = '../data';
const file_name = 'australia.geojson';
const country_name = file_name.split('_')[0].toLowerCase();
const exmp_dir = 'examples/scaled';

const json =  fs.readFileSync(`${PATH}/${file_name}`);
const data = JSON.parse(json);
console.log(data.features[0].geometry.coordinates[0].length);
// console.log(data.features[0].geometry.coordinates[0]);

const simplifier = {
    maxPoints: 500,
    highQuality: true,
    mutate: true,
    tolerance: {
        1000: 0.01,
        10000: 0.1,
        100000: 1
    },
    precision: {
        999999999: 6,
        99999999999: 5,
        999999999999: 4,
        9999999999999: 3,
        99999999999999: 2,
    },
    levels: {
        HIGH: 2,
        MEDIUM: 1,
        LOW: 0
    }
};
const area = turf.area(data);
console.log(file_name, area);
let t = Object.keys(simplifier.precision).find(key => area < key);
console.log(simplifier.precision[t]);




// combine
// explode
// convex
// flatten
// polygonize
// lineChunk
// unkinkPolygon
// feature
// featureCollection
// multypolygon -> helpers
// coordAll -> meta
// getCoords -> invariant
// getGeom -> invariant
// concaveman -> @types
// https://github.com/mapbox/concaveman