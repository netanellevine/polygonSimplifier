const transformScale = require ('@turf/transform-scale');
const fs = require("fs");


const PATH = '../data';
const file_name = 'Canada_polygon.geojson';
const country_name = file_name.split('_')[0].toLowerCase();
const exmp_dir = 'examples/scaled';

const json =  fs.readFileSync(`${PATH}/${file_name}`);
const data = JSON.parse(json);
console.log(data.features[0].geometry.coordinates[0].length);
// console.log(data.features[0].geometry.coordinates[0]);

const factor = 1.1
var ans = transformScale(data, factor, {origin: 'center'});
console.log(ans.features[0].geometry.coordinates[0].length);
// console.log(ans.features[0].geometry.coordinates[0]);

const s = (String(factor)).replace('.', '');
const new_file_name = `scaled_${country_name}_s-${s}.geojson`;
fs.writeFileSync(`${PATH}/${exmp_dir}/${new_file_name}`, JSON.stringify(ans));
